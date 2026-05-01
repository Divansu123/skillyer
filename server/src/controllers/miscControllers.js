const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===== ENROLLMENTS =====
const getEnrollments = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        include: { course: { include: { provider: true } } },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip,
      }),
      prisma.enrollment.count(),
    ]);
    res.json({
      success: true,
      data: enrollments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createEnrollment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      courseId,
      qualification,
      location,
      preference,
    } = req.body;
    if (!name || !email || !courseId)
      return res.status(400).json({
        success: false,
        message: "Name, email, and courseId required",
      });
    const enrollment = await prisma.enrollment.create({
      data: {
        name,
        email,
        phone,
        courseId: parseInt(courseId),
        qualification,
        source: req.body.source || "public",
        status: req.body.source === "manual" ? "Active" : "Pending",
        location,
        preference,
      },
    });
    res.status(201).json({
      success: true,
      data: enrollment,
      message: "Enrollment submitted successfully!",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateEnrollmentStatus = async (req, res) => {
  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status },
    });
    res.json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      courseId,
      status,
      qualification,
      location,
      preference,
    } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (courseId !== undefined) data.courseId = parseInt(courseId);
    if (status !== undefined) data.status = status;
    if (qualification !== undefined) data.qualification = qualification;
    if (location !== undefined) data.location = location;
    if (preference !== undefined) data.preference = preference;
    if (req.body.source !== undefined) data.source = req.body.source;
    const enrollment = await prisma.enrollment.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { course: { include: { provider: true } } },
    });
    res.json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    await prisma.enrollment.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: "Enrollment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== APPLICATIONS =====
const getApplications = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        include: { job: true },
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip,
      }),
      prisma.application.count(),
    ]);
    res.json({
      success: true,
      data: applications,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      jobId,
      message,
      qualification,
      experience,
      currentCtc,
      expectedCtc,
      noticePeriod,
      currentOrg,
    } = req.body;
    if (!name || !email || !jobId)
      return res
        .status(400)
        .json({ success: false, message: "Name, email, jobId required" });

    // CV file from multer
    const cvUrl = req.file ? `/uploads/resumes/${req.file.filename}` : null;
    const cvName = req.file ? req.file.originalname : null;

    const application = await prisma.application.create({
      data: {
        name,
        email,
        phone,
        jobId: parseInt(jobId),
        message,
        cvUrl,
        cvName,
        qualification,
        experience,
        currentCtc,
        expectedCtc,
        noticePeriod,
        currentOrg,
      },
    });
    res
      .status(201)
      .json({
        success: true,
        data: application,
        message: "Application submitted!",
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const app = await prisma.application.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status },
    });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const app = await prisma.application.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (app?.cvUrl) {
      const path = require("path");
      const fs = require("fs");
      const filePath = path.join(__dirname, "../../..", app.cvUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await prisma.application.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// ===== COUNSEL REQUESTS =====
const getCounselRequests = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [requests, total] = await Promise.all([
      prisma.counselRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip,
      }),
      prisma.counselRequest.count(),
    ]);
    res.json({
      success: true,
      data: requests,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createCounselRequest = async (req, res) => {
  try {
    const { name, email, phone, role, field, expLevel, message } = req.body;
    if (!name || !email || !field)
      return res
        .status(400)
        .json({ success: false, message: "Name, email, and field required" });
    const request = await prisma.counselRequest.create({
      data: {
        name,
        email,
        phone,
        role,
        field,
        expLevel: expLevel || "any",
        message,
      },
    });
    res.status(201).json({
      success: true,
      data: request,
      message:
        "Counselling session booked! We will contact you within 24 hours.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCounselStatus = async (req, res) => {
  try {
    const req2 = await prisma.counselRequest.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status },
    });
    res.json({ success: true, data: req2 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== TESTIMONIALS =====
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== ROI DATA =====
const getRoiData = async (req, res) => {
  try {
    const roiData = await prisma.roiData.findMany();
    const formatted = {};
    roiData.forEach((r) => {
      formatted[r.key] = r;
    });
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== CATEGORIES =====
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { courses: true } } },
    });
    const formatted = categories.map((c) => ({
      ...c,
      count: c._count.courses,
      _count: undefined,
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const cat = await prisma.category.create({ data: { name, icon } });
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== PROVIDERS =====
const getProviders = async (req, res) => {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { coursesList: true } } },
    });
    // Attach real course count
    const formatted = providers.map((p) => ({
      ...p,
      courses: p._count.coursesList,
      _count: undefined,
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createProvider = async (req, res) => {
  try {
    // Strip fields not in Provider schema (url, desc are not columns)
    const { id, name, logo, color, bg, courses, rating } = req.body;
    const provider = await prisma.provider.create({
      data: {
        id,
        name,
        logo: logo || "",
        color: color || "#6246ea",
        bg: bg || "#f0f2f8",
        courses: Number(courses) || 0,
        rating: Number(rating) || 0,
      },
    });
    res.status(201).json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProvider = async (req, res) => {
  try {
    await prisma.provider.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Provider deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProvider = async (req, res) => {
  try {
    const { id, name, logo, color, bg, courses, rating, isActive } = req.body;
    const provider = await prisma.provider.update({
      where: { id: req.params.id },
      data: {
        name,
        logo,
        color,
        bg,
        courses: Number(courses),
        rating: Number(rating),
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });
    res.json({ success: true, data: provider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, icon, isActive } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (icon !== undefined) data.icon = icon;
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    const cat = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===== ADMIN POST =====
const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===== ADMIN AUTH =====
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );
    res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const [courses, jobs, enrollments, applications, counsels] =
      await Promise.all([
        prisma.course.count(),
        prisma.job.count({ where: { isActive: true } }),
        prisma.enrollment.count(),
        prisma.application.count(),
        prisma.counselRequest.count(),
      ]);
    res.json({
      success: true,
      data: { courses, jobs, enrollments, applications, counsels },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const limit = 10;
    const [recentEnrollments, recentApplications, recentCounsels] =
      await Promise.all([
        prisma.enrollment.findMany({
          take: limit,
          orderBy: { createdAt: "desc" },
          include: { course: true },
        }),
        prisma.application.findMany({
          take: limit,
          orderBy: { createdAt: "desc" },
          include: { job: true },
        }),
        prisma.counselRequest.findMany({
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const activities = [
      ...recentEnrollments.map((e) => ({
        user: e.name,
        action: "Enrolled",
        item: e.course?.title || "Unknown Course",
        time: e.createdAt,
        type: "enrollment",
      })),
      ...recentApplications.map((a) => ({
        user: a.name,
        action: "Applied for Job",
        item: a.job?.title || "Unknown Job",
        time: a.createdAt,
        type: "application",
      })),
      ...recentCounsels.map((c) => ({
        user: c.name,
        action: "Booked Counselling",
        item: c.field,
        time: c.createdAt,
        type: "counsel",
      })),
    ];

    // Sort by time desc, take top 10
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const top = activities.slice(0, 10).map((a) => ({
      ...a,
      timeAgo: formatTimeAgo(a.time),
    }));

    res.json({ success: true, data: top });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

function formatTimeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

module.exports = {
  getEnrollments,
  createEnrollment,
  updateEnrollmentStatus,
  updateEnrollment,
  deleteEnrollment,
  getApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  getCounselRequests,
  createCounselRequest,
  updateCounselStatus,
  getTestimonials,
  getRoiData,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getProviders,
  createProvider,
  deleteProvider,
  updateProvider,
  adminLogin,
  getAdminStats,
  getRecentActivity,
  createAdmin,
};
