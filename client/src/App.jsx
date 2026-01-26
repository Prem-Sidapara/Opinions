import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import './index.css';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';

import Home from './pages/Home';
import OpinionDetails from './pages/OpinionDetails';
import ComingSoonPage from './pages/ComingSoonPage';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/opinion/:id" element={<OpinionDetails />} />
          <Route path="/trending" element={<ComingSoonPage name="Trending" />} />
          <Route path="/hot-topics" element={<ComingSoonPage name="Hot Topics" />} />
          <Route path="/polls" element={<ComingSoonPage name="Polls" />} />
          <Route path="/debates" element={<ComingSoonPage name="Debates" />} />
          <Route path="/communities" element={<ComingSoonPage name="Communities" />} />
          <Route path="/ask" element={<ComingSoonPage name="Ask Me" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
