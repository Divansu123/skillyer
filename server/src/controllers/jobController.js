const prisma = require('../config/prisma');

const getJobs = async (req, res) => {
  try {
    const { cat, expLevel, jobType, search, admin, limit = 12, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    // Only filter active jobs on public portal; admin=true bypasses this
    if (admin !== 'true') where.isActive = true;
    if (cat) where.cat = cat;
    if (expLevel) where.expLevel = expLevel;
    if (jobType) where.jobType = jobType;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { company: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where, orderBy: { createdAt: 'desc' },
        take: parseInt(limit), skip,
      }),
      prisma.job.count({ where }),
    ]);

    res.json({ success: true, data: jobs.map(j => ({ ...j, tags: JSON.parse(j.tags || '[]') })), total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getJob = async (req, res) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: { ...job, tags: JSON.parse(job.tags || '[]') } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createJob = async (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    const job = await prisma.job.create({
      data: {
        ...rest,
        tags: JSON.stringify(Array.isArray(tags) ? tags : tags?.split(',').map(t => t.trim()) || []),
      },
    });
    res.status(201).json({ success: true, data: { ...job, tags: JSON.parse(job.tags) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    const data = { ...rest };
    if (tags) data.tags = JSON.stringify(Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()));
    const job = await prisma.job.update({ where: { id: parseInt(req.params.id) }, data });
    res.json({ success: true, data: { ...job, tags: JSON.parse(job.tags) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    await prisma.job.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob };
