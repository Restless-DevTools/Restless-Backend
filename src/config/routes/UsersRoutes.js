import UserValidator from '../../middlewares/UserValidator';
import UserController from '../../controllers/UserController';

export default async function UsersRoutes(router) {
  router.get('/users/all', (req, res) => UserController.getAllUsers(req, res));
  router.post('/users/create',
    (req, res, next) => UserValidator.userValidator(req, res, next),
    (req, res) => UserController.create(req, res));
  router.put('/users/update/:id',
    (req, res) => UserController.edit(req, res));
  router.get('/users/show/:id', (req, res) => UserController.getUser(req, res));
  router.delete('/users/delete/:id', (req, res) => UserController.delete(req, res));
  return router;
}
