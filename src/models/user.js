import mongoose from 'mongoose';
import Util from 'util';
import bcrypt from 'bcrypt';

const hashAsync = Util.promisify(bcrypt.hash);
const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

schema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) {
    return next();
  }
  try {
    const hashedPassword = await hashAsync(this.password, 10);
    this.password = hashedPassword;
  } catch (error) {
    next(err);
  }
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
