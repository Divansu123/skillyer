import React from "react";
import { useState } from "react";

export const STATIC_TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Data Analyst to Senior Data Scientist",
    company: "Razorpay",
    avatar: "PS",
    avatarBg: "#6246ea",
    avatarCo: "#fff",
    course: "Machine Learning Specialization",
    text: "SkillYer helped me compare 6 different ML courses in minutes. I picked the Coursera specialization and within 8 months landed a 2x salary hike at Razorpay. The side-by-side comparison is a game changer!",
    rating: 5,
  },
  {
    id: 2,
    name: "Arjun Mehta",
    role: "Fresher to Frontend Engineer",
    company: "Swiggy",
    avatar: "AM",
    avatarBg: "#ff6b35",
    avatarCo: "#fff",
    course: "Web Developer Bootcamp",
    text: "As a fresh B.Tech grad I was lost. The Find My Course quiz understood my background and budget perfectly. Followed the recommendation, built 5 projects, and got placed in 3 months!",
    rating: 5,
  },
  {
    id: 3,
    name: "Sneha Kulkarni",
    role: "Marketing Executive to Manager",
    company: "Nykaa",
    avatar: "SK",
    avatarBg: "#FF4F81",
    avatarCo: "#fff",
    course: "Digital Marketing Masterclass",
    text: "I compared 4 digital marketing courses before choosing. The price vs rating comparison showed me Udemy had the best value. My team performance improved 40% after applying what I learned.",
    rating: 5,
  },
  {
    id: 4,
    name: "Rahul Gupta",
    role: "CA to FinTech Product Manager",
    company: "CRED",
    avatar: "RG",
    avatarBg: "#10b981",
    avatarCo: "#fff",
    course: "Product Management Fundamentals",
    text: "Switched careers from CA to PM using SkillYer. The quiz recommended exactly the right courses for my background. Used the jobs section to find my current role too!",
    rating: 5,
  },
  {
    id: 5,
    name: "Divya Nair",
    role: "UX Researcher to Lead Designer",
    company: "PhonePe",
    avatar: "DN",
    avatarBg: "#5F259F",
    avatarCo: "#fff",
    course: "UX Design Professional Certificate",
    text: "The Google UX certificate on Coursera was recommended by the quiz. The ROI calculator showed me exactly what my salary lift would be — and it was accurate! Now at PhonePe.",
    rating: 5,
  },
  {
    id: 6,
    name: "Karan Singh",
    role: "IT Support to Cloud Architect",
    company: "Infosys",
    avatar: "KS",
    avatarBg: "#0057A8",
    avatarCo: "#fff",
    course: "AWS Cloud Practitioner Essentials",
    text: "Started with the free AWS course SkillYer recommended. Three certifications later, my salary tripled. The structured learning path guidance is what sets SkillYer apart from other platforms.",
    rating: 5,
  },
];

