import sinon from 'sinon';

import User from '../../../src/models/user';
import UsersController from '../../../src/controllers/users';

describe('Controller: Users', () => {
  const defaultUser = [{
    __v: 0,
    _id: "56cb91bdc3464f14678934ca",
    email: 'bradoke@mail.com',
    password: '123'
  }];

  const defaultRequest = {
    params: {}
  };

  describe('create() user', () => {
    it('should call send with a new user', async () => {
      const requestWithBody = Object.assign({}, { body: defaultUser[0] }, defaultRequest)
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      class fakeUser {
        save() {}
      }

      response.status.withArgs(201).returns(response);
      sinon.stub(fakeUser.prototype, 'save').withArgs().resolves();

      const usersController = new UsersController(fakeUser);

      let resolvingPromise = await usersController.create(requestWithBody, response);

      sinon.assert.calledWith(response.send)
    });

    context('when an error occurs', () => {
      it('should return 422', async () => {
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        }
        class fakeUser {
          save() {}
        }

        response.status.withArgs(422).returns(response)
        sinon.stub(fakeUser.prototype, 'save').withArgs().rejects({ message: 'Error' });

        const usersController = new UsersController(fakeUser);
        let resolvingPromise = await usersController.create(defaultRequest, response);

        sinon.assert.calledWith(response.status, 422);
      });
    });
  });

  describe('update() user', () => {
    it('should respond with 200 when the user has been updated', async () => {
      const fakeId = 'fake-id'
      const updatedUser = {
        _id: fakeId,
        email: 'updated_bradoke@mail.com',
        password: '1234'
      };
      const request = {
        params: {
          id: fakeId
        },
        body: updatedUser
      };
      const response = {
        sendStatus: sinon.spy()
      }

      class fakeUser {
        static findOneAndUpdate() {}
      }

      const findOneAndUpdateStub = sinon.stub(fakeUser, 'findOneAndUpdate');
      findOneAndUpdateStub.withArgs({ _id: fakeId }, updatedUser).resolves(updatedUser)

      const usersController = new UsersController(fakeUser);

      let resolvingPromise = await usersController.update(request, response);

      sinon.assert.calledWith(response.sendStatus, 200)
    })
  });
});

