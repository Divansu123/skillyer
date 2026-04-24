import React, { useState, useRef, useEffect } from 'react';

const BOTS = {
  greeting: 'Hi! I\'m SkillYerBot 🎓<br/><br/>I can help you:<br/>• Find the perfect course for your goals<br/>• Compare providers and pricing<br/>• Explore jobs in your field<br/>• Understand ROI of certifications<br/>• Build your CV<br/><br/>What are you looking to learn or achieve today?',
  data: 'Great choice! For <strong>Data & AI</strong>, top picks:<br/><br/>🥇 <strong>ML Specialization</strong> (Coursera) — 4.9★<br/>🥈 <strong>Google Data Analytics</strong> — Best for beginners<br/>🥉 <strong>Full Stack Data Science</strong> (Great Learning)<br/><br/>Data Science cert can lift your salary by <strong>28%</strong>!',
  web: 'Top <strong>Web Development</strong> picks:<br/><br/>🥇 <strong>Web Developer Bootcamp</strong> (Udemy) — ₹499<br/>🥈 <strong>React Complete Guide</strong> — React-focused<br/>🥉 <strong>Python for Everybody</strong> — Backend option<br/><br/>React devs see <strong>+20% salary lift</strong> after cert!',
  free: '<strong>FREE courses</strong> available:<br/><br/>📚 AWS Cloud Practitioner (edX) — Free audit<br/>📚 Financial Markets (Yale/Coursera) — 4.8★<br/>📚 UI Design in Figma (Skillshare)<br/>📚 Python for Everybody — Free audit<br/><br/>AWS Cloud cert = <strong>+22% avg salary lift!</strong>',
  jobs: 'Our <strong>Jobs Board</strong> has 1200+ openings! Hot roles:<br/><br/>🔥 ML Engineer — Flipkart, ₹20-32 LPA<br/>🔥 Senior Data Scientist — Razorpay, ₹28-42 LPA<br/>🔥 Engineering Manager — Meesho, ₹40-60 LPA<br/><br/>Head to the <strong>Jobs tab</strong> to browse all!',
  roi: 'Our <strong>ROI Calculator</strong> shows real salary impact!<br/><br/>🎯 AWS Certification — avg. <strong>+22%</strong> lift<br/>🎯 ML Specialization — avg. <strong>+28%</strong> lift<br/>🎯 PMP Certification — avg. <strong>+30%</strong> lift<br/><br/>Visit <strong>Tools tab</strong> to see your numbers!',
  cv: 'Our <strong>AI CV Builder</strong> in Tools tab:<br/><br/>• Live preview as you type<br/>• AI-generated summary<br/>• AI skill suggestions by role<br/>• ATS-ready format<br/><br/>Head to <strong>Tools → CV Builder</strong>!',
  default: 'I can help with:<br/><br/>• 📚 Course recommendations<br/>• 💼 Job search<br/>• 💰 Salary ROI analysis<br/>• ⚖ Course comparisons<br/>• 📋 CV Building<br/>• 🎓 Skill diagnostics<br/><br/>What would you like to explore?',
};

function botReply(m) {
  const l = m.toLowerCase();
  if (l.includes('hello') || l.includes('hi') || l.includes('hey')) return BOTS.greeting;
  if (l.includes('data') || l.includes('machine') || l.includes('ai') || l.includes('python')) return BOTS.data;
  if (l.includes('web') || l.includes('react') || l.includes('javascript') || l.includes('frontend')) return BOTS.web;
  if (l.includes('free') || l.includes('budget') || l.includes('no cost')) return BOTS.free;
  if (l.includes('job') || l.includes('career') || l.includes('hire')) return BOTS.jobs;
  if (l.includes('roi') || l.includes('salary') || l.includes('hike') || l.includes('earn')) return BOTS.roi;
  if (l.includes('cv') || l.includes('resume')) return BOTS.cv;
  return BOTS.default;
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSugs, setShowSugs] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const openChat = () => {
    setOpen(true);
    if (messages.length === 0) {
      setTimeout(() => setMessages([{ text: BOTS.greeting, isUser: false, time: now() }]), 300);
    }
  };

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const send = (msg) => {
    const text = msg || input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { text, isUser: true, time: now() }]);
    setInput('');
    setShowSugs(false);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { text: botReply(text), isUser: false, time: now() }]);
    }, 700 + Math.random() * 500);
  };

  const suggestions = [
    'Best courses for data science career?',
    'I want to switch to tech, where do I start?',
    'What is the ROI of AWS certification?',
    'Find me remote jobs in product management',
  ];

  return (
    <>
      {/* FAB */}
      <button onClick={open ? () => setOpen(false) : openChat} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 998, width: 54, height: 54,
        borderRadius: open ? '50%' : 16,
        background: open ? 'var(--surface2)' : 'linear-gradient(135deg, #ff6b35, #6246ea)',
        border: open ? '1.5px solid var(--border)' : 'none', cursor: 'pointer',
        boxShadow: '0 8px 28px rgba(98,70,234,0.4)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', transition: 'all 0.25s', fontSize: open ? 18 : undefined,
        color: 'var(--text2)',
      }}>
        {open ? '✕' : (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L17 8H23L18 12L20 18L14 14L8 18L10 12L5 8H11L14 2Z" fill="white" opacity="0.9"/>
            <rect x="8" y="20" width="12" height="2" rx="1" fill="white" opacity="0.7"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 88, right: 24, zIndex: 997, width: 360, height: 500,
          background: 'white', border: '1.5px solid var(--border)', borderRadius: 22,
          display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(98,70,234,0.15)', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6246ea, #ff6b35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 7H19.5L15.5 10L17 15L12 12L7 15L8.5 10L4.5 7H9.5L12 2Z" fill="white"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>SkillYerBot</div>
              <div style={{ fontSize: 11, color: 'var(--accent3)' }}>● Online — Your AI Career Advisor</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: '#f7f8fc' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ maxWidth: '84%', alignSelf: m.isUser ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: m.isUser ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
                  fontSize: 12.5, lineHeight: 1.55,
                  background: m.isUser ? 'var(--accent)' : 'white',
                  color: m.isUser ? 'white' : 'var(--text)',
                  border: m.isUser ? 'none' : '1.5px solid var(--border)',
                }} dangerouslySetInnerHTML={{ __html: m.text }} />
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, padding: '0 3px' }}>{m.time}</div>
              </div>
            ))}
            {typing && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '84%' }}>
                <div style={{ padding: '10px 14px', background: 'white', border: '1.5px solid var(--border)', borderRadius: '4px 14px 14px 14px', display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text3)', display: 'inline-block', animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {showSugs && messages.length <= 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexDirection: 'column', gap: 5, background: 'white' }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  background: 'white', border: '1.5px solid var(--border)', borderRadius: 8,
                  padding: '7px 11px', fontSize: 11.5, color: 'var(--text2)', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s'
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: 10, borderTop: '1.5px solid var(--border)', display: 'flex', gap: 7, alignItems: 'center', background: 'white' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about courses, jobs, careers..." rows={1}
              style={{
                flex: 1, background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 10,
                padding: '9px 13px', color: 'var(--text)', fontSize: 12.5, fontFamily: 'DM Sans, sans-serif',
                outline: 'none', resize: 'none', transition: 'border-color 0.2s'
              }} />
            <button onClick={() => send()} style={{
              background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10,
              width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
