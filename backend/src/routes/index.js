import express from "express";
const router = express.Router();

// API Routes
router.get('/', (res, res) => {
  res.send("Hello Deric");
});

// 404 Handling
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: {
      statusCode: 404,
      path: req.originalUrl,
      method: req.method,
    },
  });
});

export default router;