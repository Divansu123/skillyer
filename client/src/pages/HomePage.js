import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Testimonials,
  CounselSection,
  Footer,
  STATIC_TESTIMONIALS,
} from "../components/common/SharedSections";
import {
  fetchCourses,
  fetchCategories,
  fetchTestimonials,
  createCounselRequest,
} from "../services/api";
import EnrollModal from "../components/common/EnrollModal";

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [testimonials, setTestimonials] = useState(STATIC_TESTIMONIALS);
  const [enrollModal, setEnrollModal] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then((r) => setCategories(r.data.data))
      .catch(() => {});
    fetchCourses({ important: "true", limit: 6 })
      .then((r) => setFeatured(r.data.data))
      .catch(() => {});
    fetchTestimonials()
      .then((r) => {
        if (r.data.data?.length > 0) setTestimonials(r.data.data);
      })
      .catch(() => {});
  }, []);

  const parseTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  };

  const CourseCard = ({ c }) => {
    const prov = c.provider || {};
    const tags = parseTags(c.tags);
    return (
      <div className="course-card">
        <div
          className="course-card-header"
          style={{
            background: `linear-gradient(135deg,${prov.bg || "#f0f2f8"},${prov.bg || "#e8eaf8"}dd)`,
          }}
        >
          {c.emoji}
        </div>
        <div className="course-card-body">
          <div className="provider-row">
            <div
              className="provider-logo"
              style={{ background: prov.bg, color: prov.color }}
            >
              {prov.logo}
            </div>
            <span className="provider-name">{prov.name || c.provId}</span>
          </div>
          <div className="course-title">{c.title}</div>
          <div className="course-meta">
            <div className="meta-item">
              <span className="stars">★</span>
              {c.rating} ({c.students})
            </div>
            <div className="meta-item">⏱ {c.duration}</div>
            <div className="meta-item">📶 {c.level}</div>
            {c.hasCert && <div className="meta-item">🎓 Cert</div>}
          </div>
          <div className="course-tags">
            {tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
            {c.featured && <span className="tag featured">⭐ Featured</span>}
          </div>
          <div className="course-footer">
            <div>
              {c.price === 0 ? (
                <span className="price free">FREE</span>
              ) : (
                <>
                  <span className="price">₹{c.price?.toLocaleString()}</span>
                  <span className="price-orig">
                    ₹{c.origPrice?.toLocaleString()}
                  </span>
                </>
              )}
            </div>
            <button className="btn-enroll" onClick={() => setEnrollModal(c)}>
              Enroll →
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* HERO — exact HTML */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="dot" />
            India's smartest course comparison platform
          </div>
          <h1>
            Learn Smart.
            <br />
            <em>Rise Fast.</em>
          </h1>
          <p>
            SkillYer helps working professionals and graduates discover, compare
            and choose the right courses — powered by real data, built for
            India.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/finder")}>
              🎯 Find My Course
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/explore")}
            >
              🔍 Browse Courses
            </button>
            <button className="btn-orange" onClick={() => navigate("/jobs")}>
              💼 Find Jobs
            </button>
            <button className="btn-green" onClick={() => navigate("/tools")}>
              📋 CV Builder &amp; Tools
            </button>
          </div>
          <div className="hero-stats">
            {[
              ["50+", "Courses Listed"],
              ["15+", "Top Providers"],
              ["/+", "Professionals Helped"],
              ["/+", "Jobs Posted"],
            ].map(([num, label]) => (
              <div key={label} className="stat">
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES — real data from backend */}
      <section>
        <div className="section-tag">Explore Domains</div>
        <div className="section-title">Choose Your SkillYer</div>
        <p className="section-sub">
          From tech to business, creative to leadership — every skill domain
          covered for India's workforce.
        </p>
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => navigate(`/explore?cat=${cat.id}`)}
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.count} courses</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES — real data from backend */}
      <section style={{ paddingTop: 0 }}>
        <div className="section-tag">Editor's Picks</div>
        <div className="section-title">Top Courses Right Now</div>
        <p className="section-sub">
          Handpicked based on learner outcomes, salary impact and employer
          demand.
        </p>
        <div className="courses-grid">
          {featured.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
        {featured.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              className="btn-secondary"
              onClick={() => navigate("/explore")}
            >
              View All Courses →
            </button>
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <Testimonials testimonials={testimonials} />

      {/* COUNSELLING */}
      <CounselSection onSubmit={(data) => createCounselRequest(data)} />

      {/* FOOTER */}
      <Footer />

      {/* ENROLL MODAL */}
      {enrollModal && (
        <EnrollModal
          course={enrollModal}
          onClose={() => setEnrollModal(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
