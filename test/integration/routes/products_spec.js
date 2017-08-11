import Product from '../../../src/models/product';

describe('Routes: Products', () => {
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

	afterEach(() => Product.remove({}));

	describe('GET /products', () => {
		it('should return a list of products', done => {

			request
				.get('/products')
				.end((err, res) => {
					expect(res.body).to.eql([expectedProduct]);
					done(err);
				});
		});

		it('should return one product', done => {

			request
				.get(`/products/${defaultId}`)
				.end((err, res) => {
					expect(res.body).to.eql([expectedProduct]);
					done(err);
				});
		});
	});
	describe('POST /products', () => {
		it('should create a product into the database', done => {
			const customId = '56cb91bdc3464f14678934ba';
			const newProduct = Object.assign({},{ _id: customId, __v:0 }, defaultProduct)
			const expectedSavedProduct = {
				__v: 0,
				_id: customId,
				name: 'Default product',
				description: 'product description',
				price: 100
			};

			request
				.post('/products')
				.send(newProduct)
				.end((err, res) => {
					expect(res.body).to.eql(expectedSavedProduct);
					done(err);
				});
		});
	});

	describe('PUT /products/:id', () => {
		it('should update a product into the database', done => {
			const customProduct = {
				name: 'Custom name'
			};
			const updatedProduct = Object.assign({}, customProduct, defaultProduct)

			request
				.put(`/products/${defaultId}`)
				.send(updatedProduct)
				.end((err, res) => {
					expect(res.status).to.eql(200);
					done(err);
				});
		});
	});

 describe('DELETE /products/:id', () => {
    it('should delete a product from database', done => {

      request
      .delete(`/products/${defaultId}`)
      .end((err, res) => {
        expect(res.status).to.eql(204);
        done(err);
      });
    });
  });


});
