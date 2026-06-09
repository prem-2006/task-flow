import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Optional for Google OAuth users
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  emailVerified: {
    type: Date,
  },
  googleAccessToken: String,
  googleRefreshToken: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
