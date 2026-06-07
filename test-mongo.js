import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Success: Connected to MongoDB');
    
    // Test user creation
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String
    }, { strict: false }));
    
    const count = await User.countDocuments();
    console.log(`Success: Found ${count} users in the database.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to MongoDB:');
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
