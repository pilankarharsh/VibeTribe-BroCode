import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'VibeTribe API (Production)',
    version: '1.0.0',
    description: 'Interactive API documentation for VibeTribe Production Environment'
  },
  servers: [
    { url: 'https://api.vibetribe.com', description: 'Production' },
    { url: 'http://localhost:5000', description: 'Local Development' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    path.resolve(__dirname, '../routes/**/*.js'),
    path.resolve(__dirname, '../controllers/**/*.js')
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
