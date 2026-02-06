import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import herobg from '../assets/hero.jpg'

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
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="EliteBee Delivery" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
                EliteBee Delivery
              </h1>
              <p className="text-xs text-slate-600 font-medium hidden sm:block">
                Premium Logistics Solutions
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] sm:min-h-[700px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${herobg})`,
            }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-blue-900/85 to-slate-900/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <div className="animate-fade-in mb-8 sm:mb-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Professional Delivery
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Tracking Excellence
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto px-4">
                Experience enterprise-grade logistics for your most valued shipments. 
                Monitor your consignment's journey with precision and transparency.
              </p>
            </div>

            {/* Tracking Input */}
            <div className="animate-slide-up max-w-2xl mx-auto px-4" style={{ animationDelay: '0.1s' }}>
              <form onSubmit={handleTrack} className="mb-8 sm:mb-12">
                <div className="relative flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                    placeholder="Enter Tracking ID"
                    className="flex-1 px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/60 rounded-xl sm:rounded-2xl focus:border-blue-400 focus:ring-4 focus:ring-blue-400/30 outline-none transition-all duration-200 shadow-lg font-mono tracking-wider"
                    style={{ letterSpacing: '0.1em' }}
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-base sm:text-lg"
                  >
                    Track Package
                  </button>
                </div>
              </form>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-xl sm:text-2xl mr-2">📍</span>
                  <span className="text-xs sm:text-sm font-medium text-white">Live GPS Tracking</span>
                </div>
                <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-xl sm:text-2xl mr-2">🗺️</span>
                  <span className="text-xs sm:text-sm font-medium text-white">Route Visibility</span>
                </div>
                <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-xl sm:text-2xl mr-2">⏱️</span>
                  <span className="text-xs sm:text-sm font-medium text-white">Real-Time Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Why Choose EliteBee?
            </h3>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Delivering excellence through technology, security, and professional service
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-slate-50 to-blue-50 p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🔒
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-navy-900 mb-3">
                Bank-Level Security
              </h4>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                End-to-end encryption and enterprise-grade security protocols protect your sensitive shipment data
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-slate-50 to-emerald-50 p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl">
              <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                ⚡
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-navy-900 mb-3">
                Instant Notifications
              </h4>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Receive immediate status updates as your consignment progresses through each delivery milestone
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-slate-50 to-purple-50 p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl sm:col-span-2 lg:col-span-1">
              <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                💎
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-navy-900 mb-3">
                Premium Handling
              </h4>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                White-glove service with dedicated specialists for your high-value and time-sensitive deliveries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy-900 to-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                99.8%
              </div>
              <div className="text-sm sm:text-base text-blue-200">
                On-Time Delivery
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                24/7
              </div>
              <div className="text-sm sm:text-base text-blue-200">
                Live Tracking
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                100%
              </div>
              <div className="text-sm sm:text-base text-blue-200">
                Secure Transit
              </div>
            </div>
            <div className="text-center col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                5★
              </div>
              <div className="text-sm sm:text-base text-blue-200">
                Customer Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-100 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src={logo} 
              alt="EliteBee Delivery" 
              className="h-8 w-8 object-contain opacity-60"
            />
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              EliteBee Delivery
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            © 2025 EliteBee Delivery. Professional logistics you can trust.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
