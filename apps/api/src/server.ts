import express from 'express';
import { exportRouter } from './routes/export';

const app = express();

app.use(express.json());
app.use('/api/story-maps', exportRouter);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
  });
}

export { app };
