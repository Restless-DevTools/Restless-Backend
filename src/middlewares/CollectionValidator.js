import Joi from 'joi';

function CollectionValidator(req, res, next) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    permissionType: Joi.string().required().valid(['PUBLIC', 'PRIVATE', 'TEAM']),
    description: Joi.string().allow('', null),
    teamId: Joi.number(),
  });
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    next();
  } else {
    res.status(400);
    res.send({ code: result.error.details[0].path[0], message: result.error.details[0].message });
  }
}

export default { CollectionValidator };
