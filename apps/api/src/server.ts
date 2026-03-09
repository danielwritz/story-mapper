import cors from 'cors';
import express from 'express';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    received: req.body ?? null
  });
});

export { app };
