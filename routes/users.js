const router = require('express').Router();

const {
  createUser,
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.post('/users', createUser);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

router.get('/users/:id', getUser);

module.exports = router;
