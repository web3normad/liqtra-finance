// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { DatabaseService } from './services/database.service';
// import { BlockchainService } from './services/blockchain.service';
// import { UserController } from './controllers/user.controller';
// import { PortfolioController } from './controllers/portfolio.controller';
// import { ActionsController } from './controllers/actions.controller';
// import { TransactionController } from './controllers/transaction.controller';
// import healthRoutes from './routes/health.routes';
// import userRoutes from './routes/user.routes';
// import portfolioRoutes from './routes/portfolio.routes';
// import actionsRoutes from './routes/actions.routes';
// import transactionRoutes from './routes/transaction.routes';
// import { errorHandler, notFound } from './middleware/error.middleware';
// import Logger from './utils/logger';

// dotenv.config({ path: '../.env' });

// const logger = new Logger('SERVER');

// const PORT = process.env.PORT || 3000;
// const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/floquidity';
// const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
// const VAULT_ADDRESS = process.env.VAULT_CONTRACT_ADDRESS || '';

// if (!VAULT_ADDRESS) {
//   logger.error('VAULT_CONTRACT_ADDRESS not set!');
//   process.exit(1);
// }

// async function startServer() {
//   // Initialize services
//   const database = new DatabaseService(DATABASE_URL);
//   const blockchain = new BlockchainService(RPC_URL, VAULT_ADDRESS);
  
//   // Initialize blockchain service (get USDC address)
//   await blockchain.initialize();

//   // Initialize controllers
//   const userController = new UserController(database, blockchain);
//   const portfolioController = new PortfolioController(database, blockchain);
//   const actionsController = new ActionsController(database);
//   const transactionController = new TransactionController(database, blockchain);

//   // Create Express app
//   const app = express();

//   // Middleware
//   app.use(cors());
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));

//   // Request logging
//   app.use((req, res, next) => {
//     logger.info(`${req.method} ${req.path}`);
//     next();
//   });

//   // Routes
//   app.use('/', healthRoutes);
//   app.use('/api/users', userRoutes(userController));
//   app.use('/api/portfolio', portfolioRoutes(portfolioController));
//   app.use('/api/actions', actionsRoutes(actionsController));
//   app.use('/api/transactions', transactionRoutes(transactionController));

//   // Error handling
//   app.use(notFound);
//   app.use(errorHandler);

//   // Start server
//   app.listen(PORT, () => {
//     logger.info(`
// ╔════════════════════════════════════════════════════════════╗
// ║                                                            ║
// ║           🚀 FLOQUIDITY API STARTED 🚀                     ║
// ║                                                            ║
// ║  Port: ${PORT.toString().padEnd(51)}║
// ║  Database: Connected${' '.padEnd(39)}║
// ║  Blockchain: ${RPC_URL.slice(0, 30)}...${' '.padEnd(13)}║
// ║  Vault: ${VAULT_ADDRESS.slice(0, 20)}...${' '.padEnd(20)}║
// ║  USDC: ${blockchain.getUSDCAddress().slice(0, 20)}...${' '.padEnd(21)}║
// ║                                                            ║
// ║  Endpoints:                                                ║
// ║  - GET  /health                                            ║
// ║  - POST /api/users/register                                ║
// ║  - GET  /api/portfolio/:address                            ║
// ║  - GET  /api/transactions/:address/balance                 ║
// ║  - POST /api/transactions/approve                          ║
// ║  - POST /api/transactions/deposit                          ║
// ║  - POST /api/transactions/withdraw                         ║
// ║                                                            ║
// ╚════════════════════════════════════════════════════════════╝
//     `);
//   });

//   // Graceful shutdown
//   process.on('SIGINT', async () => {
//     logger.info('Shutting down gracefully...');
//     await database.close();
//     process.exit(0);
//   });
// }

// startServer().catch(error => {
//   logger.error('Failed to start server', error);
//   process.exit(1);
// });


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseService } from './services/database.service';
import { BlockchainService } from './services/blockchain.service';
import { UserController } from './controllers/user.controller';
import { PortfolioController } from './controllers/portfolio.controller';
import { ActionsController } from './controllers/actions.controller';
import { TransactionController } from './controllers/transaction.controller';
import healthRoutes from './routes/health.routes';
import userRoutes from './routes/user.routes';
import portfolioRoutes from './routes/portfolio.routes';
import actionsRoutes from './routes/actions.routes';
import transactionRoutes from './routes/transaction.routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import Logger from './utils/logger';

dotenv.config({ path: '../.env' });

const logger = new Logger('SERVER');

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/floquidity';
const IS_TESTNET = process.env.NODE_ENV !== 'production';
const RPC_URL = IS_TESTNET 
  ? (process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org')
  : (process.env.BASE_RPC_URL || 'https://mainnet.base.org');
const VAULT_ADDRESS = process.env.VAULT_CONTRACT_ADDRESS || '';

if (!VAULT_ADDRESS) {
  logger.error('VAULT_CONTRACT_ADDRESS not set in .env!');
  logger.error('Please deploy the contract and set VAULT_CONTRACT_ADDRESS in your .env file');
  process.exit(1);
}

async function startServer() {
  try {
    logger.info('Starting Floquidity API...');

    // Initialize services
    logger.info('Initializing database...');
    const database = new DatabaseService(DATABASE_URL);
    
    logger.info('Initializing blockchain service...');
    const blockchain = new BlockchainService(RPC_URL, VAULT_ADDRESS);
    
    // IMPORTANT: Initialize blockchain service to get USDC address
    await blockchain.initialize();

    // Verify USDC address was loaded
    const usdcAddress = blockchain.getUSDCAddress();
    if (!usdcAddress || usdcAddress === '') {
      logger.error('Failed to load USDC address from vault contract');
      logger.error('Make sure your vault contract is deployed correctly');
      process.exit(1);
    }

    logger.info(`USDC address loaded: ${usdcAddress}`);

    // Initialize controllers
    const userController = new UserController(database, blockchain);
    const portfolioController = new PortfolioController(database, blockchain);
    const actionsController = new ActionsController(database);
    const transactionController = new TransactionController(database, blockchain);

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
    app.use('/api/transactions', transactionRoutes(transactionController));

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
║  Network: ${(IS_TESTNET ? 'Base Sepolia (Testnet)' : 'Base Mainnet').padEnd(44)}║
║  Database: Connected${' '.padEnd(39)}║
║  RPC: ${RPC_URL.slice(0, 45)}...${' '.padEnd(0)}║
║  Vault: ${VAULT_ADDRESS.slice(0, 20)}...${' '.padEnd(20)}║
║  USDC: ${usdcAddress.slice(0, 20)}...${' '.padEnd(21)}║
║                                                            ║
║  API Endpoints:                                            ║
║  - GET  /health                                            ║
║  - POST /api/users/connect                                 ║
║  - GET  /api/portfolio/:address                            ║
║  - GET  /api/transactions/:address/balance                 ║
║  - POST /api/transactions/approve                          ║
║  - POST /api/transactions/deposit                          ║
║  - POST /api/transactions/withdraw                         ║
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

  } catch (error: any) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
startServer();
