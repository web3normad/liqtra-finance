import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { validateAddress } from '../middleware/validation.middleware';

export default function transactionRoutes(controller: TransactionController) {
  const router = Router();

  // GET /api/transactions/contracts
  router.get('/contracts', (req, res) =>
    controller.getContracts(req, res)
  );

  // GET /api/transactions/:address/balance
  router.get('/:address/balance', validateAddress, (req, res) =>
    controller.getBalance(req, res)
  );

  // POST /api/transactions/approve
  router.post('/approve', validateAddress, (req, res) =>
    controller.buildApprove(req, res)
  );

  // POST /api/transactions/deposit
  router.post('/deposit', validateAddress, (req, res) =>
    controller.buildDeposit(req, res)
  );

  // POST /api/transactions/withdraw
  router.post('/withdraw', validateAddress, (req, res) =>
    controller.buildWithdraw(req, res)
  );

  return router;
}
