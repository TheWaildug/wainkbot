const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RestrictSchema = new Schema({
  "user": {
    type: String,
    required: true
  },
  "roles":{
  type: Array,
  required: true
  }
});
module.exports = Item = mongoose.model('restrictschema', RestrictSchema);