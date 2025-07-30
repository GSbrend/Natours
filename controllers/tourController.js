const Tour = require("../models/tourModel.js");

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

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    // results: toursData.length, //include the number of results
    // data: {
    //   tours: toursData,
    // },
  });
};

exports.getTourById = (req, res) => {
  const id = req.params.id * 1; // Converte o id para número
  // const tour = toursData.find(el => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try{
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
