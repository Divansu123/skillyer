import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/layout/Navbar';
import ChatBot from './components/common/ChatBot';
import CompareBar from './components/common/CompareBar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ComparePage from './pages/ComparePage';
import FinderPage from './pages/FinderPage';
import JobsPage from './pages/JobsPage';
import ToolsPage from './pages/ToolsPage';
import AdminPage from './pages/AdminPage';
import './styles/globals.css';

export const CompareContext = React.createContext(null);

function App() {
  const [compareList, setCompareList] = useState([]);
  const [compareAlert, setCompareAlert] = useState(false);

  const toggleCompare = (course) => {
    setCompareList(prev => {
      const exists = prev.find(c => c.id === course.id);
      if (exists) return prev.filter(c => c.id !== course.id);
      if (prev.length >= 3) { setCompareAlert(true); setTimeout(() => setCompareAlert(false), 3000); return prev; }
      return [...prev, course];
    });
  };

  const clearCompare = () => setCompareList([]);

  return (
    <AdminProvider>
      <CompareContext.Provider value={{ compareList, toggleCompare, clearCompare }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/finder" element={<FinderPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          {compareAlert && (
            <div style={{ position:'fixed', top:20, right:20, zIndex:9999, background:'#fffbeb', border:'1.5px solid #f59e0b', color:'#92400e', borderRadius:12, padding:'12px 18px', fontSize:14, fontWeight:500, boxShadow:'0 4px 20px rgba(0,0,0,0.10)', animation:'slideInToast 0.3s ease', display:'flex', alignItems:'center', gap:8 }}>
              ⚠️ You can compare up to 3 courses only
            </div>
          )}
          <style>{"@keyframes slideInToast { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }"}</style>
          <CompareBar />
          <ChatBot />
        </Router>
      </CompareContext.Provider>
    </AdminProvider>
  );
}

export default App;
