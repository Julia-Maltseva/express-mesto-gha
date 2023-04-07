const router = require('express').Router();

const {
  createUser,
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.post('/', createUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

router.get('/:id', getUser);

module.exports = router;
