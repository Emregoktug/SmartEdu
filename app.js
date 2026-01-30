const express = require('express');
const mongoose = require('mongoose');
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');

const app = express();

//Connect DB

mongoose
  .connect('mongodb://localhost:27017/smartedu-db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//Template Engine
app.set('view engine', 'ejs');

//MIDDLEWARE
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//ROUTES
app.use('/courses', courseRoute);
app.use('/', pageRoute);
app.use('/categories', categoryRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
