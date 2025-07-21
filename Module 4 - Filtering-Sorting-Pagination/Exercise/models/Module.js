const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
});

module.exports = mongoose.model("modules", moduleSchema);
