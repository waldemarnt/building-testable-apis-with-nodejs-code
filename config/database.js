import mongoose from 'mongoose';
import config from 'config';

mongoose.Promise = Promise;

const mongodbUrl = process.env.MONGODB_URL || config.get('database.mongoUrl');

const connect = () => mongoose.connect(mongodbUrl, {
  useMongoClient: true
});

export default {
  connect
}
