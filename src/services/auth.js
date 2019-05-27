import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

class Auth {
  constructor(User) {
    this.User = User;
  }

  authenticate(data) {
    return this.User.findOne({ email: data.email }).then(user => {
      if (!user) {
        return false;
      }
      return bcrypt
        .compare(data.password, user.password)
        .then(res => (res ? user : false));
    });
  }

  static generateToken(payload) {
    return jwt.sign(payload, config.get('auth.key'), {
      expiresIn: config.get('auth.tokenExpiresIn')
    });
  }
}

export default Auth;
