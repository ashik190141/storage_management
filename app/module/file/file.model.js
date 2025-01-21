const mongoose = require("mongoose");

const FileCreateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  folder: {
    type: String
  },
  favorite: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("files", FileCreateSchema);
