const prisma = require('../config/prisma');

// GET all courses with filters
const getCourses = async (req, res) => {
  try {
    const { cat, level, price, search, featured, important, admin, limit = 12, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    // Public API only shows active courses (admin=true bypasses)
    if (admin !== 'true') where.isActive = true;
    if (cat && cat !== 'All') where.catId = cat;
    if (level && level !== 'All') where.level = level;
    if (price === 'Free') where.price = 0;
    if (price === 'Paid') where.price = { gt: 0 };
    if (featured === 'true') where.featured = true;
    if (important === 'true') where.isImportant = true;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: { provider: true, category: true },
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
        take: parseInt(limit),
        skip,
      }),
      prisma.course.count({ where }),
    ]);

    const formatted = courses.map(c => ({
      ...c,
      tags: JSON.parse(c.tags || '[]'),
    }));

    res.json({ success: true, data: formatted, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single course
const getCourse = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { provider: true, category: true },
    });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: { ...course, tags: JSON.parse(course.tags || '[]') } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Default provider logos/colors for well-known platforms
const KNOWN_PROVIDERS = {
  coursera:    { name: 'Coursera',    logo: 'Co', color: '#0056d2', bg: '#e8f0fe' },
  udemy:       { name: 'Udemy',       logo: 'Ud', color: '#a435f0', bg: '#f3e8ff' },
  edx:         { name: 'edX',         logo: 'eX', color: '#02262b', bg: '#e6f4f1' },
  linkedin:    { name: 'LinkedIn',    logo: 'Li', color: '#0077b5', bg: '#e8f4fb' },
  great:       { name: 'Great Learning', logo: 'GL', color: '#e8242d', bg: '#fde8e9' },
  simplilearn: { name: 'Simplilearn', logo: 'SL', color: '#ff6600', bg: '#fff0e6' },
  udacity:     { name: 'Udacity',     logo: 'Ua', color: '#02b3e4', bg: '#e6f8fd' },
  pluralsight: { name: 'Pluralsight', logo: 'Ps', color: '#f15b2a', bg: '#fef0eb' },
  skillshare:  { name: 'Skillshare',  logo: 'Ss', color: '#00cf91', bg: '#e6fdf7' },
  nptel:       { name: 'NPTEL',       logo: 'NP', color: '#e63946', bg: '#fde8e9' },
};

// POST create course (admin)
const createCourse = async (req, res) => {
  try {
    const { title, provId, catId, level, duration, price, origPrice, rating, students, hasCert, tags, emoji, featured, expLevel } = req.body;

    // Auto-create provider if it doesn't exist (handles seeded IDs like 'coursera', 'udemy')
    const knownProv = KNOWN_PROVIDERS[provId];
    await prisma.provider.upsert({
      where: { id: provId },
      update: {},
      create: {
        id: provId,
        name: knownProv?.name || provId,
        logo: knownProv?.logo || provId.slice(0, 2).toUpperCase(),
        color: knownProv?.color || '#6246ea',
        bg: knownProv?.bg || '#f0f2f8',
        courses: 0,
        rating: 0,
      },
    });

    // Auto-create category if it doesn't exist
    const KNOWN_CATS = {
      tech: { name: 'Technology', icon: '💻' }, data: { name: 'Data & AI', icon: '📊' },
      design: { name: 'Design', icon: '🎨' }, marketing: { name: 'Marketing', icon: '📣' },
      finance: { name: 'Finance', icon: '💰' }, leadership: { name: 'Leadership', icon: '🏆' },
      cloud: { name: 'Cloud', icon: '☁️' }, product: { name: 'Product', icon: '📦' },
      business: { name: 'Business', icon: '🏢' }, language: { name: 'Language', icon: '🌐' },
    };
    const knownCat = KNOWN_CATS[catId];
    await prisma.category.upsert({
      where: { name: knownCat?.name || catId },
      update: {},
      create: {
        name: knownCat?.name || catId,
        icon: knownCat?.icon || '📚',
        count: 0,
      },
    });

    // Fetch the actual catId (uuid) from DB
    const categoryRecord = await prisma.category.findFirst({ where: { name: knownCat?.name || catId } });

    const course = await prisma.course.create({
      data: {
        title,
        provId,
        catId: categoryRecord?.id || catId,
        level, duration,
        price: parseInt(price) || 0,
        origPrice: parseInt(origPrice) || 0,
        rating: parseFloat(rating) || 4.5,
        students: students || '0',
        hasCert: hasCert === true || hasCert === 'true',
        tags: JSON.stringify(Array.isArray(tags) ? tags : tags?.split(',').map(t => t.trim()) || []),
        emoji: emoji || '📚',
        featured: featured === true || featured === 'true',
        isImportant: (req?.body?.isImportant === true || req?.body?.isImportant === 'true') || false,
        isActive: req?.body?.isActive !== undefined ? (req.body.isActive === true || req.body.isActive === 'true') : true,
        expLevel: expLevel || 'any',
      },
    });
    res.status(201).json({ success: true, data: { ...course, tags: JSON.parse(course.tags) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update course (admin)
const updateCourse = async (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    const data = { ...rest };
    if (tags) data.tags = JSON.stringify(Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()));
    if (data.price) data.price = parseInt(data.price);
    if (data.origPrice) data.origPrice = parseInt(data.origPrice);
    if (data.rating) data.rating = parseFloat(data.rating);

    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json({ success: true, data: { ...course, tags: JSON.parse(course.tags) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE course (admin)
const deleteCourse = async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse };
