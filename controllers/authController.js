const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
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
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Email veya şifre hatalı');
    }

    const same = await bcrypt.compare(password, user.password);
    if (!same) {
      return res.status(401).send('Email veya şifre hatalı');
    }

    req.session.userID = user._id;
    req.session.role = user.role;

    console.log('LOGIN SUCCESS, REDIRECTING');

    return res.redirect('/users/dashboard');
  } catch (error) {
    console.log('LOGIN ERROR:', error);
    return res.status(500).send('Login error');
  }
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID });
  const categories = await Category.find();
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
  });
};
