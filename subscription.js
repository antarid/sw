const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  subscription: String,
  days: Number
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
