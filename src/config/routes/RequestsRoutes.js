import RequestController from '../../controllers/RequestController';
import RequestValidator from '../../middlewares/RequestValidator';

export default async function RequestsRoutes(router) {
  router.get('/requests/all', (req, res) => RequestController.getAllRequests(req, res));
  router.post('/requests/create',
    (req, res, next) => RequestValidator.RequestValidator(req, res, next),
    (req, res) => RequestController.create(req, res));
  router.put('/requests/update/:id',
    (req, res) => RequestController.edit(req, res));
  router.get('/requests/show/:id', (req, res) => RequestController.getRequest(req, res));
  router.delete('/requests/delete/:id', (req, res) => RequestController.delete(req, res));
  return router;
}
