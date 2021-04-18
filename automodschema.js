const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarningSchema = new Schema({
  "userid": {
    type: String,
    required: true
  },
"warning": {
    type: String,
    required: true
  },
  "expiration": {
    type: String,
    required: true
  },

});
module.exports = Item = mongoose.model('automodschema', WarningSchema);