import User from '../../../src/models/user';
import AuthService from '../../../src/services/auth';

describe('Routes: Users', () => {
  const defaultId = '56cb91bdc3464f14678934ca';
  const defaultAdmin = {
    name: 'Jhon Doe',
    email: 'jhon@mail.com',
    password: '123password',
    role: 'admin'
  };
  const expectedAdminUser = {
    _id: defaultId,
    name: 'Jhon Doe',
    email: 'jhon@mail.com',
    role: 'admin'
  };
  const authToken = AuthService.generateToken(expectedAdminUser);

  beforeEach(async () => {
    const user = new User(defaultAdmin);
    user._id = '56cb91bdc3464f14678934ca';
    await User.deleteMany({});
    await user.save();
  });

  afterEach(async () => await User.deleteMany({}));

  describe('GET /users', () => {
    it('should return a list of users', done => {

      request
        .get('/users')
        .set({'x-access-token': authToken})
        .end((err, res) => {
          expect(res.body).to.eql([expectedAdminUser]);
          done(err);
        });
    });

    context('when an id is specified', done => {
      it('should return 200 with one user', done => {

        request
          .get(`/users/${defaultId}`)
          .set({'x-access-token': authToken})
          .end((err, res) => {
            expect(res.statusCode).to.eql(200);
            expect(res.body).to.eql([expectedAdminUser]);
            done(err);
          });
      });
    });
  });

  describe('POST /users', () => {
    context('when posting an user', () => {
      it('should return a new user with status code 201', done => {
        const customId = '56cb91bdc3464f14678934ba';
        const newUser = Object.assign({}, { _id: customId, __v: 0 }, defaultAdmin);
        const expectedSavedUser = {
          _id: customId,
          name: 'Jhon Doe',
          email: 'jhon@mail.com',
          role: 'admin'
        };

        request
          .post('/users')
          .set({'x-access-token': authToken})
          .send(newUser)
          .end((err, res) => {
            expect(res.statusCode).to.eql(201);
            expect(res.body).to.eql(expectedSavedUser);
            done(err);
          });
      });
    });
  });

  describe('PUT /users/:id', () => {
    context('when editing an user', () => {
      it('should update the user and return 200 as status code', done => {
        const customUser = {
          name: 'Din Doe'
        };
        const updatedUser = Object.assign({}, defaultAdmin, customUser);

        request
          .put(`/users/${defaultId}`)
          .set({'x-access-token': authToken})
          .send(updatedUser)
          .end((err, res) => {
            expect(res.status).to.eql(200);
            done(err);
          });
      });
    });
  });

  describe('DELETE /users/:id', () => {
    context('when deleting an user', () => {
      it('should delete an user and return 204 as status code', done => {

        request
          .delete(`/users/${defaultId}`)
          .set({'x-access-token': authToken})
          .end((err, res) => {
            expect(res.status).to.eql(204);
            done(err);
          });
      });
    });
  });

  context('when authenticating an user', () => {
    it('should generate a valid token', done => {

      request
        .post(`/users/authenticate`)
        .send({
          email: 'jhon@mail.com',
          password: '123password'
        })
        .end((err, res) => {
          expect(res.body).to.have.key('token');
          expect(res.status).to.eql(200);
          done(err);
        });
    });

    it('should return unauthorized when the password does not match', done => {

      request
        .post(`/users/authenticate`)
        .send({
          email: 'jhon@mail.com',
          password: 'wrongpassword'
        })
        .end((err, res) => {
          expect(res.status).to.eql(401);
          done(err);
        });
    });
  });


});
