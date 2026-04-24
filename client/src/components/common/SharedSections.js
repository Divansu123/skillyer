import React from 'react';

export const STATIC_TESTIMONIALS = [
  { id: 1, name: 'Priya Sharma', role: 'Data Analyst to Senior Data Scientist', company: 'Razorpay', avatar: 'PS', avatarBg: '#6246ea', avatarCo: '#fff', course: 'Machine Learning Specialization', text: 'SkillYer helped me compare 6 different ML courses in minutes. I picked the Coursera specialization and within 8 months landed a 2x salary hike at Razorpay. The side-by-side comparison is a game changer!', rating: 5 },
  { id: 2, name: 'Arjun Mehta', role: 'Fresher to Frontend Engineer', company: 'Swiggy', avatar: 'AM', avatarBg: '#ff6b35', avatarCo: '#fff', course: 'Web Developer Bootcamp', text: 'As a fresh B.Tech grad I was lost. The Find My Course quiz understood my background and budget perfectly. Followed the recommendation, built 5 projects, and got placed in 3 months!', rating: 5 },
  { id: 3, name: 'Sneha Kulkarni', role: 'Marketing Executive to Manager', company: 'Nykaa', avatar: 'SK', avatarBg: '#FF4F81', avatarCo: '#fff', course: 'Digital Marketing Masterclass', text: 'I compared 4 digital marketing courses before choosing. The price vs rating comparison showed me Udemy had the best value. My team performance improved 40% after applying what I learned.', rating: 5 },
  { id: 4, name: 'Rahul Gupta', role: 'CA to FinTech Product Manager', company: 'CRED', avatar: 'RG', avatarBg: '#10b981', avatarCo: '#fff', course: 'Product Management Fundamentals', text: 'Switched careers from CA to PM using SkillYer. The quiz recommended exactly the right courses for my background. Used the jobs section to find my current role too!', rating: 5 },
  { id: 5, name: 'Divya Nair', role: 'UX Researcher to Lead Designer', company: 'PhonePe', avatar: 'DN', avatarBg: '#5F259F', avatarCo: '#fff', course: 'UX Design Professional Certificate', text: 'The Google UX certificate on Coursera was recommended by the quiz. The ROI calculator showed me exactly what my salary lift would be — and it was accurate! Now at PhonePe.', rating: 5 },
  { id: 6, name: 'Karan Singh', role: 'IT Support to Cloud Architect', company: 'Infosys', avatar: 'KS', avatarBg: '#0057A8', avatarCo: '#fff', course: 'AWS Cloud Practitioner Essentials', text: 'Started with the free AWS course SkillYer recommended. Three certifications later, my salary tripled. The structured learning path guidance is what sets SkillYer apart from other platforms.', rating: 5 },
];

// Testimonials — exact HTML design (purple gradient bg, horizontal scroll cards)
export const Testimonials = ({ testimonials }) => {
  const data = (testimonials && testimonials.length > 0) ? testimonials : STATIC_TESTIMONIALS;
  return (
    <div className="testi-section">
      <div className="testi-inner">
        <div className="testi-header">
          <div>
            <div className="testi-tag">Success Stories</div>
            <div className="testi-title">What Learners Say</div>
            <div className="testi-sub">Real stories from professionals who upskilled and levelled up.</div>
          </div>
        </div>
        <div className="testi-track">
          {data.map(t => (
            <div key={t.id} className="testi-card">
              <div className="testi-card-accent" />
              <div className="testi-stars">
                {Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}
              </div>
              <div className="testi-text">{t.text}</div>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: t.avatarBg, color: t.avatarCo }}>{t.avatar}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                  <div className="testi-company">{t.company}</div>
                </div>
              </div>
              <div className="testi-course">📚 via {t.course}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Counsel Section — exact HTML design (orange→purple gradient)
export const CounselSection = ({ onSubmit }) => {
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', role: '', field: 'Technology', expLevel: 'Fresher / Student', message: '' });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setError('Name and email are required'); return; }
    setError('');
    setLoading(true);
    try { await onSubmit(form); setSuccess(true); }
    catch (e) { setError(e?.response?.data?.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="counsel-section">
      <div className="counsel-inner">
        <div className="testi-tag">Free Session</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, color: 'white', marginBottom: 10, marginTop: 8 }}>Career Counselling</div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6 }}>Not sure which path to take? Book a free 30-min session with our career advisors.</p>
        <div className="counsel-card">
          {success ? (
            <div style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ color: 'white', fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Session Booked!</div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.6 }}>Our career advisor will reach out within 24 hours to confirm your session. Check your email!</p>
            </div>
          ) : (
            <div className="counsel-form">
              {error && <div style={{ color:"#fca5a5", fontSize:12, marginBottom:10, padding:"8px 12px", background:"rgba(239,68,68,0.15)", borderRadius:8 }}>{error}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="counsel-label">Full Name *</label><input className="counsel-input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><label className="counsel-label">Email *</label><input className="counsel-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><label className="counsel-label">Phone</label><input className="counsel-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><label className="counsel-label">Current Role</label><input className="counsel-input" placeholder="e.g. Software Engineer" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
              </div>
              <label className="counsel-label" style={{ marginTop: 4 }}>Field of Interest *</label>
              <select className="counsel-select" value={form.field} onChange={e => setForm({ ...form, field: e.target.value })}>
                {['Technology', 'Data & AI', 'Design', 'Marketing', 'Finance', 'Product Management', 'Leadership', 'Not sure yet'].map(f => <option key={f}>{f}</option>)}
              </select>
              <label className="counsel-label">Experience Level</label>
              <select className="counsel-select" value={form.expLevel} onChange={e => setForm({ ...form, expLevel: e.target.value })}>
                {['Fresher / Student', '1-3 years', '3-7 years', '7+ years'].map(l => <option key={l}>{l}</option>)}
              </select>
              <label className="counsel-label">Your Question / Goal</label>
              <textarea className="counsel-input" rows={3} placeholder="Tell us what you want to achieve or any specific questions..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: 'vertical', minHeight: 75 }} />
              <button className="counsel-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Booking...' : 'Book Free Session →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Footer — exact HTML design
export const Footer = () => (
  <footer>
    <div className="footer-logo">SkillYer</div>
    <div className="footer-links">
      {['About', 'Blog', 'Careers', 'Privacy', 'Terms', 'Contact'].map(l => (
        <a key={l} href="#">{l}</a>
      ))}
    </div>
    <p>© 2026 TruhireAI Private Limited · Made with ❤️ for India's workforce</p>
    <p>© Current data is only for representation & testing purpose.</p>
  </footer>
);
