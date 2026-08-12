import express from 'express';
import { router } from './routes';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(router);
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  return app;
}

if (require.main === module) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  createApp().listen(port, () => {
    console.log(`TaskMaster API listening on http://localhost:${port}`);
  });
}
