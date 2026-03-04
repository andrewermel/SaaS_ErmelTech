import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { swaggerSpec } from './config/swagger.js';
import { authenticateJWT } from './middlewares/authenticateJWT.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import portionRoutes from './routes/portionRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import snackRoutes from './routes/snackRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

// Prometheus metrics (prom-client)
import client from 'prom-client';
// collect default metrics (node process + runtime)
client.collectDefaultMetrics();

// basic http metrics: histogram + counter
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// middleware para medir toda requisição
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route =
      (req.route && (req.route as any).path) || req.path;
    const status = String(res.statusCode);
    httpRequestsTotal
      .labels(req.method, route, status)
      .inc();
    end({ method: req.method, route, status_code: status });
  });
  next();
});

// endpoint para Prometheus scrapear
app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
  } catch (err) {
    res.status(500).send('Error collecting metrics');
  }
});

// Swagger Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

// Servir arquivos estáticos da pasta public
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../public/uploads'))
);

// Public Routes (no authentication)
app.use('/api/v1/public', publicRoutes);

app.use('/api/v1/auth', authRoutes);
app.use(
  '/api/v1/companies',
  authenticateJWT,
  companyRoutes
);
app.use('/api/v1/ingredients', ingredientRoutes);
app.use('/api/v1/portions', portionRoutes);
app.use('/api/v1/snacks', snackRoutes);
app.use('/api/v1/users', userRoutes);

app.get(
  '/protected',
  authenticateJWT,
  (_req: Request, res: Response): Response => {
    return res.json({
      message: 'Authorized access.',
      user: _req.user,
    });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(
    `📚 Swagger Documentation: http://localhost:${PORT}/api-docs`
  );
});
