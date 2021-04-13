import Joi from 'joi';

const languages = [
  'typescript', 'javascript', 'css',
  'less', 'scss', 'json',
  'html', 'xml', 'php',
  'razor', 'csharp', 'cpp',
  'markdown', 'diff', 'java',
  'vb', 'coffeescript', 'handlebars',
  'batch', 'pug', 'fsharp',
  'lua', 'powershell', 'python',
  'ruby', 'sass', 'r',
  'objective-c', 'sql', 'go',
];

function SnippetValidator(req, res, next) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    description: Joi.string().required(),
    language: Joi.string().required().valid(languages),
    shareOption: Joi.string().required().valid(['PUBLIC', 'PRIVATE', 'TEAM', 'USER']),
  });
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    next();
  } else {
    res.status(400);
    res.send({ code: result.error.details[0].path[0], message: result.error.details[0].message });
  }
}

export default { SnippetValidator };
