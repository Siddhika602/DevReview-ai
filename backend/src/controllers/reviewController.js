import Review from '../models/Review.js';
import { reviewCodeWithGemini } from '../services/geminiService.js';

// @desc    Analyze code and create a review record
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  const { code, language } = req.body;

  try {
    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Please provide code and language' });
    }

    const validLanguages = ['cpp', 'c', 'java', 'javascript', 'python', 'sql'];
    if (!validLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Unsupported programming language' });
    }

    // Call Gemini API (or Mock fallback)
    const reviewData = await reviewCodeWithGemini(code, language);

    // Save review to database
    const review = await Review.create({
      userId: req.user._id,
      language: language.toLowerCase(),
      code,
      title: reviewData.title || 'Untitled Code Review',
      score: reviewData.score || 0,
      reviewData,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's review history
// @route   GET /api/reviews
// @access  Private
export const getReviews = async (req, res) => {
  try {
    // Find all reviews by current user, sorted by newest first
    const reviews = await Review.find({ userId: req.user._id })
      .select('language title score createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get details of a single review
// @route   GET /api/reviews/:id
// @access  Private
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, userId: req.user._id });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('Get review by ID error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get review statistics for user dashboard
// @route   GET /api/reviews/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count reviews
    const totalReviews = await Review.countDocuments({ userId });

    if (totalReviews === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalReviews: 0,
          averageScore: 0,
          criticalIssues: 0,
          needsImprovement: 0,
          languages: [],
          recentHistory: []
        }
      });
    }

    // Aggregate statistics
    const statsResult = await Review.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
        }
      }
    ]);

    const averageScore = statsResult[0] ? Math.round(statsResult[0].averageScore * 10) / 10 : 0;

    // Count critical and improvements across categories
    const allUserReviews = await Review.find({ userId });
    let criticalIssues = 0;
    let needsImprovement = 0;

    allUserReviews.forEach(rev => {
      const cats = rev.reviewData?.categories;
      if (cats) {
        Object.keys(cats).forEach(key => {
          const rating = cats[key]?.rating;
          if (rating === 'Critical') criticalIssues++;
          else if (rating === 'Needs Improvement') needsImprovement++;
        });
      }
    });

    // Language distribution
    const languageStats = await Review.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 }
        }
      },
      { $project: { language: '$_id', count: 1, _id: 0 } }
    ]);

    // Score progression (up to 7 reviews) for simple frontend chart
    const scoreProgression = allUserReviews
      .slice(-7)
      .map(rev => ({
        date: rev.createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: rev.score,
        title: rev.title
      }));

    res.status(200).json({
      success: true,
      stats: {
        totalReviews,
        averageScore,
        criticalIssues,
        needsImprovement,
        languages: languageStats,
        scoreProgression
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
