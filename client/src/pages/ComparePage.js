import React, { useState, useEffect, useContext } from 'react';
import { CompareContext } from '../App';
import CourseCard from '../components/common/CourseCard';
import EnrollModal from '../components/common/EnrollModal';
import { Footer } from '../components/common/SharedSections';
import { fetchCourses } from '../services/api';

const ROWS = [
  { label: 'Provider', key: 'provider', render: c => c.provider?.name || c.provId },
  { label: 'Level', key: 'level', render: c => c.level },
  { label: 'Duration', key: 'duration', render: c => c.duration },
  { label: 'Rating', key: 'rating', render: c => `${c.rating} ★`, compare: 'max' },
  { label: 'Students', key: 'students', render: c => c.students },
  { label: 'Price', key: 'price', render: c => c.price === 0 ? 'FREE' : `₹${c.price?.toLocaleString()}`, compare: 'min' },
  { label: 'Certificate', key: 'hasCert', render: c => c.hasCert ? '✅ Yes' : '❌ No' },
  { label: 'Category', key: 'category', render: c => c.category?.name || c.catId },
];

const ComparePage = () => {
  const { compareList, toggleCompare, clearCompare } = useContext(CompareContext);
  const [allCourses, setAllCourses] = useState([]);
  const [enrollCourse, setEnrollCourse] = useState(null);

  useEffect(() => {
    fetchCourses({ limit: 50 }).then(r => setAllCourses(r.data.data)).catch(() => {});
  }, []);

  const isWinner = (row, course) => {
    if (!row.compare || compareList.length < 2) return false;
    const vals = compareList.map(c => Number(c[row.key]));
    const target = Number(course[row.key]);
    if (row.compare === 'max') return target === Math.max(...vals);
    if (row.compare === 'min') return target === Math.min(...vals);
    return false;
  };

  return (
    <div>
      <section style={{ paddingTop: 90 }}>
        <div className="section-tag">Compare Courses</div>
        <div className="section-title">Find Your Best Match</div>
        <p className="section-sub">Select up to 3 courses and compare price, duration, rating — winners highlighted automatically.</p>

        {compareList.length >= 2 && (
          <div className="compare-layout">
            {/* Sidebar */}
            <div className="compare-sidebar">
              <div className="compare-sidebar-row" style={{ minHeight: 160, background: 'var(--surface2)', fontSize: 11, color: 'var(--text2)', fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>
                Course Details
              </div>
              {ROWS.map(row => (
                <div key={row.key} className="compare-sidebar-row">{row.label}</div>
              ))}
              <div className="compare-sidebar-row">Action</div>
            </div>

            {/* Columns */}
            <div className="compare-cols">
              {compareList.map(course => (
                <div key={course.id} className="compare-col">
                  {/* Header */}
                  <div style={{ padding: 16, borderBottom: '2px solid var(--border)', minHeight: 160, background: 'var(--surface2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 36 }}>{course.emoji}</div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', lineHeight: 1.3 }}>{course.title}</div>
                    <button onClick={() => toggleCompare(course)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 9px', fontSize: 11, cursor: 'pointer', color: 'var(--text3)' }}>✕ Remove</button>
                  </div>
                  {ROWS.map(row => (
                    <div key={row.key} className={`compare-col-row${isWinner(row, course) ? ' winner' : ''}`}>
                      {isWinner(row, course) && <span style={{ marginRight: 4 }}>🏆</span>}
                      {row.render(course)}
                    </div>
                  ))}
                  <div className="compare-col-row">
                    <button className="btn-enroll" onClick={() => setEnrollCourse(course)} style={{ width: '100%' }}>Enroll →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {compareList.length < 2 && (
          <div className="empty-state" style={{ marginTop: 32 }}>
            <div className="icon">⚖️</div>
            <p>Select at least 2 courses from below to compare them side by side.</p>
          </div>
        )}

        {compareList.length > 0 && (
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <button className="btn-secondary btn-sm" onClick={clearCompare}>Clear All</button>
          </div>
        )}

        {/* Pick Courses Grid */}
        <div style={{ marginTop: 48 }}>
          <div className="section-tag">Pick Courses to Compare</div>
          <div className="courses-grid" style={{ marginTop: 16 }}>
            {allCourses.map(c => <CourseCard key={c.id} course={c} onEnroll={setEnrollCourse} />)}
          </div>
        </div>
      </section>

      <Footer />
      {enrollCourse && <EnrollModal course={enrollCourse} onClose={() => setEnrollCourse(null)} />}
    </div>
  );
};

export default ComparePage;
