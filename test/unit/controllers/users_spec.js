import UsersController from '../../../src/controllers/users';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';
import User from '../../../src/models/user';

describe('Controller: Users', () => {
  const defaultUser = [{
    __v: 0,
    _id: "56cb91bdc3464f14678934ca",
    name: 'Default User',
    email: 'user@mail.com',
    password: 'password',
    role: 'user'
  }];

  const defaultRequest = {
    params: {}
  };

  describe('get() users', () => {
    it('should call send with a list of users', () => {
      const response = {
        send: sinon.spy()
      };
      User.find = sinon.stub();

      User.find.withArgs({}).resolves(defaultUser);

      const usersController = new UsersController(User);

      return usersController.get(defaultRequest, response)
        .then(() => {
          sinon.assert.calledWith(response.send, defaultUser);
        });
    });

    it('should return 400 when an error occurs', () => {
      const request = {};
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      response.status.withArgs(400).returns(response);
      User.find = sinon.stub();
      User.find.withArgs({}).rejects({ message: 'Error' });

      const usersController = new UsersController(User);

      return usersController.get(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'Error');
        });
    });

  });

  describe('getById()', () => {
    it('should call send with one user', () => {
      const fakeId = 'a-fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        send: sinon.spy()
      };

      User.find = sinon.stub();
      User.find.withArgs({ _id: fakeId }).resolves(defaultUser);

      const usersController = new UsersController(User);

      return usersController.getById(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, defaultUser);
        });
    });
  });

  describe('create() user', () => {
    it('should call send with a new user', () => {
      const requestWithBody = Object.assign({}, { body: defaultUser[0] }, defaultRequest);
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };
      class fakeUser {
        save() { }
      }

      response.status.withArgs(201).returns(response);
      sinon.stub(fakeUser.prototype, 'save').withArgs().resolves();

      const usersController = new UsersController(fakeUser);

      return usersController.create(requestWithBody, response)
        .then(() => {
          sinon.assert.calledWith(response.send);
        });
    });

    context('when an error occurs', () => {
      it('should return 422', () => {
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        };

        class fakeUser {
          save() { }
        }

        response.status.withArgs(422).returns(response);
        sinon.stub(fakeUser.prototype, 'save').withArgs().rejects({ message: 'Error' });

        const usersController = new UsersController(fakeUser);

        return usersController.create(defaultRequest, response)
          .then(() => {
            sinon.assert.calledWith(response.status, 422);
          });
      });
    });
  });

  describe('update() user', () => {
    it('should respond with 200 when the user has been updated', () => {
      const fakeId = 'a-fake-id';
      const updatedUser = {
        _id: fakeId,
        name: 'Updated User',
        email: 'user@mail.com',
        password: 'password',
        role: 'user'
      };
      const request = {
        params: {
          id: fakeId
        },
        body: updatedUser
      };
      const response = {
        sendStatus: sinon.spy()
      };
      class fakeUser {
        static findById() { }
        save() { }
      };
      const fakeUserInstance = new fakeUser();

      const saveSpy = sinon.spy(fakeUser.prototype, 'save');
      const findByIdStub = sinon.stub(fakeUser, 'findById');
      findByIdStub.withArgs(fakeId).resolves(fakeUserInstance);

      const usersController = new UsersController(fakeUser);

      return usersController.update(request, response)
        .then(() => {
          sinon.assert.calledWith(response.sendStatus, 200);
          sinon.assert.calledOnce(saveSpy);
        });
    });

    context('when an error occurs', () => {
      it('should return 422', () => {
        const fakeId = 'a-fake-id';
        const updatedUser = {
          _id: fakeId,
          name: 'Updated User',
          email: 'user@mail.com',
          password: 'password',
          role: 'user'
        };
        const request = {
          params: {
            id: fakeId
          },
          body: updatedUser
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        };

        class fakeUser {
          static findById() { }
        }

        const findByIdStub = sinon.stub(fakeUser, 'findById');
        findByIdStub.withArgs(fakeId).rejects({ message: 'Error' });
        response.status.withArgs(422).returns(response);

        const usersController = new UsersController(fakeUser);

        return usersController.update(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'Error');
          });
      });
    });
  });

  describe('delete() user', () => {
    it('should respond with 204 when the user has been deleted', () => {
      const fakeId = 'a-fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        sendStatus: sinon.spy()
      };

      class fakeUser {
        static remove() { }
      }

      const removeStub = sinon.stub(fakeUser, 'remove');

      removeStub.withArgs({ _id: fakeId }).resolves([1]);

      const usersController = new UsersController(fakeUser);

      return usersController.remove(request, response)
        .then(() => {
          sinon.assert.calledWith(response.sendStatus, 204);
        });
    });

    context('when an error occurs', () => {
      it('should return 400', () => {
        const fakeId = 'a-fake-id';
        const request = {
          params: {
            id: fakeId
          }
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        };

        class fakeUser {
          static remove() { }
        }

        const removeStub = sinon.stub(fakeUser, 'remove');

        removeStub.withArgs({ _id: fakeId }).rejects({ message: 'Error' });
        response.status.withArgs(400).returns(response);

        const usersController = new UsersController(fakeUser);

        return usersController.remove(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'Error');
          });
      });
    });
  });

  describe('authenticate', () => {
    it('should authenticate a user', done => {
      const fakeUserModel = {};
      const user = {
        name: 'Jhon Doe',
        email: 'jhondoe@mail.com',
        password: '12345',
        role: 'admin'
      };
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      class FakeAuthService {
        authenticate() {
          return Promise.resolve({
            name: user.name,
            email: user.email,
            password: hashedPassword,
            role: user.role,
            toJSON: () => ({ email: user.email })
          })
        }
      };
    
      const jwtToken = jwt.sign(
        Object.assign({}, user, { password: hashedPassword }),
        config.get('auth.key'),{
          expiresIn: config.get('auth.tokenExpiresIn')
        });
    
      const fakeReq = {
        body: user
      };
      const fakeRes = {
        send: token => {
          expect(token).to.eql({ token: jwtToken });
          done();
        }
      };
      const usersController = new UsersController(fakeUserModel, FakeAuthService);
      usersController.authenticate(fakeReq, fakeRes);
    });

    it('should return 401 when theres no user', () => {
      const fakeUserModel = {};
      const fakeReq = {
        body: {}
      };
      const fakeRes = {
        sendStatus: sinon.spy()
      };
      class FakeAuthService {
        authenticate() {
          return Promise.resolve(false)
        }
      };
      const usersController = new UsersController(fakeUserModel, FakeAuthService);
      return usersController
        .authenticate(fakeReq, fakeRes)
        .then(() => sinon.assert.calledWith(fakeRes.sendStatus, 401));
    });
  });
});

