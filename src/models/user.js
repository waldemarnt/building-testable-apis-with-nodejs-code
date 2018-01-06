import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

schema.pre('save', function(next) {
  const user = this;
  const salt = bcrypt.genSaltSync();
  user.role = 'normalUser';
  user.password = bcrypt.hashSync(user.password, salt);
  next();
});

schema.set('toJSON', {
  transform: (doc, ret, options) => ({
    _id: ret._id,
    email: ret.email,
    name: ret.name,
    role: ret.role
  })
});

const User = mongoose.model('User', schema);

export default User;
