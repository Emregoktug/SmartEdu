const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
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

    // 1. Kullanıcı var mı
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Email veya şifre hatalı');
    }

    // 2. Şifre doğru mu
    const same = await bcrypt.compare(password, user.password);
    if (!same) {
      return res.status(401).send('Email veya şifre hatalı');
    }

    // 3. USER SESSION (DOĞRU YER)
    req.session.userID = user._id;
    req.session.role = user.role;

    // 4. Session KAYDEDİLDİKTEN SONRA redirect
    req.session.save(() => {
      return res.redirect('/users/dashboard');
    });
  } catch (error) {
    console.log('LOGIN ERROR:', error);
    return res.status(500).send('Login error');
  }
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'courses'
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
  });
};
