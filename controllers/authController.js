const User = require('../models/User');
const bcrypt = require('bcrypt');
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log('LOGIN BODY:', req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log('USER:', user);

    if (!user) {
      return res.status(401).send('Email veya şifre hatalı');
    }

    const same = await bcrypt.compare(password, user.password);
    console.log('PASSWORD MATCH:', same);

    if (!same) {
      return res.status(401).send('Email veya şifre hatalı');
    }

    return res.status(200).send('YOU ARE LOGGED IN');
  } catch (error) {
    console.log('LOGIN ERROR:', error);

    return res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
