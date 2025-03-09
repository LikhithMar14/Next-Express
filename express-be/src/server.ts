import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { appConfig } from './config/app.config';
import passport from './config/passport.config';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes/index.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
export const app: Express = express();

// Apply app configuration
appConfig(app);

// Initialize Passport
app.use(passport.initialize());

// Register all routes
app.use('/api', routes);
app.get('/auth/google/callback-test', (req, res) => {
    res.send('Route exists!');
  });



// Error handling middleware (must be last)
app.use(errorHandler);