class ProductsController {
  constructor(Product) {
    this.Product = Product;
  }

  get(req, res) {
    return this.Product.find({})
      .then(products => res.send(products))
      .catch(err => res.status(400).send(err.message));
  }

  getById(req, res) {
    const {
      params: { id }
    } = req;

    return this.Product.find({ _id: id })
      .then(products => res.send(products))
      .catch(err => res.status(400).send(err.message));
  }

  create(req, res) {
    const product = new this.Product(req.body);

    return product
      .save()
      .then(() => res.status(201).send(product))
      .catch(err => res.status(422).send(err.message));
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
