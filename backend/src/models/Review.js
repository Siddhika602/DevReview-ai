import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['cpp', 'c', 'java', 'javascript', 'python', 'sql'],
    },
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Code Review',
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    reviewData: {
      summary: { type: String, default: '' },
      categories: {
        bugs: {
          rating: { type: String, default: 'Good' },
          content: { type: String, default: '' }
        },
        security: {
          rating: { type: String, default: 'Good' },
          content: { type: String, default: '' }
        },
        performance: {
          rating: { type: String, default: 'Good' },
          content: { type: String, default: '' }
        },
        readability: {
          rating: { type: String, default: 'Good' },
          content: { type: String, default: '' }
        },
        bestPractices: {
          rating: { type: String, default: 'Good' },
          content: { type: String, default: '' }
        },
        suggestedImprovements: {
          rating: { type: String, default: 'Good' },
          content: { type: String, default: '' }
        }
      },
      refactoredCode: { type: String, default: '' }
    }
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
