import User from '../../../src/models/user';

describe('Routes: Users', () => {
  let request;

  before(() => {
    return setupApp()
      .then(app => {
        request = supertest(app)
      })
  });

  const defaultId = '56cb91bdc3464f14678934ca';
  const defaultUser = {
    email: 'bradoke@mail.com',
    password: '123'
  };

  const expectedUser = {
    __v: 0,
    _id: defaultId,
    email: 'bradoke@mail.com',
    password: '123'
  };

  beforeEach(() => {
    const user = new User(defaultUser);
    user._id = defaultId;
    return User.remove({})
      then(() => user.save())
  });

  afterEach(() => User.remove())

  describe('POST /users', () => {
    context('when posting a user', () => {
      it('should return a new user with status 201', async () => {
        const customId = '56cb91bdc3464f14678934ba';
        const newUser = Object.assign({}, { _id: customId, __v: 0 }, defaultUser);
        const expectedSavedUser = {
          __v: 0,
          _id: customId,
          email: 'bradoke@mail.com',
          password: '123'
        };

        let resolvingPromise = await request.post('/users').send(newUser)

        expect(resolvingPromise.res.statusCode).to.eql(201);
        expect(resolvingPromise.res.body).to.eql(expectedSavedUser);
      })
    })
  })

  describe('PUT /users:id', () => {
    context('when editing a user', () => {
      it('should update the product and return the status code 200', async () => {
        const customUser = {
          email: 'custom_bradoke@mail.com'
        }
        const updatedUser = Object.assign({}, customUser, defaultUser);

        let resolvingPromise = await request.put(`/users/${defaultId}`).send(updatedUser);

        expect(resolvingPromise.res.statusCode).to.eql(200)
      })
    })
  })
})