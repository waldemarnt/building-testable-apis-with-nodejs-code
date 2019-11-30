import mongoose from "mongoose";

mongoose.Promise = Promise;

const mongodbUrl = process.env.MONGODB_URL || "mongodb://localhost/test";

const connect = () =>
  mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const close = () => mongoose.connection.close();

export default {
  connect,
  close
};
