import { format, formatDistanceToNow } from 'date-fns';

// Format date to readable string
export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy • h:mm a');
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    created: 'bg-gray-100 text-gray-700',
    in_transit: 'bg-blue-100 text-blue-700',
    out_for_delivery: 'bg-purple-100 text-purple-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    delayed: 'bg-orange-100 text-orange-700',
    // New fee-related statuses
    customs_service_fee: 'bg-amber-100 text-amber-800',
    insurance_required: 'bg-red-100 text-red-800',
    clearance_levy_fee: 'bg-yellow-100 text-yellow-800',
    border_patrol_service: 'bg-indigo-100 text-indigo-800',
  };
  
  return colors[status] || colors.created;
};

// Get status icon
export const getStatusIcon = (status) => {
  const icons = {
    created: '📦',
    in_transit: '🚚',
    out_for_delivery: '🚛',
    delivered: '✅',
    delayed: '⚠️',
    // New fee-related statuses
    customs_service_fee: '💵',
    insurance_required: '🛡️',
    clearance_levy_fee: '📋',
    border_patrol_service: '🛃',
  };
  
  return icons[status] || icons.created;
};

// Format status text
export const formatStatus = (status) => {
  const statusLabels = {
    created: 'Created',
    in_transit: 'In Transit',
    out_for_delivery: 'Out For Delivery',
    delivered: 'Delivered',
    delayed: 'Delayed',
    customs_service_fee: 'Customs Service Fee',
    insurance_required: 'Insurance Required',
    clearance_levy_fee: 'Local Clearance/Levy Fee',
    border_patrol_service: 'Border Patrol Service',
  };
  
  return statusLabels[status] || status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Generate random color for map marker
export const generateMarkerColor = () => {
  return '#1e3a8a'; // Navy blue
};

// Check if status is fee-related
export const isFeeStatus = (status) => {
  return ['customs_service_fee', 'insurance_required', 'clearance_levy_fee', 'border_patrol_service'].includes(status);
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};