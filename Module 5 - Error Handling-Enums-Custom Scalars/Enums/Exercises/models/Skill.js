const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["PLANNED", "IN PROGRESS", "DONE"], // must match GraphQL enum
    default: "PLANNED", // defaulting to planned if no input
  },
});

module.exports = mongoose.model("Skill", skillSchema);
