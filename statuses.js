const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WarningSchema = new Schema({
  "status": {
    type: String,
    required: true
  },
"user": {
    type: String,
    required: true
  },
  "shuffle": {
    type: Boolean,
    required: true
  }
});
module.exports = Item = mongoose.model('statuses', WarningSchema);