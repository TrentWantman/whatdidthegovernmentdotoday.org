const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  congress: Number,
  number: String,
  type: String,
  title: String,
  originChamber: String,
  latestAction: {
    text: String,
    actionDate: String,
  },
  updateDate: String,
  url: String,
}, { timestamps: true });

billSchema.index({ congress: 1, number: 1 }, { unique: true });
billSchema.index({ 'latestAction.actionDate': 1 });
billSchema.index({ updateDate: 1 });

module.exports = mongoose.model('Bill', billSchema);
