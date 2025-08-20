const express = require('express');
const userController = require('../controllers/userController'); // my own module, created to manage the methods for users
const authController = require('../controllers/authController'); // my own module, created to manage the methods for users
const router = express.Router(); // express module to manage routes more easily

router.post('/signup', authController.signup);

router.param('id', userController.checkUserId); // call back used as "filter" for users' id

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
