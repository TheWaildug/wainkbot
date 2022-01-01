
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarningSchema = new Schema({
  "user": {
      type: String,
      required: true
  },
  "type": {
      type: String,
      required: true
  }
});
module.exports = Item = mongoose.model('blockschema', WarningSchema);