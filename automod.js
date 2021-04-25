const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MuteSchema = new Schema({
  "userid": {
    type: String,
    required: true
  },
  "reason": {
    type: String,
    required: true
  },
  "timestamp": {
    type: String,
    required: true
  },
  "endtime": {
    type: String,
    required: true
  }
});
module.exports = Item = mongoose.model('automodschema', MuteSchema);