const mongoose = require("mongoose");

const FolderCreateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "folder"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("folders", FolderCreateSchema);
