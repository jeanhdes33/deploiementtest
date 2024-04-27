const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  score: {
    type: Number,
    default: 0 // Score par défaut initialisé à 0
  }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
