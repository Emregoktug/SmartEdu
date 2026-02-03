const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    console.log('AUTH MIDDLEWARE START');

    if (!req.session.userID) {
      console.log('NO SESSION USER ID');
      return res.redirect('/login');
    }

    const user = await User.findById(req.session.userID);

    if (!user) {
      console.log('USER NOT FOUND');
      return res.redirect('/login');
    }

    console.log('AUTH MIDDLEWARE NEXT');
    next();
  } catch (error) {
    console.log('AUTH MIDDLEWARE ERROR:', error);
    return res.redirect('/login');
  }
};
