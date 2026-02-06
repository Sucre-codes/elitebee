import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TrackingPage from './pages/TrackingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NewConsignment from './pages/NewConsignment';
import ConsignmentDetail from './pages/ConsignmentDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/track/:trackingId" element={<TrackingPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/consignments/new" element={<NewConsignment />} />
        <Route path="/admin/consignments/:id" element={<ConsignmentDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
