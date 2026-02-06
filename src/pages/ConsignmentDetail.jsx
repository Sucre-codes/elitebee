import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getConsignment, updateConsignment, markDelivered } from '../utils/api';
import { formatDate, formatStatus, getStatusColor, getStatusIcon } from '../utils/helpers';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (html) => {
  return L.divIcon({
    html: html,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const startIcon = createCustomIcon(
  '<div class="bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">🏁 Start</div>'
);

const endIcon = createCustomIcon(
  '<div class="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">🎯 End</div>'
);

const currentIcon = createCustomIcon(
  '<div class="relative"><div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div><div class="relative bg-blue-600 text-white p-2 rounded-full shadow-xl text-xl">🚚</div></div>'
);

const ConsignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consignment, setConsignment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Update form
  const [updateForm, setUpdateForm] = useState({
    lat: '',
    lng: '',
    locationName: '',
    status: '',
    note: ''
  });

  useEffect(() => {
    fetchConsignment();
  }, [id]);

  const fetchConsignment = async () => {
    try {
      const data = await getConsignment(id);
      setConsignment(data);
      
      // Set initial update form values
      setUpdateForm({
        lat: data.currentLocation.lat,
        lng: data.currentLocation.lng,
        locationName: '',
        status: data.currentStatus,
        note: ''
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching consignment:', err);
      if (err.response?.status === 401) {
        navigate('/admin');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        location: {
          lat: parseFloat(updateForm.lat),
          lng: parseFloat(updateForm.lng)
        },
        status: updateForm.status,
        locationName: updateForm.locationName,
        note: updateForm.note
      };
      
      await updateConsignment(id, updateData);
      alert('Consignment updated successfully!');
      fetchConsignment();
      
      // Clear note
      setUpdateForm({ ...updateForm, note: '', locationName: '' });
    } catch (err) {
      alert('Error updating consignment: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleMarkDelivered = async () => {
    if (window.confirm('Mark this consignment as delivered?')) {
      try {
        await markDelivered(id, 'Package delivered successfully');
        alert('Marked as delivered!');
        fetchConsignment();
      } catch (err) {
        alert('Error marking as delivered: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  if (loading || !consignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-slate-600">Loading consignment...</p>
        </div>
      </div>
    );
  }

  // Create route coordinates for polyline
  const routeCoordinates = consignment.route.routeCoordinates.map(coord => [coord.lat, coord.lng]);
  // Calculate bounds
  const bounds = [
    ...routeCoordinates,
    [consignment.currentLocation.lat, consignment.currentLocation.lng]
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-slate-600 hover:text-navy-900"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-navy-900">Consignment Details</h1>
                <p className="text-sm text-slate-500 font-mono tracking-wider">{consignment.trackingId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`status-badge ${getStatusColor(consignment.currentStatus)}`}>
                <span className="mr-1">{getStatusIcon(consignment.currentStatus)}</span>
                {formatStatus(consignment.currentStatus)}
              </span>
              
              {consignment.currentStatus !== 'delivered' && (
                <button
                  onClick={handleMarkDelivered}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map and Info */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
              <div className="h-[400px] relative">
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
              </div>
            </div>

            {/* Receiver Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-navy-900 mb-4">👤 Receiver Information</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Name:</span> {consignment.receiver.name}</p>
                <p><span className="font-semibold">Email:</span> {consignment.receiver.email}</p>
                <p><span className="font-semibold">Phone:</span> {consignment.receiver.phone}</p>
                <p><span className="font-semibold">Address:</span> {consignment.receiver.address}</p>
              </div>
            </div>

            {/* Cargo Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-navy-900 mb-4">📦 Cargo Details</h3>
              {consignment.cargoDetails.images && consignment.cargoDetails.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {consignment.cargoDetails.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Cargo ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <p><span className="font-semibold">Description:</span> {consignment.cargoDetails.description}</p>
                {consignment.cargoDetails.weight && (
                  <p><span className="font-semibold">Weight:</span> {consignment.cargoDetails.weight}</p>
                )}
              </div>
            </div>
          </div>

          {/* Update Form and Timeline */}
          <div className="space-y-6">
            {/* Update Location Form */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-navy-900 mb-4">📍 Update Location & Status</h3>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={updateForm.lat}
                      onChange={(e) => setUpdateForm({ ...updateForm, lat: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={updateForm.lng}
                      onChange={(e) => setUpdateForm({ ...updateForm, lng: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={updateForm.locationName}
                    onChange={(e) => setUpdateForm({ ...updateForm, locationName: e.target.value })}
                    className="input-field"
                    placeholder="Chicago, IL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="created">Created</option>
                    <option value="in_transit">In Transit</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Note
                  </label>
                  <textarea
                    value={updateForm.note}
                    onChange={(e) => setUpdateForm({ ...updateForm, note: e.target.value })}
                    className="input-field"
                    rows="2"
                    placeholder="Optional update note"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Update Consignment
                </button>
              </form>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">📧 Email Status:</span>
                  <br />
                  Started: {consignment.emailsSent.deliveryStarted ? '✅ Sent' : '❌ Not sent'}
                  <br />
                  Completed: {consignment.emailsSent.deliveryCompleted ? '✅ Sent' : '❌ Not sent'}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-navy-900 mb-4">📍 Timeline</h3>
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

export default ConsignmentDetail;
