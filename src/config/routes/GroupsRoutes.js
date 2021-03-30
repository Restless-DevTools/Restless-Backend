import GroupController from '../../controllers/GroupController';
import GroupValidator from '../../middlewares/GroupValidator';

export default async function GroupsRoutes(router) {
  router.get('/groups/all', (req, res) => GroupController.getAllGroups(req, res));
  router.post('/groups/create',
    (req, res, next) => GroupValidator.GroupValidator(req, res, next),
    (req, res) => GroupController.create(req, res));
  router.put('/groups/update/:id',
    (req, res) => GroupController.edit(req, res));
  router.get('/groups/show/:id', (req, res) => GroupController.getGroup(req, res));
  router.delete('/groups/delete/:id', (req, res) => GroupController.delete(req, res));
  return router;
}
