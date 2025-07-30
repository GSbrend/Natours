const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();

// as this middleware is inside the tourRoutes file, it will only apply to routes defined in this file
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;