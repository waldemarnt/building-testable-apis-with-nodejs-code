import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', schema);

export default User;
