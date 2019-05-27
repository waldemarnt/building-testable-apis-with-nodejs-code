class UsersController {
  constructor(User, AuthService) {
    this.User = User;
    this.AuthService = AuthService;
  }

  get(req, res) {
    return this.User.find({})
      .then(users => res.send(users))
      .catch(err => res.status(400).send(err.message));
  }

  getById(req, res) {
    const { params: { id } } = req;

    return this.User.find({ _id: id })
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
    const body = req.body;
    return this.User.findById(req.params.id)
      .then(user => {
        user.name = body.name
        user.email = body.email
        user.role = body.role
        if (body.password) {
          user.password = body.password
        }
        return user.save();
      })
      .then(() => res.sendStatus(200))
      .catch(err => res.status(422).send(err.message));
  }

  remove(req, res) {
    return this.User.remove({ _id: req.params.id })
      .then(() => res.sendStatus(204))
      .catch(err => res.status(400).send(err.message));
  }

  authenticate(req, res) {
    const authService = new this.AuthService(this.User);
    return authService.authenticate(req.body)
      .then(user => {
        if(!user) {
          return res.sendStatus(401);
        }
        const token = this.AuthService.generateToken({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role
        });
        return res.send({ token });
      });
  }

}

export default UsersController;
