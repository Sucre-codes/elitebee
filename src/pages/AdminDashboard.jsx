import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConsignments, deleteConsignment } from '../utils/api';
import { formatDate, formatStatus, getStatusColor, getStatusIcon } from '../utils/helpers';

const AdminDashboard = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchConsignments();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  };

  const fetchConsignments = async () => {
    try {
      const data = await getConsignments();
      setConsignments(data);
    } catch (err) {
      console.error('Error fetching consignments:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consignment?')) {
      try {
        await deleteConsignment(id);
        setConsignments(consignments.filter(c => c._id !== id));
      } catch (err) {
        alert('Error deleting consignment');
      }
    }
  };

  const filteredConsignments = filter === 'all' 
    ? consignments 
    : consignments.filter(c => c.currentStatus === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🐝</div>
              <div>
                <h1 className="text-xl font-bold text-navy-900">EliteBee Admin</h1>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/consignments/new')}
                className="btn-primary"
              >
                + New Consignment
              </button>
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-navy-900 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Total Consignments</p>
            <p className="text-3xl font-bold text-navy-900">{consignments.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">In Transit</p>
            <p className="text-3xl font-bold text-blue-600">
              {consignments.filter(c => c.currentStatus === 'in_transit').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Out for Delivery</p>
            <p className="text-3xl font-bold text-purple-600">
              {consignments.filter(c => c.currentStatus === 'out_for_delivery').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Delivered</p>
            <p className="text-3xl font-bold text-emerald-600">
              {consignments.filter(c => c.currentStatus === 'delivered').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-navy-900 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('created')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'created' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Created
            </button>
            <button
              onClick={() => setFilter('in_transit')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'in_transit' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setFilter('out_for_delivery')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'out_for_delivery' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Out for Delivery
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'delivered' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Consignments List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {filteredConsignments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-lg text-slate-600">No consignments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Tracking ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredConsignments.map((consignment) => (
                    <tr key={consignment._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-navy-900 tracking-wider">
                          {consignment.trackingId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{consignment.receiver.name}</p>
                          <p className="text-sm text-slate-500 truncate max-w-xs">
                            {consignment.receiver.address}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${getStatusColor(consignment.currentStatus)}`}>
                          <span className="mr-1">{getStatusIcon(consignment.currentStatus)}</span>
                          {formatStatus(consignment.currentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(consignment.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/consignments/${consignment._id}`)}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(consignment._id)}
                            className="px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
