const Tour = require("../models/tourModel.js");
//imports tour model

/* this checkID middleware is no longer needed, it was just for studying purposes
//.
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour ID is: ${val}`);
//   if (!req.params.id * 1 > toursData.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "id not found",
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price",
//     });
//   }
//   next();
// };
*/

exports.getAllTours = async (req, res) => {
  try {
  //  const tours = await Tour.find(); //finds all data in that collection


// BUILDING THE QUERY
// 1) FILTERING

      const queryObj = {...req.query} //take the field out of the object and create a new object, so we don't manipulate the original 
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]); //don't save a new array

// 2) ADVANCED FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

      let query = Tour.find(JSON.parse(queryStr)); //finds queried data in the collection (in the easiest way)
      // first way

    // const query = Tour.find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy');

// 3) SORTING
      if(req.query.sort) {
        const srotBy = req.query.sort.split(',').join(' ');
        query = query.sort(srotBy);
      } else {
        query = query.sort('-createdAt');
      }

// 4/ FIELD LIMITING
      if(req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
      } else {
        query = query.select('-__v')
      }

// EXECUTE THE QUERY
      const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // finds the data matching the id parameter on the URL
    // simplification of 'Tour.findOne({ _id: req.params.id })
    res.status(200).json({
      status: "sucess",
      data: {
        tour
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body); // create a new instance in my collection
    //for now, the req.body is set up on postman
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "oh no!",
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status:'fail',
      message:'error'
    })
  }
};
