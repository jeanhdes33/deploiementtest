const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctOptionIndex: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
