import mongoose from "mongoose";

export const dbCheck = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database is currently unavailable."
    });
  }

  next();
};
