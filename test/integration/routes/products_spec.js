describe('Routes: Products', () => {
  const defaultProduct = {
    name: 'Default product',
    description: 'product description',
    price: 100
  };

  describe('GET /products', () => {
    it('should return a list of products', done => {

      request
      .get('/products')
      .end((err, res) => {
        expect(res.body[0]).to.eql(defaultProduct);
        done(err);
      });
    });
  });
});
