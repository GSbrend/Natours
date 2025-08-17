const Tour = require("../models/tourModel.js"); //imports tour model
const APIFeatures = require('../Utils/apiFeatures.js'); //imports apifeatures
const catchAsync = require('./../Utils/catchAsync.js');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
}

exports.getAllTours = catchAsync(
async (req, res, next) => {    
  const features = new APIFeatures(Tour.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
  
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    },
  });
});

exports.getTourById = catchAsync(
async (req, res, next) => {
  const tour = await Tour.findById(req.params.id); // finds the data matching the id parameter on the URL
  // simplification of 'Tour.findOne({ _id: req.params.id })
  res.status(200).json({
    status: "sucess",
    data: {
      tour
    },
  });
});

exports.createTour = catchAsync(
async (req, res, next) => {
  const newTour = await Tour.create(req.body); // create a new instance in my collection
  //for now, the req.body is set up on postman
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(
async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //returns the new version of the instance
    runValidators: true, //runs the shcema validators once again after the data is updated
  });
  res.status(200).json({
    status: "success",
    data: {
      tour
    },
  });
});

exports.deleteTour = catchAsync(
async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getTourStats = catchAsync(
async (req, res, next) => {
  const stats = await Tour.aggregate([ //it must be inside an array
    {
      $match: {ratingsAverage: {$gte: 0}} //matches all the tours above 3 rating
    },
    {
      $group: { //aggregates all the specified data
        _id: {$toUpper: '$difficulty'},
        numTours: {$sum: 1}, //add one for each document going through the pipeline
        numRatings: {$sum: '$ratingsQuantity'},
        abgRating: {$avg:'$ratingsAverage'},
        avgPrice: {$avg: '$price'},
        minPrice: {$min: '$price'},
        maxPrice: {$max: '$price'}
      }
    },
    {
      $sort: { avgPrice: 1}
    }
  ]);

  res.status(200).json({
    status: 'sucess',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(
async (req, res, next) => {
  const year = req.params.year * 1; //converts to string
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates' //separates all the tours with the same details by their starting dates, and rebuild them again as if it was one tour document for each date
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        }
      }
    },
    {
      $group: {
        _id: {$month: '$startDates'}, //grouping by the month according to the startDates field
        numTourStarts: {$sum: 1},
        tour: {$push: '$name'} //create an array with the names
      }
    },
    {
      $sort: {numTourStarts: -1}
    },
    {
      $addFields: {month: '$_id'}
    },
    {
      $project: {
        _id: 0
      }
    }
  ]);

    res.status(200).json({
    status: 'sucess',
    data: {
      plan
    }
  });
});