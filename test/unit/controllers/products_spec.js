import ProductsController from '../../../src/controllers/products';
import sinon from 'sinon';
import Product from '../../../src/models/product';

describe('Controllers: Products', () => {
  const defaultProduct = [
    {
      name: 'Default product',
      description: 'product description',
      price: 100
    }
  ];

  describe('get() products', () => {
    it('should return a list of products', async () => {
      const request = {};
      const response = {
        send: sinon.spy()
      };

      Product.find = sinon.stub();
      Product.find.withArgs({}).resolves(defaultProduct);

      const productsController = new ProductsController(Product);

      await productsController.get(request, response);

      sinon.assert.calledWith(response.send, defaultProduct);
    });

    it('should return 400 when an error occurs', async () => {
      const request = {};
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      response.status.withArgs(400).returns(response);
      Product.find = sinon.stub();
      Product.find.withArgs({}).rejects({ message: 'Error' });

      const productsController = new ProductsController(Product);

      await productsController.get(request, response);

      sinon.assert.calledWith(response.send, 'Error');
    });
  });
});
