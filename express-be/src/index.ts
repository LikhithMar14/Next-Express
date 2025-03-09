import { app } from './server';

const port = process.env.PORT || 8000;

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});