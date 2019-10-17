import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import Console from 'console';
import routes from './config/routes';
import models from './models';
// import AuthValidator from './middlewares/AuthValidator';

const PORT = process.env.EXPRESS_PORT || 3008;
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('root', __dirname);
app.use(cors());
// app.use(AuthValidator);
app.use(routes);
models.sequelize.sync().then(() => {
  app.listen(process.env.PORT || PORT, () => {
    Console.log(`App is running on port ${PORT}`);
  });
});


export default app;
