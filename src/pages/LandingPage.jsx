import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track/${trackingId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="pt-8 pb-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🐝</div>
            <div>
              <h1 className="text-2xl font-bold text-navy-900 tracking-tight">EliteBee Delivery</h1>
              <p className="text-xs text-slate-600 font-medium">Premium Logistics</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/admin')}
            className="text-sm text-slate-600 hover:text-navy-900 font-medium transition-colors"
          >
            Admin
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="animate-fade-in mb-8">
            <h2 className="text-5xl md:text-6xl font-bold text-navy-900 mb-4 leading-tight">
              Track Your Delivery
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-navy-900 bg-clip-text text-transparent">
                In Real Time
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Premium logistics for personal gifts and family consignments. 
              Enter your tracking ID to see your package's journey.
            </p>
          </div>

          {/* Tracking Input */}
          <div className="animate-slide-up max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleTrack} className="mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="Enter Tracking ID (e.g., ABC12345)"
                  className="w-full px-6 py-5 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 shadow-sm font-mono tracking-wider"
                  style={{ letterSpacing: '0.1em' }}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-navy-900 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Track
                </button>
              </div>
            </form>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="px-6 py-3 bg-white rounded-full shadow-sm border border-slate-100">
                <span className="text-2xl mr-2">📍</span>
                <span className="text-sm font-medium text-slate-700">Live Location</span>
              </div>
              <div className="px-6 py-3 bg-white rounded-full shadow-sm border border-slate-100">
                <span className="text-2xl mr-2">🗺️</span>
                <span className="text-sm font-medium text-slate-700">Route Tracking</span>
              </div>
              <div className="px-6 py-3 bg-white rounded-full shadow-sm border border-slate-100">
                <span className="text-2xl mr-2">✉️</span>
                <span className="text-sm font-medium text-slate-700">Email Updates</span>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-slate-600">
                Your tracking information is protected with enterprise-grade security
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Fast Updates</h3>
              <p className="text-sm text-slate-600">
                Real-time location updates as your package moves
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Premium Care</h3>
              <p className="text-sm text-slate-600">
                White-glove service for your most important deliveries
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-slate-500">
        <p>© 2025 EliteBee Delivery. Premium logistics you can trust.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
