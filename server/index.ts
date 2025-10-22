import dotenv from 'dotenv';
dotenv.config();

import type { Express } from 'express';
import express from 'express';
import { createServer, type Server as HttpServer } from 'http';
import session from 'express-session';
import MemoryStore from 'memorystore';
import {Liquid} from 'liquidjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { registerRoutes } from './routes';
import { setupVite } from './vite';

const port = process.env.PORT || 5000;

async function main() {
  const app = express();

  // Session middleware
  const sessionMiddleware = session({
    store: new (MemoryStore(session))({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  });
  app.use(sessionMiddleware);

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Templating engine
  const engine = new Liquid({
    root: path.resolve(__dirname, '..', 'client', 'views'),
    extname: '.liquid'
  });
  app.engine('liquid', engine.express());
  app.set('view engine', 'liquid');

  // Register API routes and get the httpServer
  const httpServer = await registerRoutes(app);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist/client'));
  } else {
    await setupVite(app);
  }

  httpServer.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
  });
}

main().catch(console.error);
