const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const leaveroleschema = new Schema({
  "userid": {
    type: Number,
    required: true
  },
  "roles": {
    type: Array,
    required: true
  }
});
module.exports = Item = mongoose.model('leaveroleschema', leaveroleschema);