import { Router } from 'express';
import { ActionsController } from '../controllers/actions.controller';
import { validateAddress } from '../middleware/validation.middleware';

export default function actionsRoutes(controller: ActionsController) {
  const router = Router();

  // GET /api/actions/:address?limit=20
  router.get('/:address', validateAddress, (req, res) =>
    controller.getActions(req, res)
  );

  // GET /api/actions/:address/status/:status
  router.get('/:address/status/:status', validateAddress, (req, res) =>
    controller.getActionsByStatus(req, res)
  );

  // GET /api/actions/:address/stats
  router.get('/:address/stats', validateAddress, (req, res) =>
    controller.getStats(req, res)
  );

  return router;
}
