class UsersController {
  constructor(User) {
    this.User = User
  }

  create(req, res) {
    const user = new this.User(req.body)

    return user.save()
      .then(() => res.status(201).send(user))
      .catch(err => res.status(422).send(err.message));
  }

  update(req, res) {
    return this.User.findOneAndUpdate({_id: req.params.id}, req.body)
      .then(() => res.sendStatus(200))
      .catch(err => res.status(422).send(err.message));
  }
}

export default UsersController;