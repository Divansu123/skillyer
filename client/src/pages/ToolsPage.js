import React, { useState, useEffect } from 'react';
import { Footer } from '../components/common/SharedSections';
import { fetchRoiData } from '../services/api';

// ====== ROI CALCULATOR ======
const ROICalculator = () => {
  const [roiData, setRoiData] = useState({});
  const [cert, setCert] = useState('aws');
  const [salary, setSalary] = useState(8);
  const [city, setCity] = useState(1.2);

  useEffect(() => {
    fetchRoiData().then(r => setRoiData(r.data.data)).catch(() => {});
  }, []);

  const data = roiData[cert];
  const cityMult = parseFloat(city);
  const newSalary = data ? ((salary * (1 + data.lift)) * cityMult).toFixed(1) : 0;
  const annualGain = data ? (((salary * data.lift * cityMult) * 100000)).toFixed(0) : 0;
  const payback = data?.paybackMonths || 0;

  return (
    <div className="roi-section">
      <div className="roi-inner">
        <div className="roi-tag">Live Salary Data</div>
        <div className="roi-title">Real-Time ROI Calculator</div>
        <p className="roi-sub">See your salary lift before you enroll. Based on live job market data from India's top hiring platforms.</p>
        <div className="roi-grid">
          <div className="roi-card">
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8, display: 'block' }}>Choose a Certification</label>
            <select className="roi-select" value={cert} onChange={e => setCert(e.target.value)}>
              {Object.entries(roiData).map(([key, d]) => <option key={key} value={key}>{d.name}</option>)}
            </select>
            <label className="roi-slider-label">Your Current Salary: ₹{salary} LPA</label>
            <input type="range" min="3" max="50" step="1" value={salary} onChange={e => setSalary(Number(e.target.value))} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: -6, marginBottom: 16 }}>
              <span>₹3 LPA</span><span>₹50 LPA</span>
            </div>
            <label className="roi-slider-label">Your City</label>
            <select className="roi-select" value={city} onChange={e => setCity(e.target.value)}>
              <option value="1.2">Bangalore</option>
              <option value="1.15">Mumbai</option>
              <option value="1.1">Delhi NCR</option>
              <option value="1.0">Pune</option>
              <option value="0.9">Other Cities</option>
            </select>
          </div>
          {data && (
            <div className="roi-result">
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 8 }}>{data.name}</div>
              <div className="roi-result-row">
                <span className="roi-result-label">Current Salary</span>
                <span className="roi-result-val">₹{salary} LPA</span>
              </div>
              <div className="roi-result-row">
                <span className="roi-result-label">Projected Salary</span>
                <span className="roi-result-val green">₹{newSalary} LPA</span>
              </div>
              <div className="roi-result-row">
                <span className="roi-result-label">Annual Gain</span>
                <span className="roi-result-val green">+₹{Number(annualGain).toLocaleString()}</span>
              </div>
              <div className="roi-result-row">
                <span className="roi-result-label">Salary Lift</span>
                <span className="roi-result-val green">+{(data.lift * 100).toFixed(0)}%</span>
              </div>
              <div className="roi-result-row">
                <span className="roi-result-label">Market Demand</span>
                <span className="roi-result-val" style={{ fontSize: 13 }}>{data.demandLabel}</span>
              </div>
              <div className="roi-result-row" style={{ border: 'none' }}>
                <span className="roi-result-label">Payback Period</span>
                <span className="roi-result-val">{payback} months</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${data.demand}%`, background: 'linear-gradient(90deg, #6246ea, #10b981)', borderRadius: 10 }} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Market demand score: {data.demand}/100</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ====== SKILL DIAGNOSTIC ======
const DIAG_TESTS = [
  { id: 'dm', name: 'Digital Marketing', icon: '📣', desc: 'Test your SEO, SEM and social media knowledge', questions: [
    { q: 'What does CTR stand for?', opts: ['Click-Through Rate', 'Cost To Reach', 'Customer Total Revenue', 'Content Type Rating'], ans: 0 },
    { q: 'Which metric measures cost per 1000 ad impressions?', opts: ['CPC', 'CPM', 'CPA', 'CTR'], ans: 1 },
    { q: 'What is Technical Schema in SEO?', opts: ['A content calendar', 'Structured data markup', 'A social media strategy', 'A backlink tool'], ans: 1 },
    { q: 'What is a canonical tag used for?', opts: ['Speed optimization', 'Avoid duplicate content', 'Image optimization', 'Tracking conversions'], ans: 1 },
    { q: 'Which factor most affects Google ranking?', opts: ['Social shares', 'E-E-A-T and quality backlinks', 'Ad spend', 'Domain age only'], ans: 1 },
  ]},
  { id: 'py', name: 'Python Programming', icon: '🐍', desc: 'Test your Python fundamentals', questions: [
    { q: 'Output of len([1,2,3,4,5])?', opts: ['4', '5', '6', 'Error'], ans: 1 },
    { q: 'Library for data manipulation in Python?', opts: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn'], ans: 1 },
    { q: 'What does list comprehension do?', opts: ['Creates a copy', 'Creates new list from existing', 'Sorts a list', 'Filters only'], ans: 1 },
    { q: 'What is a lambda function?', opts: ['A loop', 'An anonymous inline function', 'A class method', 'A decorator'], ans: 1 },
    { q: 'pd.DataFrame.groupby() purpose?', opts: ['Filters rows', 'Groups data for aggregation', 'Merges datasets', 'Sorts columns'], ans: 1 },
  ]},
  { id: 'ux', name: 'UX Design', icon: '🎨', desc: 'Test your user experience knowledge', questions: [
    { q: 'What does UX stand for?', opts: ['User Experience', 'Unique Exchange', 'Universal Expression', 'User Exchange'], ans: 0 },
    { q: 'What is a user persona?', opts: ['A real user', 'A fictional profile representing user type', 'A test participant', 'An admin'], ans: 1 },
    { q: 'Purpose of a wireframe?', opts: ['Final design', 'Low-fidelity layout sketch', 'Color guide', 'Code structure'], ans: 1 },
    { q: 'What does "card sorting" test?', opts: ['Visual design', 'Information architecture', 'User speed', 'Device performance'], ans: 1 },
    { q: 'What is a heuristic evaluation?', opts: ['A user interview', 'Expert review against usability principles', 'Usability testing', 'A/B testing'], ans: 1 },
  ]},
  { id: 'fin', name: 'Financial Literacy', icon: '💰', desc: 'Test your personal finance basics', questions: [
    { q: 'What does P/E ratio measure?', opts: ['Profit efficiency', 'Price to Earnings ratio', 'Portfolio exposure', 'Payment exchange'], ans: 1 },
    { q: 'What is a mutual fund?', opts: ['A savings account', 'Pooled investment vehicle', 'Government bond', 'Insurance policy'], ans: 1 },
    { q: 'What is compound interest?', opts: ['Simple interest', 'Interest on interest', 'Fixed deposit rate', 'Loan interest'], ans: 1 },
    { q: 'What is diversification in investing?', opts: ['All eggs in one basket', 'Spreading investments to reduce risk', 'Buying foreign stocks', 'Timing the market'], ans: 1 },
    { q: 'What is alpha in portfolio management?', opts: ['Total returns', 'Excess return over benchmark', 'Market risk measure', 'Dividend yield'], ans: 1 },
  ]},
];

const DiagnosticSection = () => {
  const [active, setActive] = useState(null);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const startTest = (test) => { setActive(test); setStep(0); setScore(0); setDone(false); };
  const reset = () => { setActive(null); setDone(false); };

  const answer = (idx) => {
    const correct = active.questions[step].ans === idx;
    const newScore = correct ? score + 1 : score;
    if (step + 1 >= active.questions.length) { setScore(newScore); setDone(true); }
    else { setScore(newScore); setStep(s => s + 1); }
  };

  const pct = active ? Math.round((score / active.questions.length) * 100) : 0;
  const level = pct >= 80 ? 'Advanced' : pct >= 50 ? 'Intermediate' : 'Beginner';
  const suggestion = pct >= 80 ? 'You\'re an expert! Consider an advanced certification.' : pct >= 50 ? 'Good foundation! An intermediate course will fill the gaps.' : 'Start with a beginner course to build your fundamentals.';

  return (
    <div style={{ marginTop: 40 }}>
      <div className="section-tag">Skill Diagnostics</div>
      <div className="section-title" style={{ marginBottom: 8 }}>Test Your Skill Level</div>
      <p className="section-sub" style={{ marginBottom: 24 }}>5 adaptive questions in 60 seconds. Get a personalized learning prescription.</p>

      {!active ? (
        <div className="diag-grid">
          {DIAG_TESTS.map(test => (
            <div key={test.id} className="diag-card" onClick={() => startTest(test)}>
              <div className="diag-icon">{test.icon}</div>
              <div className="diag-name">{test.name}</div>
              <div className="diag-desc">{test.desc}</div>
              <div className="diag-meta"><span>⚡ 60 sec</span><span>📝 5 questions</span></div>
            </div>
          ))}
        </div>
      ) : done ? (
        <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 18, padding: 32, maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{pct >= 80 ? '🏆' : pct >= 50 ? '📈' : '📚'}</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{active.name} Results</div>
          <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>{score}/{active.questions.length} correct ({pct}%)</div>
          <div style={{ height: 10, background: 'var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? 'var(--accent3)' : pct >= 50 ? 'var(--accent)' : 'var(--accent-alt)', borderRadius: 10, transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ marginBottom: 8 }}><strong>Your Level:</strong> {level}</div>
          <div style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>💡 {suggestion}</div>
          <button className="btn-primary" onClick={reset}>Try Another Test</button>
        </div>
      ) : (
        <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 18, padding: 32, maxWidth: 480 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: 12, color: 'var(--text3)' }}>
            <span>{active.icon} {active.name}</span>
            <span>Q{step + 1}/{active.questions.length}</span>
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ height: '100%', width: `${((step) / active.questions.length) * 100}%`, background: 'var(--accent)', borderRadius: 10 }} />
          </div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 20, lineHeight: 1.4 }}>{active.questions[step].q}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {active.questions[step].opts.map((opt, i) => (
              <button key={i} className="quiz-opt" onClick={() => answer(i)} style={{ textAlign: 'left' }}>{opt}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ====== CV BUILDER ======
const CVBuilder = () => {
  const [cv, setCv] = useState({ name: '', role: '', email: '', phone: '', summary: '', skills: '', experience: '', education: '', certifications: '' });
  const upd = (k, v) => setCv(p => ({ ...p, [k]: v }));

  return (
    <div style={{ marginTop: 60 }}>
      <div className="section-tag">CV Builder</div>
      <div className="section-title" style={{ marginBottom: 8 }}>Build Your ATS-Ready CV</div>
      <p className="section-sub" style={{ marginBottom: 24 }}>Fill in your details and get a professional CV preview instantly.</p>
      <div className="cv-grid">
        {/* Form */}
        <div className="cv-form-section">
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 16, color: 'var(--text)' }}>Your Details</div>
          {[
            ['Full Name', 'name', 'text', 'e.g. Priya Sharma'],
            ['Target Role', 'role', 'text', 'e.g. Senior Data Scientist'],
            ['Email', 'email', 'email', 'you@email.com'],
            ['Phone', 'phone', 'text', '+91 98765 43210'],
          ].map(([label, key, type, ph]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label className="form-label">{label}</label>
              <input className="form-input" type={type} placeholder={ph} value={cv[key]} onChange={e => upd(key, e.target.value)} />
            </div>
          ))}
          {[
            ['Professional Summary', 'summary', 'Write a 2-3 sentence professional summary...'],
            ['Key Skills', 'skills', 'e.g. Python, Machine Learning, SQL, Tableau...'],
            ['Work Experience', 'experience', 'Role | Company | Duration\n• Achievement 1\n• Achievement 2'],
            ['Education', 'education', 'Degree | University | Year'],
            ['Certifications', 'certifications', 'e.g. AWS Cloud Practitioner (2025), Google Data Analytics...'],
          ].map(([label, key, ph]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label className="form-label">{label}</label>
              <textarea className="form-input" rows={3} placeholder={ph} value={cv[key]} onChange={e => upd(key, e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          ))}
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => window.print()}>📄 Download / Print CV</button>
        </div>

        {/* Preview */}
        <div className="cv-preview-section" id="cv-preview">
          <div style={{ border: '2px solid var(--border)', borderRadius: 12, padding: 28, minHeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
            {cv.name ? (
              <>
                <div style={{ borderBottom: '2px solid var(--accent)', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{cv.name}</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{cv.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {cv.email && <span>✉ {cv.email}</span>}
                    {cv.phone && <span>📞 {cv.phone}</span>}
                  </div>
                </div>
                {cv.summary && <><div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text3)', marginBottom: 6 }}>Summary</div><p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 16 }}>{cv.summary}</p></>}
                {cv.skills && <><div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text3)', marginBottom: 6 }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>{cv.skills.split(',').map((s, i) => <span key={i} style={{ background: 'rgba(98,70,234,0.08)', color: 'var(--accent)', padding: '3px 10px', borderRadius: 100, fontSize: 12, border: '1px solid rgba(98,70,234,0.2)' }}>{s.trim()}</span>)}</div></>}
                {cv.experience && <><div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text3)', marginBottom: 6 }}>Experience</div><pre style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 16, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{cv.experience}</pre></>}
                {cv.education && <><div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text3)', marginBottom: 6 }}>Education</div><p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 16 }}>{cv.education}</p></>}
                {cv.certifications && <><div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text3)', marginBottom: 6 }}>Certifications</div><p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{cv.certifications}</p></>}
              </>
            ) : (
              <div className="empty-state"><div className="icon">📋</div><p>Fill in your details on the left to see your CV preview here.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ====== TOOLS PAGE ======
const ToolsPage = () => (
  <div>
    <ROICalculator />
    <section>
      <DiagnosticSection />
      <CVBuilder />
    </section>
    <Footer />
  </div>
);

export default ToolsPage;
