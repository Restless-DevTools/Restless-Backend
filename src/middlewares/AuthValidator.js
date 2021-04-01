import Joi from 'joi';
import AuthService from '../services/AuthService';
import LoggerHelper from '../helpers/Logger';

const authService = new AuthService();

function loginValidator(req, res, next) {
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    next();
  } else {
    res.status(400);
    res.send({ code: result.error.details[0].path[0], message: result.error.details[0].message });
  }
}

function checkTokenBody(req, res, next) {
  const schema = Joi.object().keys({
    token: Joi.string().required(),
  });
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    next();
  } else {
    res.status(400);
    res.send({ code: result.error.details[0].path[0], message: result.error.details[0].message });
  }
}

async function authorizeRequest(req, res, next) {
  const allowedRoutes = ['/auth/login', '/auth/validate-token', '/users/create'];

  if (allowedRoutes.includes(req.url) || process.env.NODE_ENV === 'test') {
    next();
    return;
  }

  const token = req.headers.authorization;
  if (token) {
    req.user = authService.validateToken(token);
    if (req.user) {
      next();
    } else {
      LoggerHelper.addResponseError(res, {
        message: 'O token fornecido não é valido',
      }, 401);
    }
  } else {
    LoggerHelper.addResponseError(res, {
      message: 'Nenhum token fornecido',
    }, 401);
  }
}

export default { loginValidator, checkTokenBody, authorizeRequest };
