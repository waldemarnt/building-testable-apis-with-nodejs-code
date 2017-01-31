import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import database from './config/database'

const app = express();

export default () => {
  return database.connect()
  .then(() => {
    app.use(bodyParser.json());
    app.use('/', routes);

    return app;
  });
}
