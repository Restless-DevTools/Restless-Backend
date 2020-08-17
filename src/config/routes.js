import express from 'express';
import GroupController from '../controllers/GroupController';
import GroupValidator from '../middlewares/GroupValidator';
import TeamController from '../controllers/TeamController';
import TeamValidator from '../middlewares/TeamValidator';
import UserValidator from '../middlewares/UserValidator';
import UserController from '../controllers/UserController';

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

// user routes
route.get('/users/all', (req, res) => UserController.getAllUsers(req, res));
route.post('/users/create',
  (req, res, next) => UserValidator.userValidator(req, res, next),
  (req, res) => UserController.create(req, res));
route.put('/users/update/:id',
  (req, res) => UserController.edit(req, res));
route.get('/users/show/:id', (req, res) => UserController.getUser(req, res));
route.delete('/users/delete/:id', (req, res) => UserController.delete(req, res));

// login routes
route.post('/auth/login',
  (req, res, next) => UserValidator.loginValidator(req, res, next),
  (req, res) => UserController.login(req, res));

export default route;
