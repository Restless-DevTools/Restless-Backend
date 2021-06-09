import CollectionController from '../../controllers/CollectionController';
import CollectionValidator from '../../middlewares/CollectionValidator';

export default async function CollectionsRoutes(router) {
  router.get('/collections/all', (req, res) => CollectionController.getAllCollections(req, res));
  router.get('/collections/public', (req, res) => CollectionController.getAllPublicCollections(req, res));
  router.post('/collections/create',
    (req, res, next) => CollectionValidator.CollectionValidator(req, res, next),
    (req, res) => CollectionController.create(req, res));
  router.put('/collections/update/:id',
    (req, res) => CollectionController.edit(req, res));
  router.get('/collections/show/:id', (req, res) => CollectionController.getCollection(req, res));
  router.delete('/collections/delete/:id', (req, res) => CollectionController.delete(req, res));
  return router;
}
