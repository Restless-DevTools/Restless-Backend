import TeamController from '../../controllers/TeamController';
import TeamValidator from '../../middlewares/TeamValidator';

export default async function TeamsRoutes(router) {
  router.get('/teams/all', (req, res) => TeamController.getAllTeams(req, res));
  router.post('/teams/create',
    (req, res, next) => TeamValidator.TeamValidator(req, res, next),
    (req, res) => TeamController.create(req, res));
  router.put('/teams/update/:id',
    (req, res) => TeamController.edit(req, res));
  router.get('/teams/show/:id', (req, res) => TeamController.getTeam(req, res));
  router.delete('/teams/delete/:id', (req, res) => TeamController.delete(req, res));
  return router;
}
