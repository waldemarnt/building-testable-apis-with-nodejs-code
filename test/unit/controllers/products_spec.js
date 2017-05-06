import ProductsController from '../../../src/controllers/products';
import sinon from 'sinon';
import Product from '../../../src/models/product';

describe('Constrollers: Products', () => {
  const defaultProduct = [{
    name: 'Default product',
    description: 'product description',
    price: 100
  }];
  const defaultRequest = {
    params: {}
  };

  describe('get() products', () => {
    it('should call send with a list of products', () => {
      const response = {
        send: sinon.spy()
      };

      Product.find = sinon.stub();
      Product.find.withArgs({}).resolves(defaultProduct);

      const productsController = new ProductsController(Product);

      return productsController.get(defaultRequest, response)
        .then(() => {
          sinon.assert.calledWith(response.send, defaultProduct);
        });
    });

    it('should call send with one product', () => {
      const fakeId = 'a-fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        send: sinon.spy()
      };

      Product.find = sinon.stub();
      Product.find.withArgs({ _id: fakeId }).resolves(defaultProduct);

      const productsController = new ProductsController(Product);

      return productsController.get(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, defaultProduct);
        });
    });

    it('should return 400 when an error occurs', () => {
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      response.status.withArgs(400).returns(response);
      Product.find = sinon.stub();
      Product.find.withArgs({}).rejects({ message: 'Error' });

      const productsController = new ProductsController(Product);

      return productsController.get(defaultRequest, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'Error');
        });
    });
  });

  describe('create() product', () => {
    it('should call send with an created product', () => {
      const requestWithBody = Object.assign({}, { body: defaultProduct[0] }, defaultRequest);
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };
      class fakeProduct {
        save() {}
      }

      response.status.withArgs(201).returns(response);
      sinon.stub(fakeProduct.prototype, 'save').withArgs().resolves();

      const productsController = new ProductsController(fakeProduct);

      return productsController.create(requestWithBody, response)
        .then(() => {
          sinon.assert.calledWith(response.send);
        });
    });

    it('should return 412 when an error occurs on new prodct creation', () => {
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      class fakeProduct {
        save() {}
      }

      response.status.withArgs(412).returns(response);
      sinon.stub(fakeProduct.prototype, 'save').withArgs().rejects({ message: 'Error' });

      const productsController = new ProductsController(fakeProduct);

      return productsController.create(defaultRequest, response)
        .then(() => {
          sinon.assert.calledWith(response.status, 412);
        });
    });
  });

  describe('update() product', () => {
    it('should repond successfully when updating a product', () => {
      const fakeId = 'a-fake-id';
      const updatedProduct = {
        _id: fakeId,
        name: 'Updated product',
        description: 'Updated description',
        price: 150
      };
      const request = {
        params: {
          id: fakeId
        },
        body: updatedProduct
      };
      const response = {
        sendStatus: sinon.spy()
      };

      class fakeProduct {
        static findOneAndUpdate() {}
      }

      const findOneAndUpdateStub = sinon.stub(fakeProduct, 'findOneAndUpdate');
      findOneAndUpdateStub.withArgs({ _id: fakeId }, updatedProduct).resolves(updatedProduct);

      const productsController = new ProductsController(fakeProduct);

      return productsController.update(request, response)
        .then(() => {
          sinon.assert.calledWith(response.sendStatus, 200);
        });
    });

    it('should return 412 when an error occurs while updating a product', () => {
      const fakeId = 'a-fake-id';
      const updatedProduct = {
        _id: fakeId,
        name: 'Updated product',
        description: 'Updated description',
        price: 150
      };
      const request = {
        params: {
          id: fakeId
        },
        body: updatedProduct
      };
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      class fakeProduct {
        static findOneAndUpdate() {}
      }

      const findOneAndUpdateStub = sinon.stub(fakeProduct, 'findOneAndUpdate');
      findOneAndUpdateStub.withArgs({ _id: fakeId }, updatedProduct).rejects({ message: 'Error' });
      response.status.withArgs(412).returns(response);

      const productsController = new ProductsController(fakeProduct);

      return productsController.update(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'Error');
        })
    });
  });

  describe('delete() product', () => {
    it('should repond successfully when deleting a product', () => {
      const fakeId = 'a-fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        sendStatus: sinon.spy()
      };

      class fakeProduct {
        static remove() {}
      }

      const removeStub = sinon.stub(fakeProduct, 'remove');

      removeStub.withArgs({ _id: fakeId }).resolves([1]);

      const productsController = new ProductsController(fakeProduct);

      return productsController.delete(request, response)
        .then(() => {
          sinon.assert.calledWith(response.sendStatus, 204);
        });
    });

    it('should return 400 when an error occurs while deleting a product', () => {
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

      class fakeProduct {
        static remove() {}
      }

      const removeStub = sinon.stub(fakeProduct, 'remove');

      removeStub.withArgs({ _id: fakeId }).rejects({message: 'Error'});
      response.status.withArgs(400).returns(response);

      const productsController = new ProductsController(fakeProduct);

      return productsController.delete(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'Error');
        })
    });
  });
});