// Testimonials — exact HTML design (purple gradient bg, horizontal scroll cards)
export const Testimonials = ({ testimonials }) => {
  const data =
    testimonials && testimonials.length > 0
      ? testimonials
      : STATIC_TESTIMONIALS;
  return (
    <div className="testi-section">
      <div className="testi-inner">
        <div className="testi-header">
          <div>
            <div className="testi-tag">Success Stories</div>
            <div className="testi-title">What Learners Say</div>
            <div className="testi-sub">
              Real stories from professionals who upskilled and levelled up.
            </div>
          </div>
        </div>
        <div className="testi-track">
          {data.map((t) => (
            <div key={t.id} className="testi-card">
              <div className="testi-card-accent" />
              <div className="testi-stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <div className="testi-text">{t.text}</div>
              <div className="testi-author">
                <div
                  className="testi-avatar"
                  style={{ background: t.avatarBg, color: t.avatarCo }}
                >
                  {t.avatar}
                </div>
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
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    field: "Technology",
    expLevel: "Fresher / Student",
    message: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setError("Name and email are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
      setSuccess(true);
    } catch (e) {
      setError(
        e?.response?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="counsel-section">
      <div className="counsel-inner">
        <div className="testi-tag">Free Session</div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(22px,4vw,36px)",
            fontWeight: 800,
            color: "white",
            marginBottom: 10,
            marginTop: 8,
          }}
        >
          Career Counselling
        </div>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Not sure which path to take? Book a free 30-min session with our
          career advisors.
        </p>
        <div className="counsel-card">
          {success ? (
            <div style={{ textAlign: "center", padding: "32px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div
                style={{
                  color: "white",
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 18,
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                Session Booked!
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                Our career advisor will reach out within 24 hours to confirm
                your session. Check your email!
              </p>
            </div>
          ) : (
            <div className="counsel-form">
              {error && (
                <div
                  style={{
                    color: "#fca5a5",
                    fontSize: 12,
                    marginBottom: 10,
                    padding: "8px 12px",
                    background: "rgba(239,68,68,0.15)",
                    borderRadius: 8,
                  }}
                >
                  {error}
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label className="counsel-label">Full Name *</label>
                  <input
                    className="counsel-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="counsel-label">Email *</label>
                  <input
                    className="counsel-input"
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="counsel-label">Phone</label>
                  <input
                    className="counsel-input"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="counsel-label">Current Role</label>
                  <input
                    className="counsel-input"
                    placeholder="e.g. Software Engineer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>
              </div>
              <label className="counsel-label" style={{ marginTop: 4 }}>
                Field of Interest *
              </label>
              <select
                className="counsel-select"
                value={form.field}
                onChange={(e) => setForm({ ...form, field: e.target.value })}
              >
                {[
                  "Technology",
                  "Data & AI",
                  "Design",
                  "Marketing",
                  "Finance",
                  "Product Management",
                  "Leadership",
                  "Not sure yet",
                ].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
              <label className="counsel-label">Experience Level</label>
              <select
                className="counsel-select"
                value={form.expLevel}
                onChange={(e) => setForm({ ...form, expLevel: e.target.value })}
              >
                {[
                  "Fresher / Student",
                  "1-3 years",
                  "3-7 years",
                  "7+ years",
                ].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <label className="counsel-label">Your Question / Goal</label>
              <textarea
                className="counsel-input"
                rows={3}
                placeholder="Tell us what you want to achieve or any specific questions..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ resize: "vertical", minHeight: 75 }}
              />
              <button
                className="counsel-submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Free Session →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Popup Content ───────────────────────────────────────────────────────────

const POPUP_CONTENT = {
  Terms: {
    title: "Terms & Conditions",
    emoji: "📋",
    sections: [
      {
        heading: "Overview",
        body: "These Terms & Conditions apply to the usage of the Platform and services offered by Skillyer. By using the platform, you agree to these terms. If you do not agree, please do not use the platform.",
      },
      {
        heading: "1. Services",
        body: "Skillyer does not provide direct courses. We work with associated training partners. All course delivery, certification, and related services are the responsibility of the respective providers.",
      },
      {
        heading: "2. Certification & Course Responsibility",
        body: "After course completion, any certificate-related queries must be directly addressed to the course provider. Skillyer is not responsible for issuing certificates.",
      },
      {
        heading: "3. User Data & Privacy",
        body: "We may use your personal data for communication, marketing, and internal purposes. You agree that we may share your data with our partner providers to deliver services.",
      },
      {
        heading: "4. Fees & Refund Policy",
        body: "All fees are non-refundable unless Skillyer is unable to provide the service.",
      },
      {
        heading: "5. Pricing & Course Changes",
        body: "Prices, courses, and offerings are subject to change at any time without prior notice.",
      },
      {
        heading: "6. Affiliation Disclaimer",
        body: "Skillyer is not affiliated with any university or UGC-approved institution.",
      },
      {
        heading: "7. User Responsibilities",
        body: "Users must provide accurate information and maintain account confidentiality. Any misuse may result in termination.",
      },
      {
        heading: "8. Termination",
        body: "Skillyer reserves the right to terminate services without prior notice in case of misconduct or violation of terms.",
      },
      {
        heading: "9. Intellectual Property",
        body: "All content on the platform is owned by Skillyer or its partners and is protected by applicable laws.",
      },
      {
        heading: "10. Contact",
        body: "For any queries, contact: hello@skillyer.com",
      },
    ],
  },
  Privacy: {
    title: "Privacy Policy",
    emoji: "🔐",
    sections: [
      {
        heading: "1. Introduction",
        body: "This Privacy Policy outlines how Skillyer, owned and operated by TruHire AI Pvt. Ltd., collects, uses, stores, and protects your personal information. By accessing our platform, you agree to the terms of this Privacy Policy.",
      },
      {
        heading: "2. Ownership",
        body: "Skillyer is a product and property of TruHire AI Pvt. Ltd. All rights, ownership, and control of the platform remain with the company.",
      },
      {
        heading: "3. Information We Collect",
        body: "Personal Info: Name, email, contact number, address, profile photo, IP address, location, ID proofs.\n\nUsage Data: Device details, browser info, IP logs, cookies, website/app activity.\n\nPayment Info: Processed via secure gateways. We do NOT store card details.",
      },
      {
        heading: "4. How We Use Your Information",
        body: "We use your data to provide and improve services, personalize learning, communicate updates and marketing, share details with course providers, and ensure security. You agree that Skillyer may use your data for communication, marketing, and internal purposes.",
      },
      {
        heading: "5. Third-Party Services",
        body: "Skillyer works with external course providers and service partners. We are not responsible for their policies, content, or data practices.",
      },
      {
        heading: "6. Data Security",
        body: "We take reasonable measures including encryption & firewalls, secure servers, and restricted data access. However, no system is 100% secure.",
      },
      {
        heading: "7. Community & Public Spaces",
        body: "Any information shared in forums/groups may be visible to others. Users are advised to share information cautiously.",
      },
      {
        heading: "8. Data Retention",
        body: "We retain your data only as long as required for service delivery, legal compliance, and business operations.",
      },
      {
        heading: "9. Policy Updates",
        body: "We may update this policy at any time without prior notice. Continued use of the platform implies acceptance of changes.",
      },
      {
        heading: "⚖️ Legal & Dispute Policy",
        body: "Any dispute shall be subject to jurisdiction of Gurgaon, Haryana only. Place of Arbitration: Gurgaon, Haryana. Skillyer is not affiliated with any university or UGC-approved institution.",
      },
    ],
  },
  Contact: {
    title: "Contact Us",
    emoji: "📩",
    sections: [
      {
        heading: "General Queries",
        body: "📧 hello@skillyer.com /📞 8744055990 / 8744055914 / 7082279426",
      },
      {
        heading: "🚨 Escalation Policy (3-Step Resolution)",
        body: "",
      },
      {
        heading: "Step 1 — Basic Support",
        body: "📧 hello@skillyer.com\n⏱ Response Time: Within 48 Hours",
      },
      {
        heading: "Step 2 — HR Escalation",
        body: "📧 hr@skillyer.com\n📞 7082279426\n⏱ Response Time: Within 72 Hours",
      },
      {
        heading: "Step 3 — Founder's Desk (Final)",
        body: "📞 8744055990 / 8744055914\n⏱ Response Time: Within 72 Hours\n\n👉 All escalations must follow the above 3-step process sequentially.",
      },
    ],
  },
  About: {
    title: "About Skillyer",
    emoji: "🎯",
    sections: [
      {
        heading: "Who We Are",
        body: "Skillyer is a next-generation skill-building platform owned and operated by TruHire AI Pvt. Ltd. We connect India's workforce with the right training partners to upskill, grow, and thrive.",
      },
      {
        heading: "Our Mission",
        body: "To make quality skill development accessible, affordable, and outcome-driven for every professional in India.",
      },
      {
        heading: "Our Model",
        body: "We don't deliver courses directly — we partner with top training providers and curate the best programs so you get certified, job-ready skills without the noise.",
      },
      {
        heading: "Made for India",
        body: "Built with ❤️ for India's workforce, Skillyer understands the unique challenges and aspirations of the Indian professional landscape.",
      },
    ],
  },
  Blog: {
    title: "Skillyer Blog",
    emoji: "✍️",
    sections: [
      {
        heading: "Coming Soon",
        body: "Our blog is being crafted with insights on career growth, skill trends, industry updates, and success stories from India's workforce. Stay tuned!",
      },
      {
        heading: "Topics We'll Cover",
        body: "Career development tips, in-demand skills for 2026, partner success stories, upskilling guides, and industry trends.",
      },
      {
        heading: "Stay Updated",
        body: "Follow us or drop your email at hello@skillyer.com to get notified when we launch.",
      },
    ],
  },
  Careers: {
    title: "Careers at Skillyer",
    emoji: "🚀",
    sections: [
      {
        heading: "Join Our Team",
        body: "We're building the future of skill-based hiring and learning in India. If you're passionate about education, technology, and impact — we'd love to hear from you.",
      },
      {
        heading: "What We Look For",
        body: "Curious minds, ownership mentality, and people who want to make a real difference in how India learns and grows professionally.",
      },
      {
        heading: "Open Roles",
        body: "We're a growing team and opportunities keep opening up. Reach out to us directly at hello@skillyer.com with the subject line 'Careers – [Your Role]'.",
      },
      {
        heading: "Culture",
        body: "Remote-friendly, fast-paced, and mission-driven. We believe in building things that matter and celebrating every milestone together.",
      },
    ],
  },
};

// ─── Modal Component ──────────────────────────────────────────────────────────

const Modal = ({ data, onClose }) => {
  if (!data) return null;
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .sy-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: rgba(120,80,180,0.22);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: sy-fade-in 0.25s ease;
        }
        @keyframes sy-fade-in {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        .sy-drawer {
          width: 100%;
          max-width: 680px;
          max-height: 82vh;
          border-radius: 24px 24px 0 0;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(160,120,220,0.25);
          border-bottom: none;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: sy-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 -16px 60px rgba(140,80,200,0.18), 0 0 0 1px rgba(180,140,240,0.1);
        }
        @keyframes sy-slide-up {
          from { transform: translateY(100%) }
          to   { transform: translateY(0) }
        }
        .sy-drawer-handle {
          width: 40px; height: 4px;
          background: rgba(140,80,200,0.2);
          border-radius: 99px;
          margin: 14px auto 0;
          flex-shrink: 0;
        }
        .sy-drawer-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px 28px 16px;
          border-bottom: 1px solid rgba(140,80,200,0.1);
          flex-shrink: 0;
        }
        .sy-drawer-emoji {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #f0e8ff 0%, #e8d5ff 100%);
          border: 1px solid rgba(140,80,200,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .sy-drawer-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          color: #3a1a6e;
          letter-spacing: -0.3px;
          flex: 1;
        }
        .sy-close-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(140,80,200,0.2);
          background: rgba(140,80,200,0.08);
          color: #7c3fbf;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          transition: all 0.2s;
          flex-shrink: 0;
          font-family: sans-serif;
          line-height: 1;
        }
        .sy-close-btn:hover {
          background: rgba(140,80,200,0.18);
          color: #5a1fa0;
          transform: scale(1.08);
        }
        .sy-drawer-body {
          overflow-y: auto;
          padding: 24px 28px 36px;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: rgba(140,80,200,0.2) transparent;
        }
        .sy-drawer-body::-webkit-scrollbar { width: 4px }
        .sy-drawer-body::-webkit-scrollbar-track { background: transparent }
        .sy-drawer-body::-webkit-scrollbar-thumb { background: rgba(140,80,200,0.2); border-radius: 99px }
        .sy-section {
          margin-bottom: 14px;
          padding: 16px 18px;
          border-radius: 14px;
          background: rgba(245,238,255,0.7);
          border: 1px solid rgba(180,140,240,0.18);
          transition: border-color 0.2s, background 0.2s;
        }
        .sy-section:hover {
          border-color: rgba(140,80,200,0.3);
          background: rgba(240,228,255,0.9);
        }
        .sy-section-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 12px;
          color: #8c40c8;
          text-transform: uppercase;
          letter-spacing: 0.9px;
          margin-bottom: 7px;
        }
        .sy-section-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #3a2a55;
          line-height: 1.75;
          white-space: pre-line;
        }
      `}</style>

      <div className="sy-overlay" onClick={onClose}>
        <div className="sy-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="sy-drawer-handle" />
          <div className="sy-drawer-header">
            <div className="sy-drawer-emoji">{data.emoji}</div>
            <div className="sy-drawer-title">{data.title}</div>
            <button
              className="sy-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="sy-drawer-body">
            {data.sections.map((sec, i) => (
              <div className="sy-section" key={i}>
                {sec.heading && (
                  <div className="sy-section-heading">{sec.heading}</div>
                )}
                {sec.body && <div className="sy-section-body">{sec.body}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Footer Component ─────────────────────────────────────────────────────────

export const Footer = () => {
  const [activePopup, setActivePopup] = useState(null);

  const links = ["About", "Blog", "Careers", "Privacy", "Terms", "Contact"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .sy-footer {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(160,100,220,0.15);
          padding: 40px 24px 28px;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .sy-footer::before {
          content: '';
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 380px; height: 140px;
          background: radial-gradient(ellipse, rgba(180,100,240,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .sy-footer-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 26px;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #c0392b 0%, #8e44ad 60%, #5b2d8e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 22px;
          display: inline-block;
        }
        .sy-footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px 4px;
          margin-bottom: 24px;
        }
        .sy-footer-link {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(160,100,220,0.2);
          border-radius: 99px;
          padding: 6px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #6a2fa0;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.2px;
        }
        .sy-footer-link:hover {
          background: linear-gradient(135deg, rgba(200,100,180,0.15), rgba(120,60,200,0.15));
          border-color: rgba(140,60,200,0.45);
          color: #5a1fa0;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(140,60,200,0.12);
        }
        .sy-footer-divider {
          width: 40px; height: 1px;
          background: rgba(160,100,220,0.2);
          margin: 0 auto 18px;
        }
        .sy-footer-copy {
          font-size: 12.5px;
          color: rgba(80,40,120,0.55);
          line-height: 1.7;
          font-weight: 400;
        }
        .sy-footer-copy span {
          display: block;
        }
        .sy-footer-copy em {
          font-style: normal;
          color: rgba(80,40,120,0.35);
          font-size: 11.5px;
        }
      `}</style>

      <footer className="sy-footer">
        <div className="sy-footer-logo">SkillYer</div>

        <div className="sy-footer-links">
          {links.map((link) => (
            <button
              key={link}
              className="sy-footer-link"
              onClick={() => setActivePopup(POPUP_CONTENT[link])}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="sy-footer-divider" />

        <p className="sy-footer-copy">
          <span>
            © 2026 TruhireAI Private Limited All Rights Reversed · Made with ❤️
            for India's workforce
          </span>
        </p>
      </footer>

      <Modal data={activePopup} onClose={() => setActivePopup(null)} />
    </>
  );
};
