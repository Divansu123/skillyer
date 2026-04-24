import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/common/CourseCard';
import EnrollModal from '../components/common/EnrollModal';
import { Footer } from '../components/common/SharedSections';
import { fetchCourses } from '../services/api';

const QUESTIONS = [
  {
    q: 'What field do you want to learn?',
    sub: 'Choose the domain that excites you most.',
    key: 'field',
    opts: [
      { label: '💻 Technology', val: 'tech' },
      { label: '🧠 Data & AI', val: 'data' },
      { label: '🎨 Design', val: 'design' },
      { label: '📣 Marketing', val: 'marketing' },
      { label: '💰 Finance', val: 'finance' },
      { label: '📦 Product Management', val: 'product' },
      { label: '🏆 Leadership', val: 'leadership' },
      { label: '☁️ Cloud & DevOps', val: 'cloud' },
    ],
  },
  {
    q: 'What\'s your experience level?',
    sub: 'Be honest — we\'ll find the right course for where you are.',
    key: 'level',
    opts: [
      { label: '🌱 Complete Beginner', val: 'Beginner' },
      { label: '📈 Some Experience', val: 'Intermediate' },
      { label: '🚀 Advanced / Expert', val: 'Advanced' },
    ],
  },
  {
    q: 'What\'s your goal?',
    sub: 'Tell us what you want to achieve.',
    key: 'goal',
    opts: [
      { label: '💼 Get a new job', val: 'job' },
      { label: '💰 Get a salary hike', val: 'hike' },
      { label: '🔄 Switch careers', val: 'switch' },
      { label: '📚 Learn for fun/growth', val: 'growth' },
      { label: '🚀 Start a business', val: 'business' },
    ],
  },
  {
    q: 'What\'s your budget?',
    sub: 'We have great options at every price point.',
    key: 'price',
    opts: [
      { label: '🆓 Free only', val: 'Free' },
      { label: '💸 Under ₹1,000', val: 'budget' },
      { label: '💳 ₹1,000 – ₹10,000', val: 'mid' },
      { label: '🎓 Any — quality matters', val: 'any' },
    ],
  },
  {
    q: 'How much time can you commit?',
    sub: 'This helps us find the right course length.',
    key: 'time',
    opts: [
      { label: '⚡ 1-5 hrs/week', val: 'low' },
      { label: '🕐 5-10 hrs/week', val: 'mid' },
      { label: '🔥 10+ hrs/week', val: 'high' },
    ],
  },
];

const FinderPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [enrollCourse, setEnrollCourse] = useState(null);

  const handleSelect = async (key, val) => {
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Show results
      setLoading(true);
      try {
        const params = { limit: 6 };
        if (newAnswers.field) params.cat = newAnswers.field;
        if (newAnswers.level) params.level = newAnswers.level;
        if (newAnswers.price === 'Free') params.price = 'Free';
        const res = await fetchCourses(params);
        setResults(res.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); setDone(true); }
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setResults([]); setDone(false); };

  const progress = ((step) / QUESTIONS.length) * 100;
  const q = QUESTIONS[step];

  // Match score (mock based on filters)
  const getMatch = (course) => {
    let score = 70;
    if (answers.field && course.catId === answers.field) score += 15;
    if (answers.level && course.level === answers.level) score += 10;
    if (answers.price === 'Free' && course.price === 0) score += 5;
    return Math.min(score, 99);
  };

  return (
    <div>
      <div className="quiz-wrap">
        {!done ? (
          <>
            <div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="progress-label">Step {step + 1} of {QUESTIONS.length}</div>
            </div>

            <div className="quiz-q">{q.q}</div>
            <div className="quiz-sub">{q.sub}</div>

            <div className="quiz-options">
              {q.opts.map(opt => (
                <button key={opt.val} className="quiz-opt" onClick={() => handleSelect(q.key, opt.val)}>
                  {opt.label}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ marginTop: 20, background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 13 }}>
                ← Back
              </button>
            )}
          </>
        ) : (
          <div>
            <div style={{ marginBottom: 28 }}>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: '100%' }} />
              </div>
              <div className="progress-label">✅ Complete!</div>
            </div>

            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, marginBottom: 8 }}>
              🎯 Your Personalized Matches
            </div>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 28 }}>
              Based on your answers, here are the courses we recommend for you.
            </p>

            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : (
              <div className="courses-grid">
                {results.map(c => (
                  <div key={c.id} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', top: -10, left: 12, zIndex: 10,
                      background: 'var(--accent)', color: 'white', borderRadius: 100,
                      padding: '3px 10px', fontSize: 11, fontWeight: 700
                    }}>
                      {getMatch(c)}% Match
                    </div>
                    <CourseCard course={c} onEnroll={setEnrollCourse} />
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={reset}>🔄 Retake Quiz</button>
              <button className="btn-primary" onClick={() => navigate('/explore')}>Browse All Courses →</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
      {enrollCourse && <EnrollModal course={enrollCourse} onClose={() => setEnrollCourse(null)} />}
    </div>
  );
};

export default FinderPage;
