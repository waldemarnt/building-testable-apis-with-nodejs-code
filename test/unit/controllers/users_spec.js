import UsersController from '../../../src/controllers/users';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';
import User from '../../../src/models/user';

describe('Controller: Users', () => {
  const defaultUser = [
    {
      __v: 0,
      _id: '56cb91bdc3464f14678934ca',
      name: 'Default User',
      email: 'user@mail.com',
      password: 'password',
      role: 'user'
    }
  ];

  const defaultRequest = {
    params: {}
  };

  describe('get() users', () => {
    it('should return a list of users', async () => {
      const response = {
        send: sinon.spy()
      };
      User.find = sinon.stub();

      User.find.withArgs({}).resolves(defaultUser);

      const usersController = new UsersController(User);

      await usersController.get(defaultRequest, response);
      sinon.assert.calledWith(response.send, defaultUser);
    });

    it('should return 400 when an error occurs', async () => {
      const request = {};
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      response.status.withArgs(400).returns(response);
      User.find = sinon.stub();
      User.find.withArgs({}).rejects({ message: 'Error' });

      const usersController = new UsersController(User);

      await usersController.get(request, response);
      sinon.assert.calledWith(response.send, 'Error');
    });
  });

  describe('getById()', () => {
    it('should call send with one user', async () => {
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

      await usersController.getById(request, response);
      sinon.assert.calledWith(response.send, defaultUser);
    });
  });

  describe('create() user', () => {
    it('should call send with a new user', async () => {
      const requestWithBody = Object.assign(
        {},
        { body: defaultUser[0] },
        defaultRequest
      );
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };
      class fakeUser {
        save() {}
      }

      response.status.withArgs(201).returns(response);
      sinon
        .stub(fakeUser.prototype, 'save')
        .withArgs()
        .resolves();

      const usersController = new UsersController(fakeUser);

      await usersController.create(requestWithBody, response);
      sinon.assert.calledWith(response.send);
    });

    context('when an error occurs', () => {
      it('should return 422', async () => {
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        };

        class fakeUser {
          save() {}
        }

        response.status.withArgs(422).returns(response);
        sinon
          .stub(fakeUser.prototype, 'save')
          .withArgs()
          .rejects({ message: 'Error' });

        const usersController = new UsersController(fakeUser);

        await usersController.create(defaultRequest, response);
        sinon.assert.calledWith(response.status, 422);
      });
    });
  });

  describe('update() user', () => {
    it('should respond with 200 when the user has been updated', async () => {
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
        static findById() {}
        save() {}
      }
      const fakeUserInstance = new fakeUser();

      const saveSpy = sinon.spy(fakeUser.prototype, 'save');
      const findByIdStub = sinon.stub(fakeUser, 'findById');
      findByIdStub.withArgs(fakeId).resolves(fakeUserInstance);

      const usersController = new UsersController(fakeUser);

      await usersController.update(request, response);
      sinon.assert.calledWith(response.sendStatus, 200);
      sinon.assert.calledOnce(saveSpy);
    });

    context('when an error occurs', () => {
      it('should return 422', async () => {
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
          static findById() {}
        }

        const findByIdStub = sinon.stub(fakeUser, 'findById');
        findByIdStub.withArgs(fakeId).rejects({ message: 'Error' });
        response.status.withArgs(422).returns(response);

        const usersController = new UsersController(fakeUser);

        await usersController.update(request, response);
        sinon.assert.calledWith(response.send, 'Error');
      });
    });
  });

  describe('delete() user', () => {
    it('should respond with 204 when the user has been deleted', async () => {
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
        static deleteOne() {}
      }

      const deleteOneStub = sinon.stub(fakeUser, 'deleteOne');

      deleteOneStub.withArgs({ _id: fakeId }).resolves([1]);

      const usersController = new UsersController(fakeUser);

      await usersController.remove(request, response);
      sinon.assert.calledWith(response.sendStatus, 204);
    });

    context('when an error occurs', () => {
      it('should return 400', async () => {
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
          static deleteOne() {}
        }

        const deleteOneStub = sinon.stub(fakeUser, 'deleteOne');

        deleteOneStub.withArgs({ _id: fakeId }).rejects({ message: 'Error' });
        response.status.withArgs(400).returns(response);

        const usersController = new UsersController(fakeUser);

        await usersController.remove(request, response);
        sinon.assert.calledWith(response.send, 'Error');
      });
    });
  });

  describe('authenticate', () => {
    it('should authenticate a user', async () => {
      const fakeUserModel = {};
      const user = {
        name: 'Jhon Doe',
        email: 'jhondoe@mail.com',
        password: '12345',
        role: 'admin'
      };
      const userWithEncryptedPassword = {
        ...user,
        password: bcrypt.hashSync(user.password, 10)
      };
      const jwtToken = jwt.sign(userWithEncryptedPassword,
        config.get('auth.key'),{
          expiresIn: config.get('auth.tokenExpiresIn')
        });
      class FakeAuthService {
        authenticate() {
          return Promise.resolve(userWithEncryptedPassword)
        }

        static generateToken() {
          return jwtToken;
        }
      };
      const fakeReq = {
        body: user
      };
      const fakeRes = {
        send: sinon.spy()
      };
      const usersController = new UsersController(fakeUserModel, FakeAuthService);
      await usersController.authenticate(fakeReq, fakeRes);
      sinon.assert.calledWith(fakeRes.send, { token: jwtToken });
    });

    it('should return 401 when the user can not be found', async () => {
      const fakeUserModel = {};
      class FakeAuthService {
        authenticate() {
          return Promise.resolve(false)
        }
      };
      const user = {
        name: 'Jhon Doe',
        email: 'jhondoe@mail.com',
        password: '12345',
        role: 'admin'
      };
      const fakeReq = {
        body: user
      };
      const fakeRes = {
        sendStatus: sinon.spy()
      };
      const usersController = new UsersController(fakeUserModel, FakeAuthService);

      await usersController.authenticate(fakeReq, fakeRes);
      sinon.assert.calledWith(fakeRes.sendStatus, 401);
    });
  });
});
