import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateAddress, validateRiskLevel } from '../middleware/validation.middleware';

export default function userRoutes(controller: UserController) {
  const router = Router();

  // POST /api/users/register
  router.post('/register', validateAddress, (req, res) =>
    controller.registerUser(req, res)
  );

  // GET /api/users/:address
  router.get('/:address', validateAddress, (req, res) =>
    controller.getUser(req, res)
  );

  // GET /api/users/:address/exists
  router.get('/:address/exists', validateAddress, (req, res) =>
    controller.checkUserExists(req, res)
  );

  // PUT /api/users/:address
  router.put('/:address', validateAddress, (req, res) =>
    controller.updateUser(req, res)
  );

  // DELETE /api/users/:address
  router.delete('/:address', validateAddress, (req, res) =>
    controller.deleteUser(req, res)
  );

  return router;
}
