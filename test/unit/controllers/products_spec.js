import ProductsController from '../../../src/controllers/products';
import sinon from 'sinon';
import Product from '../../../src/models/product';

describe('Routes: Products', () => {
  const defaultProduct = [{
    name: 'Default product',
    description: 'product description',
    price: 100
  }];

  afterEach(() => {
    Product.find.restore();
  });

  describe('get() products', () => {
    it('should call send with a list of products', () => {
      const request = {};
      const response = {
        send: sinon.spy()
      };

      sinon.stub(Product, 'find').callsFake(() => Promise.resolve(defaultProduct));

      const productsController = new ProductsController(Product);
      productsController.get(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, defaultProduct);
        });
    });

    it('should return 400 when an error occurs', () => {
      const request = {};
      const response = {
        send: sinon.spy(),
        status: sinon.spy()
      };

      sinon.stub(Product, 'find').callsFake(() => Promise.reject(new Error('Error')));

      const productsController = new ProductsController(Product);
      productsController.get(request, response)
      .then(() => {
        sinon.assert.calledWith(response.send, 'Error');
      });
    });
  });
});
