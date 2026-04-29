const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const courseRoutes = require("./routes/courseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const providerRoutes = require("./routes/providerRoutes");
const jobRoutes = require("./routes/jobRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const counselRoutes = require("./routes/counselRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const roiRoutes = require("./routes/roiRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://skillyer.onrender.com",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded resumes/CVs (with auth check via token in query or header is handled in controller)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/counsel", counselRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/roi", roiRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SkillYer API is running",
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 SkillYer API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
