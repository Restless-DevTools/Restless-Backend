import SnippetController from '../../controllers/SnippetController';
import SnippetValidator from '../../middlewares/SnippetValidator';

export default async function SnippetsRoutes(router) {
  router.get('/snippets/all', (req, res) => SnippetController.getAllSnippets(req, res));
  router.post('/snippets/create',
    (req, res, next) => SnippetValidator.SnippetValidator(req, res, next),
    (req, res) => SnippetController.create(req, res));
  router.put('/snippets/update/:id',
    (req, res) => SnippetController.edit(req, res));
  router.get('/snippets/show/:id', (req, res) => SnippetController.getSnippet(req, res));
  router.delete('/snippets/delete/:id', (req, res) => SnippetController.delete(req, res));
  return router;
}
