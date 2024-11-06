// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import VoterDashboard from './components/VoterDashboard';
import Results from './components/Results';

function App() {
  return (
    <Router>
      <div>
        <h1>Blockchain Election System</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Voter Dashboard</Link>
            </li>
            <li>
              <Link to="/admin">Admin Dashboard</Link>
            </li>
            <li>
              <Link to="/results">Election Results</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/" element={<VoterDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
