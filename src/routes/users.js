import express from 'express';
import UsersController from '../controllers/users';
import User from '../models/user';

const router = express.Router();
const usersController = new UsersController(User);

router.post('/', (req, res) => usersController.create(req, res));
router.put('/:id', (req, res) => usersController.update(req, res));

export default router;

