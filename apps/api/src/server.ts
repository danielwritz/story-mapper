import express from 'express';
import { storyMapsRouter } from './routes/story-maps';

export function createServer() {
  const app = express();
  app.use(express.json());
  app.use('/api/story-maps', storyMapsRouter);
  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createServer().listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}
