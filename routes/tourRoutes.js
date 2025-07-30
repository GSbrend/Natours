const express = require('express');
const tourController = require('../controllers/tourController'); // my own module, created to manage the methods for users
const router = express.Router(); // express module to manage routes more easily

// as this middleware is inside the tourRoutes file, it will only apply to routes defined in this file
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;