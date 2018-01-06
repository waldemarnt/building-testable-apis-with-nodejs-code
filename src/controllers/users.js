class UsersController {
  constructor(User, authService) {
    this.User = User;
    this.authService = authService;
  };

  get(req, res) {
    return this.User.find({})
      .then(users => res.send(users))
      .catch(err => res.status(400).send(err.message));
  }

  getById(req, res) {
    const { params: { id } } = req;

    return this.User.find({ _id:id })
      .then(user => res.send(user))
      .catch(err => res.status(400).send(err.message));
  }

  create(req, res) {
    const user = new this.User(req.body);

    return user.save()
      .then(() => res.status(201).send(user))
      .catch(err => res.status(422).send(err.message));
  }

  update(req, res) {
    return this.User.findOneAndUpdate({ _id: req.params.id}, req.body)
      .then(() => res.sendStatus(200))
      .catch(err => res.status(422).send(err.message));
  }

  remove(req, res) {
    return this.User.remove({ _id: req.params.id})
      .then(() => res.sendStatus(204))
      .catch(err => res.status(400).send(err.message));
  }

  authenticate(req, res) {
    return this.authService.authenticate(req.body)
      .then(user => {
        if(!user) {
          return res.sendStatus(403);
        }
        return res.send({token: this.authService.generateToken(user.toJSON())});
      });
  }

}

export default UsersController;
