import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConsignment } from '../utils/api';

const NewConsignment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Cargo Details
    cargoDescription: '',
    cargoWeight: '',
    cargoImages: [],
    
    // Receiver Info
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    receiverAddress: '',
    
    // Route
    startLat: '',
    startLng: '',
    startName: '',
    endLat: '',
    endLng: '',
    endName: '',
    waypoints: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Build route coordinates (simple line from start to end with optional waypoints)
      const routeCoordinates = [
        { lat: parseFloat(formData.startLat), lng: parseFloat(formData.startLng) }
      ];
      
      // Add waypoints if any
      if (formData.waypoints.length > 0) {
        formData.waypoints.forEach(wp => {
          routeCoordinates.push({ lat: parseFloat(wp.lat), lng: parseFloat(wp.lng) });
        });
      }
      
      routeCoordinates.push({ 
        lat: parseFloat(formData.endLat), 
        lng: parseFloat(formData.endLng) 
      });

      const consignmentData = {
        cargoDetails: {
          description: formData.cargoDescription,
          weight: formData.cargoWeight,
          images: formData.cargoImages.filter(img => img.trim())
        },
        receiver: {
          name: formData.receiverName,
          email: formData.receiverEmail,
          phone: formData.receiverPhone,
          address: formData.receiverAddress
        },
        route: {
          startLocation: {
            lat: parseFloat(formData.startLat),
            lng: parseFloat(formData.startLng),
            name: formData.startName
          },
          endLocation: {
            lat: parseFloat(formData.endLat),
            lng: parseFloat(formData.endLng),
            name: formData.endName
          },
          routeCoordinates
        }
      };

      const result = await createConsignment(consignmentData);
      alert(`Consignment created! Tracking ID: ${result.trackingId}`);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating consignment');
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => {
    setFormData({
      ...formData,
      cargoImages: [...formData.cargoImages, '']
    });
  };

  const updateImageUrl = (index, value) => {
    const newImages = [...formData.cargoImages];
    newImages[index] = value;
    setFormData({ ...formData, cargoImages: newImages });
  };

  const removeImageUrl = (index) => {
    const newImages = formData.cargoImages.filter((_, i) => i !== index);
    setFormData({ ...formData, cargoImages: newImages });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-slate-600 hover:text-navy-900"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-navy-900">Create New Consignment</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Cargo Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-navy-900 mb-4">📦 Cargo Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="cargoDescription"
                  value={formData.cargoDescription}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                  placeholder="Gift box with flowers and chocolates"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  name="cargoWeight"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="2.5 kg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Images (URLs)
                </label>
                {formData.cargoImages.map((img, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Image URL
                </button>
              </div>
            </div>
          </div>

          {/* Receiver Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-navy-900 mb-4">👤 Receiver Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="receiverEmail"
                  value={formData.receiverEmail}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 234 567 8900"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="123 Main St, City, Country"
                  required
                />
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-navy-900 mb-4">🗺️ Route Information</h2>
            
            <div className="space-y-6">
              {/* Start Location */}
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">Start Location</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="startLat"
                      value={formData.startLat}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="40.7128"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="startLng"
                      value={formData.startLng}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="-74.0060"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Location Name *
                    </label>
                    <input
                      type="text"
                      name="startName"
                      value={formData.startName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="New York, NY"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* End Location */}
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">End Location</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="endLat"
                      value={formData.endLat}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="34.0522"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="endLng"
                      value={formData.endLng}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="-118.2437"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Location Name *
                    </label>
                    <input
                      type="text"
                      name="endName"
                      value={formData.endName}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Los Angeles, CA"
                      required
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600">
                💡 Tip: Use <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">latlong.net</a> to find coordinates
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Consignment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConsignment;
