import express from 'express';
import productsRoute from './products';
import usersRoute from './users';

const router = express.Router();

router.use('/products', productsRoute);
router.use('/users', usersRoute);
router.get('/', (req, res) => res.send('Hello World!'));

export default router;
