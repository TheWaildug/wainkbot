const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarningSchema = new Schema({
  "content": {
    type: String,
    required: true
  },
  "author": {
      type: Array,
      required: true
  },
  "timestamp": {
      type: String,
      required: true
  },
  "channel": {
      type: String,
      required: true
  }
});
module.exports = Item = mongoose.model('snipemongo', WarningSchema);