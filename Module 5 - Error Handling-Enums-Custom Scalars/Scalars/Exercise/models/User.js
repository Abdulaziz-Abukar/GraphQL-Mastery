const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  phoneNumber: {
    type: String,
    match: /^\+?[1-9]\d{1,14}$/,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  metadata: { type: mongoose.Schema.Types.Mixed },
});

module.exports = mongoose.model("User", userSchema);
