import Product from '../../../src/models/product';

describe.only('Route: Products', () => {
  let request;

  before(()=> {
    return setupApp()
      .then(app => {
        request = supertest(app)
      });
  });

  const defaultId = '56cb91bdc3464f14678934ca';
  const defaultProduct = {
    name: 'Default product',
    description: 'product description',
    price: 100
  };
  const expectedProduct = {
    __v: 0,
    _id: defaultId,
    name: 'Default product',
    description: 'product description',
    price: 100
  };


  beforeEach(() => {
    const product = new Product(defaultProduct);
    product._id = '56cb91bdc3464f14678934ca';
    return Product.remove({})
      .then(() => product.save());
  });

  describe('when listing products', () => {
    it('should respond 200 with a list of products', done => {

      request
        .get('/products')
        .end((err, res) => {
          expect(res.statusCode).to.eql(200);
          expect(res.body).to.eql([expectedProduct]);
          done(err);
        });
    });
  });
});
