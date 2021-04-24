const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarningSchema = new Schema({
  "userid": {
    type: String,
    required: true
  },
"afk": {
    type: String,
    required: true
  },
  "afkms": {
    type: String,
    required: true
  },
  "currentname": {
    type: String,
    required: true
  }
});
module.exports = Item = mongoose.model('afkschema', WarningSchema);