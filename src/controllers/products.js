class ProductsController {
  constructor(Product) {
    this.Product = Product;
  };

  get(req, res) {
    let findCreteria = {};
    const _id = req.params.id;
    if(_id) {
      findCreteria = {
        _id
      }
    };

    return this.Product.find(findCreteria)
      .then(products => res.send(products))
      .catch(err => res.status(400).send(err.message));
  }

  create(req, res) {
    const product = new this.Product(req.body);

    return product.save()
     .then(() => res.status(201).send(product))
     .catch(err => res.status(400).send(err.message));
  }

  update(req, res) {
    return this.Product.findOneAndUpdate({ _id: req.params.id}, req.body)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(400).send(err.message));
  }

  delete(req, res) {
    return this.Product.remove({ _id: req.params.id})
    .then(() => res.sendStatus(204))
    .catch(err => res.status(400).send(err.message));
  }
}

export default ProductsController;
