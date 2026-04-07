const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requirementSchema = new Schema({
  eventName: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  eventDate: {
    type: String, // Can also be a date range string
    required: true
  },
  location: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: false
  },
  hiringCategory: {
    type: String,
    required: true,
    enum: ['Event Planner', 'Performer', 'Crew']
  },
  categoryDetails: {
    type: Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Requirement', requirementSchema);
