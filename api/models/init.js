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

const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  images: [{ type: String, required: true }],
  imageSummaries: [{ type: String, required: true }],
  generatedStory: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  audioPath: { type: String },
  isImproved: { type: Boolean, default: false }, // Add this line
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Story = mongoose.model('Story', storySchema);