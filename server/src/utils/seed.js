const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SkillYer database...');

  // ===== ADMIN =====
  const hashedPass = await bcrypt.hash('SkillYer2026', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashedPass, role: 'admin' },
  });
  console.log('✅ Admin created');

  // ===== CATEGORIES =====
  const catData = [
    { id: 'tech', name: 'Technology', icon: '💻', count: 148 },
    { id: 'data', name: 'Data & AI', icon: '🧠', count: 92 },
    { id: 'design', name: 'Design', icon: '🎨', count: 67 },
    { id: 'business', name: 'Business', icon: '📈', count: 85 },
    { id: 'marketing', name: 'Marketing', icon: '📣', count: 54 },
    { id: 'finance', name: 'Finance', icon: '💰', count: 43 },
    { id: 'leadership', name: 'Leadership', icon: '🏆', count: 38 },
    { id: 'cloud', name: 'Cloud & DevOps', icon: '☁️', count: 62 },
    { id: 'product', name: 'Product', icon: '📦', count: 41 },
    { id: 'language', name: 'Languages', icon: '🌍', count: 29 },
  ];
  for (const cat of catData) {
    await prisma.category.upsert({ where: { id: cat.id }, update: cat, create: cat });
  }
  console.log('✅ Categories seeded');

  // ===== PROVIDERS =====
  const provData = [
    { id: 'coursera', name: 'Coursera', logo: 'Co', color: '#0056D2', bg: '#dbeafe', courses: 120, rating: 4.7 },
    { id: 'udemy', name: 'Udemy', logo: 'Ud', color: '#7C3AED', bg: '#ede9fe', courses: 98, rating: 4.5 },
    { id: 'linkedin', name: 'LinkedIn Learning', logo: 'Li', color: '#0A66C2', bg: '#dbeafe', courses: 85, rating: 4.6 },
    { id: 'edx', name: 'edX', logo: 'eX', color: '#CC0000', bg: '#fee2e2', courses: 75, rating: 4.8 },
    { id: 'udacity', name: 'Udacity', logo: 'Ua', color: '#01B3E3', bg: '#cffafe', courses: 45, rating: 4.4 },
    { id: 'skillshare', name: 'Skillshare', logo: 'Ss', color: '#00B1B0', bg: '#ccfbf1', courses: 60, rating: 4.3 },
    { id: 'pluralsight', name: 'Pluralsight', logo: 'Pl', color: '#F15B2A', bg: '#fff7ed', courses: 55, rating: 4.6 },
    { id: 'great', name: 'Great Learning', logo: 'GL', color: '#2563EB', bg: '#eff6ff', courses: 40, rating: 4.5 },
    { id: 'simplilearn', name: 'Simplilearn', logo: 'SL', color: '#FF6900', bg: '#fff7ed', courses: 35, rating: 4.4 },
    { id: 'nptel', name: 'NPTEL', logo: 'NP', color: '#16A34A', bg: '#dcfce7', courses: 30, rating: 4.7 },
  ];
  for (const prov of provData) {
    await prisma.provider.upsert({ where: { id: prov.id }, update: prov, create: prov });
  }
  console.log('✅ Providers seeded');

  // ===== COURSES =====
  const courseData = [
    { title: 'Machine Learning Specialization', provId: 'coursera', catId: 'data', level: 'Intermediate', duration: '3 months', price: 4999, origPrice: 8999, rating: 4.9, students: '2.1M', hasCert: true, tags: JSON.stringify(['ML', 'Python', 'TensorFlow']), emoji: '🧠', featured: true, expLevel: 'mid' },
    { title: 'Web Developer Bootcamp 2026', provId: 'udemy', catId: 'tech', level: 'Beginner', duration: '65 hrs', price: 499, origPrice: 3499, rating: 4.7, students: '900K', hasCert: true, tags: JSON.stringify(['HTML', 'CSS', 'JavaScript']), emoji: '💻', featured: true, expLevel: 'fresher' },
    { title: 'Google Data Analytics Certificate', provId: 'coursera', catId: 'data', level: 'Beginner', duration: '6 months', price: 2999, origPrice: 5999, rating: 4.8, students: '1.2M', hasCert: true, tags: JSON.stringify(['Analytics', 'SQL', 'Tableau']), emoji: '📊', featured: true, expLevel: 'fresher' },
    { title: 'AWS Cloud Practitioner Essentials', provId: 'edx', catId: 'cloud', level: 'Beginner', duration: '6 weeks', price: 0, origPrice: 0, rating: 4.6, students: '450K', hasCert: true, tags: JSON.stringify(['AWS', 'Cloud', 'DevOps']), emoji: '☁️', featured: false, expLevel: 'fresher' },
    { title: 'UX Design Professional Certificate', provId: 'coursera', catId: 'design', level: 'Beginner', duration: '7 months', price: 3499, origPrice: 6999, rating: 4.8, students: '800K', hasCert: true, tags: JSON.stringify(['UX', 'Figma', 'Research']), emoji: '🎨', featured: true, expLevel: 'fresher' },
    { title: 'Python for Everybody', provId: 'coursera', catId: 'tech', level: 'Beginner', duration: '8 months', price: 1999, origPrice: 4999, rating: 4.8, students: '1.5M', hasCert: true, tags: JSON.stringify(['Python', 'Programming']), emoji: '🐍', featured: false, expLevel: 'fresher' },
    { title: 'Digital Marketing Masterclass', provId: 'udemy', catId: 'marketing', level: 'Beginner', duration: '23 hrs', price: 399, origPrice: 2999, rating: 4.6, students: '350K', hasCert: false, tags: JSON.stringify(['SEO', 'SEM', 'Social Media']), emoji: '📣', featured: false, expLevel: 'any' },
    { title: 'Financial Markets by Yale', provId: 'coursera', catId: 'finance', level: 'Beginner', duration: '7 weeks', price: 0, origPrice: 0, rating: 4.8, students: '900K', hasCert: true, tags: JSON.stringify(['Finance', 'Investing']), emoji: '💰', featured: false, expLevel: 'any' },
    { title: 'React - The Complete Guide', provId: 'udemy', catId: 'tech', level: 'Intermediate', duration: '48 hrs', price: 699, origPrice: 3999, rating: 4.7, students: '780K', hasCert: true, tags: JSON.stringify(['React', 'JavaScript', 'Redux']), emoji: '⚛', featured: true, expLevel: 'mid' },
    { title: 'Product Management Fundamentals', provId: 'linkedin', catId: 'product', level: 'Beginner', duration: '10 hrs', price: 1500, origPrice: 2500, rating: 4.5, students: '120K', hasCert: true, tags: JSON.stringify(['PM', 'Roadmap', 'Agile']), emoji: '📦', featured: false, expLevel: 'mid' },
    { title: 'Deep Learning Specialization', provId: 'coursera', catId: 'data', level: 'Advanced', duration: '5 months', price: 5999, origPrice: 9999, rating: 4.9, students: '600K', hasCert: true, tags: JSON.stringify(['Deep Learning', 'Neural Nets', 'AI']), emoji: '🤖', featured: false, expLevel: 'senior' },
    { title: 'Kubernetes for Developers', provId: 'pluralsight', catId: 'cloud', level: 'Intermediate', duration: '8 hrs', price: 1800, origPrice: 3600, rating: 4.6, students: '95K', hasCert: false, tags: JSON.stringify(['Kubernetes', 'Docker', 'DevOps']), emoji: '🐳', featured: false, expLevel: 'mid' },
    { title: 'Strategic Leadership & Management', provId: 'coursera', catId: 'leadership', level: 'Intermediate', duration: '5 months', price: 3999, origPrice: 6999, rating: 4.7, students: '310K', hasCert: true, tags: JSON.stringify(['Leadership', 'Strategy']), emoji: '🏆', featured: false, expLevel: 'senior' },
    { title: 'UI Design in Figma - Zero to Hero', provId: 'skillshare', catId: 'design', level: 'Beginner', duration: '15 hrs', price: 0, origPrice: 0, rating: 4.6, students: '200K', hasCert: false, tags: JSON.stringify(['Figma', 'UI', 'Design Systems']), emoji: '✏️', featured: false, expLevel: 'fresher' },
    { title: 'Full Stack Data Science', provId: 'great', catId: 'data', level: 'Intermediate', duration: '9 months', price: 19999, origPrice: 35000, rating: 4.5, students: '55K', hasCert: true, tags: JSON.stringify(['Data Science', 'ML', 'Python']), emoji: '🔬', featured: false, expLevel: 'mid' },
    { title: 'Advanced Excel & Power BI', provId: 'udemy', catId: 'data', level: 'Intermediate', duration: '20 hrs', price: 599, origPrice: 2499, rating: 4.7, students: '420K', hasCert: true, tags: JSON.stringify(['Excel', 'Power BI', 'Analytics']), emoji: '📑', featured: false, expLevel: 'mid' },
  ];
  for (const course of courseData) {
    await prisma.course.create({ data: course });
  }
  console.log('✅ Courses seeded');

  // ===== JOBS =====
  const jobData = [
    { title: 'Senior Data Scientist', company: 'Razorpay', logo: 'Rp', logoBg: '#2563EB', logoCo: '#fff', cat: 'data', expLevel: 'senior', jobType: 'hybrid', location: 'Bangalore', salary: '₹28-42 LPA', tags: JSON.stringify(['Python', 'ML', 'SQL']), badge: 'Hot', badgeType: 'hot', postedAt: '2 days ago' },
    { title: 'Frontend Engineer (React)', company: 'Zepto', logo: 'Ze', logoBg: '#7C3AED', logoCo: '#fff', cat: 'tech', expLevel: 'mid', jobType: 'fulltime', location: 'Mumbai', salary: '₹18-28 LPA', tags: JSON.stringify(['React', 'TypeScript', 'Node.js']), badge: 'New', badgeType: 'new', postedAt: '1 day ago' },
    { title: 'Product Manager - Growth', company: 'CRED', logo: 'CR', logoBg: '#111', logoCo: '#fff', cat: 'product', expLevel: 'mid', jobType: 'hybrid', location: 'Bangalore', salary: '₹22-34 LPA', tags: JSON.stringify(['Product', 'Growth', 'A/B Testing']), badge: 'Hot', badgeType: 'hot', postedAt: '3 days ago' },
    { title: 'UX Designer', company: 'Swiggy', logo: 'Sw', logoBg: '#FF6B35', logoCo: '#fff', cat: 'design', expLevel: 'junior', jobType: 'fulltime', location: 'Bangalore', salary: '₹12-18 LPA', tags: JSON.stringify(['Figma', 'UX Research', 'Prototyping']), badge: '', badgeType: '', postedAt: '5 days ago' },
    { title: 'Digital Marketing Manager', company: 'Nykaa', logo: 'Ny', logoBg: '#FF4F81', logoCo: '#fff', cat: 'marketing', expLevel: 'mid', jobType: 'fulltime', location: 'Mumbai', salary: '₹14-20 LPA', tags: JSON.stringify(['SEO', 'SEM', 'Analytics']), badge: 'New', badgeType: 'new', postedAt: '1 day ago' },
    { title: 'Cloud Solutions Architect', company: 'Infosys', logo: 'In', logoBg: '#0057A8', logoCo: '#fff', cat: 'tech', expLevel: 'senior', jobType: 'hybrid', location: 'Pune', salary: '₹25-38 LPA', tags: JSON.stringify(['AWS', 'Azure', 'Terraform']), badge: '', badgeType: '', postedAt: '4 days ago' },
    { title: 'Data Analyst - Finance', company: 'Paytm', logo: 'Pt', logoBg: '#00BAF2', logoCo: '#fff', cat: 'finance', expLevel: 'junior', jobType: 'remote', location: 'Remote', salary: '₹8-14 LPA', tags: JSON.stringify(['SQL', 'Python', 'Power BI']), badge: 'Remote', badgeType: 'new', postedAt: '2 days ago' },
    { title: 'Machine Learning Engineer', company: 'Flipkart', logo: 'Fl', logoBg: '#FF9900', logoCo: '#fff', cat: 'data', expLevel: 'mid', jobType: 'hybrid', location: 'Bangalore', salary: '₹20-32 LPA', tags: JSON.stringify(['PyTorch', 'MLOps', 'Kubernetes']), badge: 'Hot', badgeType: 'hot', postedAt: 'Today' },
    { title: 'Business Analyst - Fresher', company: 'Accenture', logo: 'Ac', logoBg: '#A100FF', logoCo: '#fff', cat: 'business', expLevel: 'fresher', jobType: 'fulltime', location: 'Hyderabad', salary: '₹5-7 LPA', tags: JSON.stringify(['Excel', 'SQL', 'Agile']), badge: 'Fresher OK', badgeType: 'new', postedAt: 'Today' },
    { title: 'Lead Product Designer', company: 'PhonePe', logo: 'Ph', logoBg: '#5F259F', logoCo: '#fff', cat: 'design', expLevel: 'senior', jobType: 'hybrid', location: 'Bangalore', salary: '₹26-40 LPA', tags: JSON.stringify(['Figma', 'Design Systems']), badge: '', badgeType: '', postedAt: '3 days ago' },
    { title: 'Content & Growth Marketer', company: 'Unacademy', logo: 'Un', logoBg: '#34d399', logoCo: '#fff', cat: 'marketing', expLevel: 'junior', jobType: 'remote', location: 'Remote', salary: '₹7-11 LPA', tags: JSON.stringify(['Content', 'SEO', 'Social']), badge: 'Remote', badgeType: 'new', postedAt: '2 days ago' },
    { title: 'Engineering Manager', company: 'Meesho', logo: 'Me', logoBg: '#F43397', logoCo: '#fff', cat: 'leadership', expLevel: 'senior', jobType: 'hybrid', location: 'Bangalore', salary: '₹40-60 LPA', tags: JSON.stringify(['Leadership', 'Engineering']), badge: 'Hot', badgeType: 'hot', postedAt: 'Today' },
  ];
  for (const job of jobData) {
    await prisma.job.create({ data: job });
  }
  console.log('✅ Jobs seeded');

  // ===== TESTIMONIALS =====
  const testiData = [
    { name: 'Priya Sharma', role: 'Data Analyst to Senior Data Scientist', company: 'Razorpay', avatar: 'PS', avatarBg: '#6246ea', avatarCo: '#fff', course: 'Machine Learning Specialization', text: 'SkillYer helped me compare 6 different ML courses in minutes. I picked the Coursera specialization and within 8 months landed a 2x salary hike at Razorpay. The side-by-side comparison is a game changer!', rating: 5 },
    { name: 'Arjun Mehta', role: 'Fresher to Frontend Engineer', company: 'Swiggy', avatar: 'AM', avatarBg: '#ff6b35', avatarCo: '#fff', course: 'Web Developer Bootcamp', text: 'As a fresh B.Tech grad I was lost. The Find My Course quiz understood my background and budget perfectly. Followed the recommendation, built 5 projects, and got placed in 3 months!', rating: 5 },
    { name: 'Sneha Kulkarni', role: 'Marketing Executive to Manager', company: 'Nykaa', avatar: 'SK', avatarBg: '#FF4F81', avatarCo: '#fff', course: 'Digital Marketing Masterclass', text: 'I compared 4 digital marketing courses before choosing. The price vs rating comparison showed me Udemy had the best value. My team performance improved 40% after applying what I learned.', rating: 5 },
    { name: 'Rahul Gupta', role: 'CA to FinTech Product Manager', company: 'CRED', avatar: 'RG', avatarBg: '#10b981', avatarCo: '#fff', course: 'Product Management Fundamentals', text: 'Switched careers from CA to PM using SkillYer. The quiz recommended exactly the right courses for my background. Used the jobs section to find my current role too!', rating: 5 },
    { name: 'Divya Nair', role: 'UX Researcher to Lead Designer', company: 'PhonePe', avatar: 'DN', avatarBg: '#5F259F', avatarCo: '#fff', course: 'UX Design Professional Certificate', text: 'The Google UX certificate on Coursera was recommended by the quiz. The ROI calculator showed me exactly what my salary lift would be — and it was accurate! Now at PhonePe.', rating: 5 },
    { name: 'Karan Singh', role: 'IT Support to Cloud Architect', company: 'Infosys', avatar: 'KS', avatarBg: '#0057A8', avatarCo: '#fff', course: 'AWS Cloud Practitioner Essentials', text: 'Started with the free AWS course SkillYer recommended. Three certifications later, my salary tripled. The structured learning path guidance is what sets SkillYer apart.', rating: 5 },
  ];
  for (const t of testiData) {
    await prisma.testimonial.create({ data: t });
  }
  console.log('✅ Testimonials seeded');

  // ===== ROI DATA =====
  const roiData = [
    { key: 'aws', name: 'AWS Cloud Practitioner', lift: 0.22, demand: 82, demandLabel: 'High - 2,400 open roles', paybackMonths: 3, courseCost: 0 },
    { key: 'ml', name: 'ML Specialization', lift: 0.28, demand: 90, demandLabel: 'Very High - 4,100 open roles', paybackMonths: 5, courseCost: 4999 },
    { key: 'gda', name: 'Google Data Analytics', lift: 0.18, demand: 75, demandLabel: 'High - 3,200 open roles', paybackMonths: 4, courseCost: 2999 },
    { key: 'react', name: 'React Developer', lift: 0.20, demand: 78, demandLabel: 'High - 5,600 open roles', paybackMonths: 3, courseCost: 699 },
    { key: 'pm', name: 'Product Management', lift: 0.25, demand: 65, demandLabel: 'Medium - 1,800 open roles', paybackMonths: 6, courseCost: 1500 },
    { key: 'ux', name: 'Google UX Design', lift: 0.22, demand: 68, demandLabel: 'Medium-High - 1,400 open roles', paybackMonths: 5, courseCost: 3499 },
    { key: 'pmp', name: 'PMP Certification', lift: 0.30, demand: 72, demandLabel: 'High - 2,800 open roles', paybackMonths: 4, courseCost: 8000 },
    { key: 'azure', name: 'Microsoft Azure', lift: 0.24, demand: 76, demandLabel: 'High - 3,100 open roles', paybackMonths: 4, courseCost: 0 },
  ];
  for (const r of roiData) {
    await prisma.roiData.upsert({ where: { key: r.key }, update: r, create: r });
  }
  console.log('✅ ROI Data seeded');

  console.log('\n🎉 Database seeding complete!');
  console.log('👤 Admin login: admin / SkillYer2026');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
