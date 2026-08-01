import express from 'express';
import { createReview, getReviews, getReviewById, getStats } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all review routes

router.route('/')
  .post(createReview)
  .get(getReviews);

router.get('/stats', getStats);
router.get('/:id', getReviewById);

export default router;
