import mongoose from 'mongoose';
import config from 'config';

const mongodbUrl = config.get('database.mongoUrl');

const connect = () =>
  mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

export default {
  connect,
  connection: mongoose.connection
};
