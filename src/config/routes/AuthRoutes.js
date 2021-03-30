import AuthController from '../../controllers/AuthController';
import AuthValidator from '../../middlewares/AuthValidator';

export default async function AuthRoutes(router) {
  router.post('/auth/login',
    (req, res, next) => AuthValidator.loginValidator(req, res, next),
    (req, res) => AuthController.login(req, res));
  router.post('/auth/validate-token',
    (req, res, next) => AuthValidator.checkTokenBody(req, res, next),
    (req, res) => AuthController.validateToken(req, res));
  return router;
}
