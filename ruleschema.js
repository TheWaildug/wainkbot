const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarningSchema = new Schema({
  "rule": {
    type: String, 
    required: true
  },
  "number": {
      type: Number,
      required: true
  }
});
module.exports = Item = mongoose.model('ruleschema', WarningSchema);