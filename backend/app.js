import express from "express";
import cors from "cors";
import authRoute from './routes/auth.routes.js'
import usersRoute from './routes/users.routes.js'
import postsRoute from './routes/posts.routes.js'
import commentsRoute from './routes/comments.routes.js'
import feedRoute from './routes/feed.routes.js'
import accountRoute from './routes/account.routes.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/feed', feedRoute);
app.use('/api/account', accountRoute);

// API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use((req, res, _next) => {
  return res.status(404).json({ error: 'Not found' });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ error: message });
});

export default app;