import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  token: { type: String },
  lastLoginAt: { type: Date },
  isActive: { type: Boolean, default: true },
  dalleApiKey: { type: String, default: '' }, // Add this line
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);