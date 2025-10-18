import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseService } from './services/database.service';
import { BlockchainService } from './services/blockchain.service';
import { UserController } from './controllers/user.controller';
import { PortfolioController } from './controllers/portfolio.controller';
import { ActionsController } from './controllers/actions.controller';
import healthRoutes from './routes/health.routes';
import userRoutes from './routes/user.routes';
import portfolioRoutes from './routes/portfolio.routes';
import actionsRoutes from './routes/actions.routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import Logger from './utils/logger';

dotenv.config({ path: '../.env' });

const logger = new Logger('SERVER');

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/floquidity';
const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
const VAULT_ADDRESS = process.env.VAULT_CONTRACT_ADDRESS || '';

if (!VAULT_ADDRESS) {
  logger.warn('VAULT_CONTRACT_ADDRESS not set. Some features may not work.');
}

// Initialize services
const database = new DatabaseService(DATABASE_URL);
const blockchain = new BlockchainService(RPC_URL, VAULT_ADDRESS);

// Initialize controllers
const userController = new UserController(database, blockchain);
const portfolioController = new PortfolioController(database, blockchain);
const actionsController = new ActionsController(database);

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/', healthRoutes);
app.use('/api/users', userRoutes(userController));
app.use('/api/portfolio', portfolioRoutes(portfolioController));
app.use('/api/actions', actionsRoutes(actionsController));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           🚀 FLOQUIDITY API STARTED 🚀                     ║
║                                                            ║
║  Port: ${PORT.toString().padEnd(51)}║
║  Database: Connected${' '.padEnd(39)}║
║  Blockchain: ${RPC_URL.slice(0, 30)}...${' '.padEnd(13)}║
║                                                            ║
║  Endpoints:                                                ║
║  - GET  /health                                            ║
║  - POST /api/users/register                                ║
║  - GET  /api/users/:address                                ║
║  - GET  /api/portfolio/:address                            ║
║  - GET  /api/actions/:address                              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await database.close();
  process.exit(0);
});
