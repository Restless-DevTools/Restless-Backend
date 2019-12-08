import express from 'express';
import GroupController from '../controllers/GroupController';
import GroupValidator from '../middlewares/GroupValidator';

const route = express();

// group routes
route.get('/groups/all', (req, res) => GroupController.getAllGroups(req, res));
route.post('/groups/create',
  (req, res, next) => GroupValidator.GroupValidator(req, res, next),
  (req, res) => GroupController.create(req, res));
// route.put('/previsao/update/:id',
//   (req, res) => previsaoController.edit(req, res));
// route.get('/previsao/show/:id', (req, res) => previsaoController.singlePrevisao(req, res));
// route.delete('/previsao/delete/:id', (req, res) => previsaoController.delete(req, res));

export default route;
