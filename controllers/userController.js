const fs = require('fs');
const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.checkUserId = (req, res, next, val) => {
  const id = req.params.id;
  const user = usersData.find((el) => el._id === id);
  console.log(user);
  if (!user) {
    console.log('user not found!');
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }
  next();
};

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: usersData.length, //include the number of results
    data: {
      users: usersData,
    },
  });
};

exports.getUserById = (req, res) => {
  const id = req.params.id;
  const user = usersData.find((el) => el._id === id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet',
  });
};
