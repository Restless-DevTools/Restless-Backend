import Joi from 'joi';

function ResponseValidator(req, res, next) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.email().required(),
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

export default { ResponseValidator };
