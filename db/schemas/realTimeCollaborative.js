const mongoose = require("mongoose");

const  realTimeCollaborative = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: Buffer
  }
});

const RealTimeCollaborative = mongoose.model("realTimeCollaborative", realTimeCollaborative);
module.exports = {RealTimeCollaborative}