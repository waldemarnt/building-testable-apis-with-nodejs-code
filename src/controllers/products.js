class ProductsController {
  constructor(Product) {
    this.Product = Product;
  }

  async get(req, res) {
    try {
      const products = await this.Product.find({});
      res.send(products);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  async getById(req, res) {
    const {
      params: { id }
    } = req;

    try {
      const product = await this.Product.find({ _id: id });
      res.send(product);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
  async create(req, res) {
    const product = new this.Product(req.body);
    try {
      await product.save();
      res.status(201).send(product);
    } catch (err) {
      res.status(422).send(err.message);
    }
  }

  update(req, res) {
    return this.Product.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(() => res.sendStatus(200))
      .catch(err => res.status(422).send(err.message));
  }

  remove(req, res) {
    return this.Product.remove({ _id: req.params.id })
      .then(() => res.sendStatus(204))
      .catch(err => res.status(400).send(err.message));
  }
}

export default ProductsController;
