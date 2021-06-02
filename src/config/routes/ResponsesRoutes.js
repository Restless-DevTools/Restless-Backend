import ResponseController from '../../controllers/ResponseController';

export default async function ResponsesRoutes(router) {
  router.get('/responses/all', (req, res) => ResponseController.getAllResponses(req, res));
  router.get('/responses/show/:id', (req, res) => ResponseController.getResponse(req, res));
  router.delete('/responses/delete/:id', (req, res) => ResponseController.delete(req, res));
}
