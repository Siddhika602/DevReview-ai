import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Review from './models/Review.js';

dotenv.config();

const runVerification = async () => {
  console.log('--- Starting Backend Verification Tests ---');

  try {
    // 1. Test Database connection
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devreview_ai';
    console.log(`Connecting to: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✔ MongoDB Connected Successfully.');

    // Cleanup previous verification test users
    await User.deleteMany({ email: 'verify_test@devreview.ai' });
    console.log('✔ Cleaned up stale verification users.');

    // 2. Create User (Registration check)
    const testUser = new User({
      username: 'verify_tester',
      email: 'verify_test@devreview.ai',
      password: 'password123',
    });
    
    await testUser.save();
    console.log('✔ User Registration model pre-save hook and validation verified.');

    // 3. Authenticate User (Password comparison check)
    const fetchedUser = await User.findOne({ email: 'verify_test@devreview.ai' });
    const isPasswordValid = await fetchedUser.comparePassword('password123');
    const isPasswordInvalid = await fetchedUser.comparePassword('wrong_password');
    
    if (isPasswordValid && !isPasswordInvalid) {
      console.log('✔ Password comparison verification passed.');
    } else {
      throw new Error('Password comparison validation failed.');
    }

    // 4. Create Review (Schema structures check)
    const testReview = new Review({
      userId: fetchedUser._id,
      language: 'javascript',
      code: 'const x = 5;',
      title: 'Verification Test Code',
      score: 95,
      reviewData: {
        summary: 'Verification check summary',
        categories: {
          bugs: { rating: 'Good', content: 'None' },
          security: { rating: 'Good', content: 'None' },
          performance: { rating: 'Good', content: 'None' },
          readability: { rating: 'Good', content: 'None' },
          bestPractices: { rating: 'Good', content: 'None' },
          suggestedImprovements: { rating: 'Good', content: 'None' },
        },
        refactoredCode: 'const x = 5;',
      },
    });

    await testReview.save();
    console.log('✔ Review schema records creation verified.');

    // Query stats test
    const count = await Review.countDocuments({ userId: fetchedUser._id });
    console.log(`✔ Stats counting query verification: found ${count} reviews.`);

    // Cleanup test entries
    await Review.deleteMany({ userId: fetchedUser._id });
    await User.deleteOne({ _id: fetchedUser._id });
    console.log('✔ Verification database entries cleaned up.');

    console.log('✔ ALL MODEL CONFIGURATIONS VERIFIED CORRECTLY.');
  } catch (error) {
    console.error('❌ Verification check failed with error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('--- Disconnected database. Verification completed. ---');
  }
};

runVerification();
