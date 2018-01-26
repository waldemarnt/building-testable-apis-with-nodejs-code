import { Seeder } from 'mongoose-data-seed';
import User from '../../src/models/user';

const data = [{
  name: 'Jhon Doe',
  email: 'jhon@mail.com',
  password: '123password',
  role: 'admin'
},{
  name: 'User Doe',
  email: 'user@mail.com',
  password: '123password',
  role: 'user'
}];

class UsersSeeder extends Seeder {

  async shouldRun() {
    return User.count().exec().then(count => count === 0);
  }

  async run() {
    return User.create(data);
  }
}

export default UsersSeeder;
