const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    // VALIDATION
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().forEach(err => {
        req.flash('error', err.msg);
      });

      return res.status(400).redirect('/register');
    }

    // İlk kullanıcıysa admin yap
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      req.body.role = 'admin';
    }

    // USER CREATE
    await User.create(req.body);

    return res.status(201).redirect('/login');
  } catch (error) {
    console.log('CREATE USER ERROR:', error);
    return res.status(400).redirect('/register');
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // USER VAR MI
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'User does not exist!');
      return res.status(400).redirect('/login');
    }

    // PASSWORD DOĞRU MU
    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      req.flash('error', 'Your password is not correct!');
      return res.status(400).redirect('/login');
    }

    // SESSION
    req.session.userID = user._id;
    req.session.role = user.role;

    req.session.save(() => {
      return res.redirect('/users/dashboard');
    });
  } catch (error) {
    console.log('LOGIN ERROR:', error);
    return res.status(500).send('Login error');
  }
};

// LOGOUT
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

// DASHBOARD
exports.getDashboardPage = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.session.userID,
    }).populate('courses');

    const categories = await Category.find();

    const courses = await Course.find({
      user: req.session.userID,
    });
    const users = await User.find();
    console.log(users.countDocument);

    res.status(200).render('dashboard', {
      page_name: 'dashboard',
      user,
      categories,
      courses,
      users,
    });
  } catch (error) {
    console.log('DASHBOARD ERROR:', error);
    res.redirect('/');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Course.deleteMany({ user: req.params.id });

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    await User.create({ name, email, password, role });
    req.flash('success', 'User created successfully!');
    res.status(201).redirect('/users/dashboard');
  } catch (error) {
    console.log('ADMIN CREATE USER ERROR:', error);
    req.flash('error', 'User could not be created!');
    res.status(400).redirect('/users/dashboard');
  }
};
