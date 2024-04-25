const mongoose = require('mongoose');

const { Schema } = mongoose;

const scoreSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user', // Référence au modèle User
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
});

const ScoreModel = mongoose.model('Score', scoreSchema);

module.exports = ScoreModel;
