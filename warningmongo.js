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
  "moderator": {
    type: String,
    required: true
  },
  "logsid": {
      type: String,
      required: true
  },
  "timestamp": {
      type: String,
      required: true
  },
  "warningid": {
      type: String,
      required: true
  }
});
module.exports = Item = mongoose.model('warningsschema', WarningSchema);