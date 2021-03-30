import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './config/routes';
import AuthValidator from './middlewares/AuthValidator';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('root', __dirname);
app.use(cors());
app.use(AuthValidator.authorizeRequest);
app.use(routes);

export default app;
