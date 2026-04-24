import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompareContext } from '../../App';

const CompareBar = () => {
  const { compareList, toggleCompare, clearCompare } = useContext(CompareContext);
  const navigate = useNavigate();

  if (!compareList || compareList.length === 0) return null;

  return (
    <div className="compare-bar visible" id="compareBar">
      <div style={{ fontSize: 12, color: 'var(--text2)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        ⚖ (<span id="compareCount">{compareList.length}</span>/3)
      </div>
      <div className="compare-slots" id="compareSlots">
        {[0, 1, 2].map(i => {
          const c = compareList[i];
          return (
            <div key={i} className={`compare-slot${c ? ' filled' : ''}`}>
              {c ? (
                <>
                  <span style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.emoji} {c.title}
                  </span>
                  <button className="remove-slot" onClick={() => toggleCompare(c)}>×</button>
                </>
              ) : <span>+ Add</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 7 }}>
        <button className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={clearCompare}>Clear</button>
        <button className="btn-primary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => navigate('/compare')}>Compare →</button>
      </div>
    </div>
  );
};

export default CompareBar;
