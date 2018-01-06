import jwt from 'jsonwebtoken';
import config from 'config';

export default (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return next();
  }
  jwt.verify(token, config.get('auth.key'), (err, decoded) => {
    if (err) {
      return res.send(err);
    }
    req.decoded = decoded;
    next();
  });
};
