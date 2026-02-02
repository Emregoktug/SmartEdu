const User = require('../models/User');
const bcrypt = require('bcrypt');
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect('/login');
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
    req.session.userID = user._id;
    return res.status(200).redirect('/users/dashboard');
  } catch (error) {
    console.log('LOGIN ERROR:', error);

    return res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID });
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
  });
};
