import ProductsController from '../../../src/controllers/products';
import sinon from 'sinon';
import Product from '../../../src/models/product';

describe('Controller: Products', () => {
  const defaultProduct = [{
    __v: 0,
    _id: "56cb91bdc3464f14678934ca",
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

    it('should return 400 when an error occurs', () => {
      const request = {};
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      response.status.withArgs(400).returns(response);
      Product.find = sinon.stub();
      Product.find.withArgs({}).rejects({ message: 'Error' });

      const productsController = new ProductsController(Product);

      return productsController.get(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'Error');
        });
    });

  });

  describe('getById()', () => {
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

      return productsController.getById(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, defaultProduct);
        });
    });
  });

  describe('create() product', () => {
    it('should call send with a new product', () => {
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

    context('when an error occurs', () => {
      it('should return 422', () => {
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        };

        class fakeProduct {
          save() {}
        }

        response.status.withArgs(422).returns(response);
        sinon.stub(fakeProduct.prototype, 'save').withArgs().rejects({ message: 'Error' });

        const productsController = new ProductsController(fakeProduct);

        return productsController.create(defaultRequest, response)
          .then(() => {
            sinon.assert.calledWith(response.status, 422);
          });
      });
    });
  });

  describe('update() product', () => {
    it('should respond with 200 when the product has been updated', () => {
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

    context('when an error occurs', () => {
      it('should return 422', () => {
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
        response.status.withArgs(422).returns(response);

        const productsController = new ProductsController(fakeProduct);

        return productsController.update(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'Error');
          });
      });
    });
  });

  describe('delete() product', () => {
    it('should respond with 204 when the product has been deleted', () => {
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

      return productsController.remove(request, response)
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

        class fakeProduct {
          static remove() {}
        }

        const removeStub = sinon.stub(fakeProduct, 'remove');

        removeStub.withArgs({ _id: fakeId }).rejects({message: 'Error'});
        response.status.withArgs(400).returns(response);

        const productsController = new ProductsController(fakeProduct);

        return productsController.remove(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'Error');
          });
      });
    });
  });
});

