class ProductsController {
  constructor(Product) {
    this.Product = Product;
  };

  get(req, res) {
    return this.Product.find({})
      .then(users => res.send(users))
      .catch(err => res.status(400).send(err.message));
  }
}

export default ProductsController;
