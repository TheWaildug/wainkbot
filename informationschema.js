const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InformationSchema = new Schema({
  "currenttime": {
    type: String,
    required: true
  },
  "channel": {
    type: String,
    required: true
  },
  "active": {
      type: Boolean,
      required: true
  }
})
module.exports = Item = mongoose.model('informationschema', InformationSchema);