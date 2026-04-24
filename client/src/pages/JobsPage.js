import React, { useState, useEffect, useCallback } from 'react';
import { Footer, Testimonials, CounselSection, STATIC_TESTIMONIALS } from '../components/common/SharedSections';
import { fetchJobs, createApplication, fetchTestimonials, createCounselRequest } from '../services/api';

const ApplyModal = ({ job, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', qualification: '', experience: '', currentCtc: '', expectedCtc: '', noticePeriod: '', currentOrg: '' });
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setCvError('Only PDF, DOC, DOCX allowed'); setCvFile(null); return; }
    if (file.size > 5 * 1024 * 1024) { setCvError('File size must be under 5MB'); setCvFile(null); return; }
    setCvError('');
    setCvFile(file);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setError('Name and email are required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('message', form.message);
      fd.append('jobId', String(job.id));
      fd.append('qualification', form.qualification);
      fd.append('experience', form.experience);
      fd.append('currentCtc', form.currentCtc);
      fd.append('expectedCtc', form.expectedCtc);
      fd.append('noticePeriod', form.noticePeriod);
      fd.append('currentOrg', form.currentOrg);
      if (cvFile) fd.append('cv', cvFile);
      await createApplication(fd);
      setSuccess(true);
    } catch (e) { setError(e.response?.data?.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = { marginBottom: 0 };
  const sectionHead = (txt) => (
    <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 10, marginTop: 6, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>{txt}</div>
  );

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {success ? (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Application Submitted!</div>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been received. We'll be in touch soon!
            </p>
            <button className="btn-primary" onClick={onClose} style={{ padding: '12px 32px' }}>Done ✓</button>
          </div>
        ) : (
          <>
            {/* Job info strip */}
            <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: job.logoBg || '#6246ea', color: job.logoCo || '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{job.logo || job.company?.slice(0,2).toUpperCase()}</div>
              <div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15 }}>{job.title}</div>
                <div style={{ color: 'var(--text3)', fontSize: 12 }}>{job.company} · {job.location} · {job.salary}</div>
              </div>
            </div>

            <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>📋 Apply for this Role</div>

            {error && <div style={{ color: 'var(--accent2)', fontSize: 13, marginBottom: 14, padding: '8px 12px', background: 'rgba(239,68,68,0.07)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

            {/* Personal Info */}
            {sectionHead('👤 Personal Details')}
            <div className="form-row" style={{ marginBottom: 14 }}>
              <div><label className="form-label">Full Name *</label><input className="form-input" placeholder="Priya Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} /></div>
              <div><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} /></div>
            </div>
            <div className="form-row" style={{ marginBottom: 14 }}>
              <div><label className="form-label">Phone</label><input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} /></div>
              <div><label className="form-label">Qualification</label>
                <select className="form-input" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} style={inputStyle}>
                  <option value="">-- Select --</option>
                  {['10th Pass','12th Pass','Diploma','B.Tech/B.E.','B.Sc','B.Com','B.A','BCA','MCA','M.Tech/M.E.','MBA','M.Sc','Ph.D','Other'].map(q => <option key={q}>{q}</option>)}
                </select>
              </div>
            </div>

            {/* Professional Info */}
            {sectionHead('💼 Professional Details')}
            <div className="form-row" style={{ marginBottom: 14 }}>
              <div><label className="form-label">Current Organisation</label><input className="form-input" placeholder="e.g. Infosys, TCS, Startup" value={form.currentOrg} onChange={e => setForm({ ...form, currentOrg: e.target.value })} style={inputStyle} /></div>
              <div><label className="form-label">Experience</label>
                <select className="form-input" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} style={inputStyle}>
                  <option value="">-- Select --</option>
                  {['Fresher (0 yr)','Less than 1 yr','1 year','2 years','3 years','4 years','5 years','6-8 years','9-12 years','12+ years'].map(x => <option key={x}>{x}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: 14 }}>
              <div><label className="form-label">Current CTC</label><input className="form-input" placeholder="e.g. 6 LPA, 8.5 LPA" value={form.currentCtc} onChange={e => setForm({ ...form, currentCtc: e.target.value })} style={inputStyle} /></div>
              <div><label className="form-label">Expected CTC</label><input className="form-input" placeholder="e.g. 10 LPA, 14 LPA" value={form.expectedCtc} onChange={e => setForm({ ...form, expectedCtc: e.target.value })} style={inputStyle} /></div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Notice Period</label>
              <select className="form-input" value={form.noticePeriod} onChange={e => setForm({ ...form, noticePeriod: e.target.value })} style={inputStyle}>
                <option value="">-- Select --</option>
                {['Immediate','15 days','30 days','45 days','60 days','90 days','More than 90 days'].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>

            {/* Cover Note */}
            {sectionHead('📝 Cover Note')}
            <textarea className="form-input" rows={3} placeholder="Briefly tell us about your experience and why you're a great fit..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: 'vertical', marginBottom: 14 }} />

            {/* CV Upload */}
            {sectionHead('📎 Resume / CV')}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10,
              border: `2px dashed ${cvFile ? 'var(--accent)' : 'var(--border)'}`,
              background: cvFile ? 'rgba(98,70,234,0.04)' : 'var(--surface)',
              cursor: 'pointer', marginBottom: 4, transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 22 }}>{cvFile ? '📄' : '☁️'}</span>
              <div style={{ flex: 1 }}>
                {cvFile ? (
                  <><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{cvFile.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{(cvFile.size / 1024).toFixed(1)} KB</div></>
                ) : (
                  <><div style={{ fontSize: 13, fontWeight: 500 }}>Click to upload your resume</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Supported: PDF, DOC, DOCX — max 5MB</div></>
                )}
              </div>
              {cvFile && <button type="button" onClick={e => { e.preventDefault(); setCvFile(null); }} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16 }}>✕</button>}
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} style={{ display: 'none' }} />
            </label>
            {cvError && <div style={{ color: 'var(--accent2)', fontSize: 12, marginBottom: 10 }}>{cvError}</div>}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2 }}>
                {loading ? '⏳ Submitting...' : '🚀 Submit Application'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [testimonials, setTestimonials] = useState(STATIC_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [applyJob, setApplyJob] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ cat: '', expLevel: '', jobType: '' });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const LIMIT = 12;

  useEffect(() => {
    fetchTestimonials().then(r => { if (r.data.data && r.data.data.length > 0) setTestimonials(r.data.data); }).catch(() => {});
  }, []);

  const loadJobs = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, limit: LIMIT, page: p };
      if (search) params.search = search;
      Object.keys(params).forEach(k => params[k] === '' && delete params[k]);
      const res = await fetchJobs(params);
      setJobs(res.data.data);
      setTotal(res.data.total);
      setPage(res.data.page || p);
      setPages(res.data.pages || 1);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters, search]);

  useEffect(() => { loadJobs(1); }, [filters, search]);

  const PaginationBar = () => {
    if (pages <= 1) return null;
    return (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', margin: '24px 0', flexWrap: 'wrap' }}>
        <button onClick={() => loadJobs(page - 1)} disabled={page <= 1}
          style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: page <= 1 ? 'var(--bg2)' : 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>← Prev</button>
        {Array.from({ length: pages }, (_, i) => i + 1).filter(p => p === 1 || p === pages || Math.abs(p - page) <= 2).map((p, i, arr) => (
          <React.Fragment key={p}>
            {i > 0 && arr[i - 1] !== p - 1 && <span style={{ color: 'var(--text3)' }}>…</span>}
            <button onClick={() => loadJobs(p)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: p === page ? 'var(--accent)' : 'white', color: p === page ? 'white' : 'var(--text)', cursor: 'pointer', fontWeight: p === page ? 700 : 400 }}>{p}</button>
          </React.Fragment>
        ))}
        <button onClick={() => loadJobs(page + 1)} disabled={page >= pages}
          style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: page >= pages ? 'var(--bg2)' : 'white', cursor: page >= pages ? 'not-allowed' : 'pointer' }}>Next →</button>
      </div>
    );
  };

  const getTypeLabel = (type) => ({ fulltime: '🏢 Full-Time', remote: '🌐 Remote', hybrid: '🔀 Hybrid' }[type] || type);

  return (
    <div>
      <section  style={{ paddingTop: 90 }}>
        <div className="jobs-hero-banner">
          <div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 800, marginBottom: 6 }}>💼 Find Your Next Opportunity</h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 400, lineHeight: 1.6 }}>Browse curated openings from top companies. Apply directly with your CV.</p>
          </div>
        </div>

        {/* Filters Row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <div style={{ flex: 1, maxWidth: 280, background: 'white', border: '1.5px solid var(--border)', borderRadius: 11, padding: '5px 7px 5px 14px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span>🔍</span>
            <input type="text" placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }} />
          </div>
          {[
            { key: 'cat', label: 'All Categories', opts: [['', 'All Categories'], ['tech', 'Technology'], ['data', 'Data & AI'], ['design', 'Design'], ['marketing', 'Marketing'], ['finance', 'Finance'], ['product', 'Product'], ['leadership', 'Leadership']] },
            { key: 'expLevel', label: 'All Experience', opts: [['', 'All Experience'], ['fresher', 'Fresher'], ['junior', 'Junior (1-3yr)'], ['mid', 'Mid-Level (3-7yr)'], ['senior', 'Senior (7+yr)']] },
            { key: 'jobType', label: 'All Types', opts: [['', 'All Types'], ['fulltime', 'Full-Time'], ['remote', 'Remote'], ['hybrid', 'Hybrid']] },
          ].map(f => (
            <select key={f.key} value={filters[f.key]} onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
              style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 9, padding: '8px 12px', color: 'var(--text2)', fontSize: 12, fontFamily: 'DM Sans,sans-serif', outline: 'none', cursor: 'pointer' }}>
              {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>{!loading && `${total} jobs found`}</div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : jobs.length === 0 ? (
          <div className="empty-state"><div className="icon">💼</div><p>No jobs found. Try different filters.</p></div>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => {
              const tags = Array.isArray(job.tags) ? job.tags : JSON.parse(job.tags || '[]');
              return (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div className="job-logo" style={{ background: job.logoBg, color: job.logoCo }}>{job.logo}</div>
                    <div style={{ flex: 1 }}>
                      <div className="job-title">{job.title}</div>
                      <div className="job-company">{job.company}</div>
                    </div>
                    {job.badge && (
                      <span className={`job-badge ${job.badgeType}`}>{job.badge}</span>
                    )}
                  </div>
                  <div className="job-meta">
                    <div className="job-meta-item">📍 {job.location}</div>
                    <div className="job-meta-item">{getTypeLabel(job.jobType)}</div>
                    <div className="job-meta-item">🕒 {job.postedAt}</div>
                  </div>
                  <div className="job-tags">
                    {tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
                  </div>
                  <div className="job-footer">
                    <div className="job-salary">{job.salary}</div>
                    <button className="btn-apply" onClick={() => setApplyJob(job)}>Apply →</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <PaginationBar />
      </section>

      <Testimonials testimonials={testimonials} />
      <CounselSection onSubmit={(data) => createCounselRequest(data)} />
      <Footer />
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
};

export default JobsPage;
