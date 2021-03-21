import Joi from 'joi';

function RequestValidator(req, res, next) {
  const requestBodySchema = Joi.object().keys({
    body: Joi.object().keys({}),
  });
  const requestHeaderSchema = Joi.object().keys({
    name: Joi.string().required(),
    value: Joi.string().required(),
  });
  const requestQuerySchema = Joi.object().keys({
    name: Joi.string().required(),
    value: Joi.string().required(),
  });
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required(),
    method: Joi.string().required(),
    userId: Joi.number().required(),
    teamId: Joi.number().required(),
    groupId: Joi.number().required(),
    requestBody: requestBodySchema,
    requestHeaders: Joi.array().items(requestHeaderSchema),
    requestQueries: Joi.array().items(requestQuerySchema),
  });
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    next();
  } else {
    res.status(400);
    res.send({ code: result.error.details[0].path[0], message: result.error.details[0].message });
  }
}

export default { RequestValidator };