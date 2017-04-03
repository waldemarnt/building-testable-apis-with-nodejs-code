import ProductsController from '../../../src/controllers/products';
import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised';
import Product from '../../../src/models/product';

describe('Constrollers: Products', () => {
  const defaultProduct = [{
    name: 'Default product',
    description: 'product description',
    price: 100
  }];

  describe('get() products', () => {
    it('should call send with a list of products', () => {
      const request = {};
      const response = {
        send: sinon.spy()
      };
      Product.find = sinon.stub();

      Product.find.withArgs({}).resolves(defaultProduct);

      const productsController = new ProductsController(Product);
      return productsController.get(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, defaultProduct);
        });
    });

    it('should return 400 when an error occurs', () => {
			const request = {};
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      response.status.withArgs(400).returns(response);
      Product.find = sinon.stub();
      Product.find.withArgs({}).rejects("Error");

      const productsController = new ProductsController(Product);

      return productsController.get(request, response)
      .then(() => {
        sinon.assert.calledWith(response.send, 'Error');
      });
    });
  });
});
