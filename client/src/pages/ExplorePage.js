import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Footer, Testimonials, CounselSection, STATIC_TESTIMONIALS } from '../components/common/SharedSections';
import { fetchCourses, fetchCategories, fetchTestimonials, createCounselRequest } from '../services/api';
import EnrollModal from '../components/common/EnrollModal';

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState(STATIC_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ cat: searchParams.get('cat') || 'All', level: 'All', price: 'All' });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const LIMIT = 12;

  useEffect(() => {
    fetchCategories().then(r => setCategories(r.data.data)).catch(() => {});
    fetchTestimonials().then(r => { if (r.data.data?.length > 0) setTestimonials(r.data.data); }).catch(() => {});
  }, []);

  const loadCourses = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, page: p };
      if (filters.cat !== 'All') params.cat = filters.cat;
      if (filters.level !== 'All') params.level = filters.level;
      if (filters.price !== 'All') params.price = filters.price;
      if (search) params.search = search;
      const res = await fetchCourses(params);
      setCourses(res.data.data);
      setTotal(res.data.total || res.data.data.length);
      setPage(res.data.page || p);
      setPages(res.data.pages || 1);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters, search]);

  useEffect(() => { loadCourses(1); setPage(1); }, [filters, search]);

  const setFilter = (key, val) => { setFilters(f => ({ ...f, [key]: val })); setPage(1); };

  const PaginationBar = () => {
    if (pages <= 1) return null;
    return (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 32, flexWrap: 'wrap' }}>
        <button onClick={() => loadCourses(page - 1)} disabled={page <= 1}
          style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: page <= 1 ? 'var(--bg2)' : 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer', fontSize: 14 }}>← Prev</button>
        {Array.from({ length: pages }, (_, i) => i + 1).filter(p => p === 1 || p === pages || Math.abs(p - page) <= 2).map((p, i, arr) => (
          <React.Fragment key={p}>
            {i > 0 && arr[i - 1] !== p - 1 && <span style={{ color: 'var(--text3)' }}>…</span>}
            <button onClick={() => loadCourses(p)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: p === page ? 'var(--accent)' : 'white', color: p === page ? 'white' : 'var(--text)', cursor: 'pointer', fontWeight: p === page ? 700 : 400 }}>{p}</button>
          </React.Fragment>
        ))}
        <button onClick={() => loadCourses(page + 1)} disabled={page >= pages}
          style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: page >= pages ? 'var(--bg2)' : 'white', cursor: page >= pages ? 'not-allowed' : 'pointer', fontSize: 14 }}>Next →</button>
      </div>
    );
  };

  const parseTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    try { return JSON.parse(tags); } catch { return []; }
  };

  return (
    <div>
      <section style={{ paddingTop: 90 }}>
        <div className="section-tag">Explore</div>
        <div className="section-title">All Courses</div>

        <div className="search-wrap">
          <span>🔍</span>
          <input type="text" placeholder="Search courses, skills, providers..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadCourses()} />
          <button className="search-btn" onClick={loadCourses}>Search</button>
        </div>

        <div className="filters-row" id="filtersRow">
          <span className="filter-label">Category:</span>
          <span className={`filter-chip${filters.cat === 'All' ? ' active' : ''}`} onClick={() => setFilter('cat', 'All')}>All</span>
          {categories.map(c => (
            <span key={c.id} className={`filter-chip${filters.cat === c.id ? ' active' : ''}`} onClick={() => setFilter('cat', c.id)}>
              {c.icon} {c.name}
            </span>
          ))}
        </div>

        <div className="filters-row" id="levelFilters">
          <span className="filter-label">Level:</span>
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(l => (
            <span key={l} className={`filter-chip${filters.level === l ? ' active' : ''}`} onClick={() => setFilter('level', l)}>{l}</span>
          ))}
        </div>

        <div className="filters-row" id="priceFilters">
          <span className="filter-label">Price:</span>
          {['All', 'Free', 'Paid'].map(p => (
            <span key={p} className={`filter-chip${filters.price === p ? ' active' : ''}`} onClick={() => setFilter('price', p)}>{p === 'All' ? 'Any' : p}</span>
          ))}
        </div>

        <div id="resultsCount" style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)' }}>
          {!loading && `Showing ${courses.length} of ${total} courses`}
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text3)', fontSize: 14 }}>No courses found.</div>
        ) : (
          <div className="courses-grid">
            {courses.map(c => {
              const prov = c.provider || {};
              const tags = parseTags(c.tags);
              return (
                <div key={c.id} className="course-card">
                  <div className="course-card-header" style={{ background: `linear-gradient(135deg,${prov.bg || '#f0f2f8'},${prov.bg || '#e8eaf8'}dd)` }}>
                    {c.emoji}
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
                          : <><span className="price">₹{c.price?.toLocaleString()}</span><span className="price-orig">₹{c.origPrice?.toLocaleString()}</span></>}
                      </div>
                      <button className="btn-enroll" onClick={() => setEnrollCourse(c)}>Enroll →</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <PaginationBar />
      </section>

      <Testimonials testimonials={testimonials} />
      <CounselSection onSubmit={data => createCounselRequest(data)} />
      <Footer />

      {enrollCourse && (
        <EnrollModal course={enrollCourse} onClose={() => setEnrollCourse(null)} />
      )}
    </div>
  );
};

export default ExplorePage;
