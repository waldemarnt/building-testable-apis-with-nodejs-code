import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import database from '../config/database';
import acl from 'express-acl';
import authMiddleware from './middlewares/auth';

const app = express();

acl.config({
  baseUrl: '/',
  path: 'config'
});

const configureExpress = () => {
  app.use(bodyParser.json());
  app.use(authMiddleware);
  app.use(acl.authorize.unless({ path: ['/users/authenticate'] }));

  app.use('/', routes);

  return app;
};

export default () => database.connect().then(configureExpress);
