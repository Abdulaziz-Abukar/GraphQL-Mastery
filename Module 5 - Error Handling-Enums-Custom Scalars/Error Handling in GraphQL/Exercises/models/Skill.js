const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  status: String,
});

module.exports = mongoose.model("Skill", skillSchema);
