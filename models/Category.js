const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

CategorySchema.pre('validate', async function () {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
