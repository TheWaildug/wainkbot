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
  },
  "blid": {
      type: String,
      required: true
  },
  "reason": {
      type: String,
      required: true
  },
  "blacklisted": {
      type: Boolean,
      required: true
  }
});
module.exports = Item = mongoose.model('blacklistschema', WarningSchema);