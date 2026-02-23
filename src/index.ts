import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { swaggerSpec } from './config/swagger.js';
import { authenticateJWT } from './middlewares/authenticateJWT.js';
import authRoutes from './routes/authRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import portionRoutes from './routes/portionRoutes.js';
import snackRoutes from './routes/snackRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

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

app.use('/api/v1/auth', authRoutes);
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
