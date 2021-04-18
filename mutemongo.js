const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MuteSchema = new Schema({
  "userid": {
    type: String,
    required: true
  },
"mutetime": {
    type: String,
    required: true
  },
  "reason": {
    type: String,
    required: true
  },
  "moderator": {
    type: String,
    required: true
  },
  "logsurl": {
    type: String,
    required: false
  },
  "ismuted": {
      type: Boolean,
    required: true
  }
});
module.exports = Item = mongoose.model('muteshcema', MuteSchema);