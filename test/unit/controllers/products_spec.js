import ProductsController from '../../../src/controllers/products';
import sinon from 'sinon';

describe('Routes: Products', () => {
  const defaultProduct = [{
    name: 'Default product',
    description: 'product description',
    price: 100
  }];

  describe('get() products', () => {
    it('should return a list of products', () => {
      const fakeReq = {};
      const fakeRes = {
        send: sinon.spy()
      }
      const productsController = new ProductsController();
      productsController.get(fakeReq, fakeRes);
      expect(fakeRes.send.called).to.be.true;
      expect(fakeRes.send.calledWith(defaultProduct)).to.be.true;
    });
  });
});
