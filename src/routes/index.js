import express from 'express';
import usersRoute from './users';

const router = express.Router();

router.use('/users', usersRoute);
router.get('/', (req, res) => res.send('Hello World!'));

export default router;
