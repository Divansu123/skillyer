import React, { useContext } from 'react';
import { CompareContext } from '../../App';

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  try { return JSON.parse(tags); } catch { return []; }
};

const CourseCard = ({ course: c, onEnroll }) => {
  const { compareList, toggleCompare } = useContext(CompareContext);
  const prov = c.provider || {};
  const tags = parseTags(c.tags);
  const isCompared = compareList?.some(x => x.id === c.id);

  return (
    <div className="course-card" id={`card-${c.id}`}>
      <div className="course-card-header" style={{ background: `linear-gradient(135deg,${prov.bg || '#f0f2f8'},${prov.bg || '#e8eaf8'}dd)` }}>
        {c.emoji}
        <div
          className={`compare-check${isCompared ? ' checked' : ''}`}
          onClick={() => toggleCompare && toggleCompare(c)}
        >
          {isCompared ? '✓' : '+'}
        </div>
      </div>
      <div className="course-card-body">
        <div className="provider-row">
          <div className="provider-logo" style={{ background: prov.bg, color: prov.color }}>{prov.logo}</div>
          <span className="provider-name">{prov.name || c.provId}</span>
        </div>
        <div className="course-title">{c.title}</div>
        <div className="course-meta">
          <div className="meta-item"><span className="stars">★</span>{c.rating} ({c.students})</div>
          <div className="meta-item">⏱ {c.duration}</div>
          <div className="meta-item">📶 {c.level}</div>
          {c.hasCert && <div className="meta-item">🎓 Cert</div>}
        </div>
        <div className="course-tags">
          {tags.map(t => <span key={t} className="tag">{t}</span>)}
          {c.featured && <span className="tag featured">⭐ Featured</span>}
        </div>
        <div className="course-footer">
          <div>
            {c.price === 0
              ? <span className="price free">FREE</span>
              : <><span className="price">₹{c.price?.toLocaleString()}</span><span className="price-orig">₹{c.origPrice?.toLocaleString()}</span></>
            }
          </div>
          <button className="btn-enroll" onClick={() => onEnroll && onEnroll(c)}>Enroll →</button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
