import AuthController from '../../controllers/AuthController';
import AuthValidator from '../../middlewares/AuthValidator';

export default async function AuthRoutes(router) {
  router.post('/auth/login',
    (req, res, next) => AuthValidator.loginValidator(req, res, next),
    (req, res) => AuthController.login(req, res));
  router.post('/auth/validate-token',
    (req, res, next) => AuthValidator.checkTokenBody(req, res, next),
    (req, res) => AuthController.validateToken(req, res));
  router.post('/auth/request-recover-password',
    (req, res, next) => AuthValidator.requestRecoverPasswordValidator(req, res, next),
    (req, res) => AuthController.requestRecoverPassword(req, res));
  router.post('/auth/recover-password',
    (req, res, next) => AuthValidator.recoverPasswordValidator(req, res, next),
    (req, res) => AuthController.recoverPassword(req, res));
  return router;
}
