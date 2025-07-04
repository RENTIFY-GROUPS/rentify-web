const mongoose = require('mongoose');

const roommateProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  age: { type: Number, required: true, min: 18 },
  occupation: { type: String },
  smoking: { type: Boolean, default: false },
  pets: { type: Boolean, default: false },
  sleepSchedule: { type: String, enum: ['Early Bird', 'Night Owl', 'Flexible'] },
  cleanliness: { type: String, enum: ['Very Clean', 'Moderately Clean', 'Relaxed'] },
  socialHabits: { type: String, enum: ['Very Social', 'Moderately Social', 'Quiet'] },
  budget: { type: Number, min: 0 },
  locationPreference: { type: String },
  moveInDate: { type: Date },
  bio: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RoommateProfile', roommateProfileSchema);