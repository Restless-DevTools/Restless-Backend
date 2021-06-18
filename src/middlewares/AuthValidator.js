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

function githubLoginValidator(req, res, next) {
  const schema = Joi.object().keys({
    code: Joi.string().required(),
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
  const allowedRoutes = [
    '/auth/login',
    '/auth/github-login',
    '/auth/validate-token',
    '/auth/request-recover-password',
    '/auth/recover-password',
    '/users/create',
  ];

  if (allowedRoutes.includes(req.url)) {
    next();
    return;
  }

  if (process.env.NODE_ENV === 'test') {
    req.user = { user: { username: 'Test', id: req.headers['x-test-user'] } };
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
        message: 'Token is not valid',
      }, 401);
    }
  } else {
    LoggerHelper.addResponseError(res, {
      message: 'Token is not valid',
    }, 401);
  }
}

function requestRecoverPasswordValidator(req, res, next) {
  const schema = Joi.object().keys({
    username: Joi.string(),
    email: Joi.string().email(),
  }).or(['username', 'email']);
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    next();
  } else {
    res.status(400);
    res.send({ code: result.error.details[0].path[0], message: result.error.details[0].message });
  }
}

function recoverPasswordValidator(req, res, next) {
  const schema = Joi.object().keys({
    verificationCode: Joi.number().required(),
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

export default {
  loginValidator,
  githubLoginValidator,
  checkTokenBody,
  authorizeRequest,
  requestRecoverPasswordValidator,
  recoverPasswordValidator,
};
