import React, { useState, useEffect,useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { trackConsignment } from '../utils/api';
import { formatDate, formatRelativeTime, getStatusColor, getStatusIcon, formatStatus } from '../utils/helpers';
import 'leaflet/dist/leaflet.css';
import logo from '../assets/logo.png'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (html, className) => {
  return L.divIcon({
    html: html,
    className: className,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const startIcon = createCustomIcon(
  '<div class="bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">🏁 Start</div>',
  'custom-marker'
);

const endIcon = createCustomIcon(
  '<div class="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">🎯 Destination</div>',
  'custom-marker'
);

const currentIcon = createCustomIcon(
  '<div class="relative"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div><div class="relative bg-blue-600 text-white p-2 rounded-full shadow-xl text-xl">🚚</div></div>',
  'custom-marker current-location'
);

const TrackingPage = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [consignment, setConsignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConsignment = useCallback(async () => {
    try {
      setLoading(true);
      const data = await trackConsignment(trackingId);
      setConsignment(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Tracking ID not found');
    } finally {
      setLoading(false);
    }
  },[trackingId])

   useEffect(() => {
    fetchConsignment();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchConsignment, 30000);
    return () => clearInterval(interval);
  }, [fetchConsignment]);

  if (loading && !consignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-slate-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-navy-900 mb-3">Tracking ID Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full"
          >
            Try Another ID
          </button>
        </div>
      </div>
    );
  }

  // Create route coordinates for polyline
  const routeCoordinates = consignment.route.routeCoordinates.map(coord => [coord.lat, coord.lng]);
  
  // Calculate map bounds to fit all markers
  const bounds = [
    ...routeCoordinates,
    [consignment.currentLocation.lat, consignment.currentLocation.lng]
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="EliteBee Delivery" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            </div>
              <div>
                <h1 className="text-xl font-bold text-navy-900">EliteBee Delivery</h1>
                <p className="text-xs text-slate-500">Premium Logistics</p>
              </div>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Tracking ID</p>
                <p className="text-lg font-mono font-bold text-navy-900 tracking-wider">{consignment.trackingId}</p>
              </div>
              <span className={`status-badge ${getStatusColor(consignment.currentStatus)}`}>
                <span className="mr-1">{getStatusIcon(consignment.currentStatus)}</span>
                {formatStatus(consignment.currentStatus)}
              </span>
            </div>
          </div>
          
          {/* Mobile Tracking ID */}
          <div className="sm:hidden mt-3 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Tracking ID</p>
            <p className="text-lg font-mono font-bold text-navy-900 tracking-wider">{consignment.trackingId}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="h-[500px] relative">
                <MapContainer
                  center={[consignment.currentLocation.lat, consignment.currentLocation.lng]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  bounds={bounds}
                  boundsOptions={{ padding: [50, 50] }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Route Line */}
                  <Polyline
                    positions={routeCoordinates}
                    color="#3b82f6"
                    weight={4}
                    opacity={0.6}
                  />

                  {/* Start Marker */}
                  <Marker
                    position={[consignment.route.startLocation.lat, consignment.route.startLocation.lng]}
                    icon={startIcon}
                  >
                    <Popup>{consignment.route.startLocation.name}</Popup>
                  </Marker>

                  {/* End Marker */}
                  <Marker
                    position={[consignment.route.endLocation.lat, consignment.route.endLocation.lng]}
                    icon={endIcon}
                  >
                    <Popup>{consignment.route.endLocation.name}</Popup>
                  </Marker>

                  {/* Current Location Marker */}
                  <Marker
                    position={[consignment.currentLocation.lat, consignment.currentLocation.lng]}
                    icon={currentIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold">Current Location</p>
                        <p className="text-sm text-slate-600">{formatStatus(consignment.currentStatus)}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
                
                {/* Last Updated Badge */}
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md border border-slate-200">
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="text-sm font-semibold text-navy-900">{formatRelativeTime(consignment.lastUpdated)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Cargo Details */}
            {consignment.cargoDetails && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-navy-900 mb-4">📦 Package Details</h3>
                {consignment.cargoDetails.images && consignment.cargoDetails.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {consignment.cargoDetails.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Cargo ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  {consignment.cargoDetails.description && (
                    <p className="text-slate-700">{consignment.cargoDetails.description}</p>
                  )}
                  {consignment.cargoDetails.weight && (
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Weight:</span> {consignment.cargoDetails.weight}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Receiver Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-navy-900 mb-4">👤 Delivery Information</h3>
              <div className="space-y-2">
                <p className="text-slate-700">
                  <span className="font-semibold">Name:</span> {consignment.receiver.name}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold">Address:</span> {consignment.receiver.address}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-navy-900 mb-4">📍 Tracking Timeline</h3>
              <div className="space-y-4">
                {consignment.timeline.slice().reverse().map((entry, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(entry.status)} text-lg`}>
                        {getStatusIcon(entry.status)}
                      </div>
                      {idx < consignment.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(entry.status)}`}>
                          {formatStatus(entry.status)}
                        </span>
                      </div>
                      {entry.locationName && (
                        <p className="text-sm font-medium text-slate-700">{entry.locationName}</p>
                      )}
                      {entry.note && (
                        <p className="text-sm text-slate-600 mt-1">{entry.note}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">{formatDate(entry.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
