const router = require('express').Router();

const {
  getUserId,
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

router.get('/:id', getUserId);

router.get('/me', getUser);

module.exports = router;
