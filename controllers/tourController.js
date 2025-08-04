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
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next();
}

class APIFeatures {
  constructor(query, queryString){
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
// 1) FILTERING
    const queryObj = {...this.queryString}; //take the field out of the object and create a new object, so we don't manipulate the original 
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]); // forEach doesn't save a new array
// 2) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
      if(this.queryString.sort) {
      const srotBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(srotBy);
    } else {
      this.query = this.query.sort('-_id');
    }
    return this;
  }

  limitFields() {
      if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v')
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page -1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE THE QUERY
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
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
