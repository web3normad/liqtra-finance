import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';
import { validateAddress, validateRiskLevel } from '../middleware/validation.middleware';

export default function portfolioRoutes(controller: PortfolioController) {
  const router = Router();

  // GET /api/portfolio/:address
  router.get('/:address', validateAddress, (req, res) =>
    controller.getPortfolio(req, res)
  );

  // GET /api/portfolio/:address/history?days=30
  router.get('/:address/history', validateAddress, (req, res) =>
    controller.getPortfolioHistory(req, res)
  );

  // PUT /api/portfolio/:address/risk-level
  router.put('/:address/risk-level', validateAddress, validateRiskLevel, (req, res) =>
    controller.updateRiskLevel(req, res)
  );

  return router;
}
