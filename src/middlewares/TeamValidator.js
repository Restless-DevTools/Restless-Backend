import Joi from 'joi';

function TeamValidator(req, res, next) {
  const integrantsSchema = Joi.object().keys({
    userId: Joi.number().required(),
  });
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    integrants: Joi.array().items(integrantsSchema),
  });
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    next();
  } else {
    res.status(400);
    res.send({ code: result.error.details[0].path[0], message: result.error.details[0].message });
  }
}

export default { TeamValidator };
