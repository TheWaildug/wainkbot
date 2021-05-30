const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarningSchema = new Schema({
  "content": {
    type: String,
    required: true
  },
  "oldcontent": {
    type: String,
    required: false
  },
  "link": {
    type: String,
    required: false
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
  },
  "type": {
    type: String,
    required: true
  }
});
module.exports = Item = mongoose.model('snipemongo', WarningSchema);