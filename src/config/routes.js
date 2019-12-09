import express from 'express';
import GroupController from '../controllers/GroupController';
import GroupValidator from '../middlewares/GroupValidator';
import TeamController from '../controllers/TeamController';
import TeamValidator from '../middlewares/TeamValidator';

const route = express();

// group routes
route.get('/groups/all', (req, res) => GroupController.getAllGroups(req, res));
route.post('/groups/create',
  (req, res, next) => GroupValidator.GroupValidator(req, res, next),
  (req, res) => GroupController.create(req, res));
route.put('/groups/update/:id',
  (req, res) => GroupController.edit(req, res));
route.get('/groups/show/:id', (req, res) => GroupController.getGroup(req, res));
route.delete('/groups/delete/:id', (req, res) => GroupController.delete(req, res));

// team routes
route.get('/teams/all', (req, res) => TeamController.getAllTeams(req, res));
route.post('/teams/create',
  (req, res, next) => TeamValidator.TeamValidator(req, res, next),
  (req, res) => TeamController.create(req, res));
route.put('/teams/update/:id',
  (req, res) => TeamController.edit(req, res));
route.get('/teams/show/:id', (req, res) => TeamController.getTeam(req, res));
route.delete('/teams/delete/:id', (req, res) => TeamController.delete(req, res));


export default route;
