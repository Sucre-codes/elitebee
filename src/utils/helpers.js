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
  };
  
  return icons[status] || icons.created;
};

// Format status text
export const formatStatus = (status) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Generate random color for map marker
export const generateMarkerColor = () => {
  return '#1e3a8a'; // Navy blue
};
