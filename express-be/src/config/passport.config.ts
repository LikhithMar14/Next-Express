import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { prisma } from "../prisma/db/index";
import bcrypt from 'bcryptjs';
import { extractJwtFromRequest } from '../middleware/auth.middleware';

// Local strategy for email/password authentication
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      passReqToCallback: true // Ensure request object is passed
    },
    async (req, accessToken, refreshToken, profile, done) => { // Fix here
      try {
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { googleId: profile.id },
              { email: profile.emails?.[0]?.value }
            ]
          }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails?.[0]?.value || '',
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            },
          });
        } else if (!user.googleId) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id }
          });
        }

        // Call auth service to handle token generation
        const { generateAccessToken, generateRefreshToken } = require('../services/token.services');
        const newRefreshToken = generateRefreshToken(user.id as unknown as string);

        user = await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: newRefreshToken }
        });

        const newAccessToken = generateAccessToken(user);

        return done(null, {
          user,
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          }
        });
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);


// JWT strategy for protecting routes
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: extractJwtFromRequest,
      secretOrKey: process.env.JWT_SECRET as string,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: payload.id } });

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;