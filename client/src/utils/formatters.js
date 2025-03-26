// Format date to readable format
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

// Format date with time
export const formatDateTime = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

// Format time only
export const formatTime = (dateString) => {
  const options = { 
    hour: '2-digit',
    minute: '2-digit'
  };
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', options);
};

// Format date as relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  // Time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  let counter;
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsInUnit);
    if (counter > 0) {
      return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
};

// Format food type with color
export const formatFoodType = (type) => {
  switch (type) {
    case 'Vegetarian':
      return { text: 'Vegetarian', color: 'success' };
    case 'Non-Vegetarian':
      return { text: 'Non-Vegetarian', color: 'danger' };
    case 'Vegan':
      return { text: 'Vegan', color: 'info' };
    default:
      return { text: type, color: 'secondary' };
  }
};

// Format donation status with color
export const formatDonationStatus = (status) => {
  switch (status) {
    case 'scheduled':
      return { text: 'Scheduled', color: 'warning' };
    case 'completed':
      return { text: 'Completed', color: 'success' };
    case 'cancelled':
      return { text: 'Cancelled', color: 'danger' };
    default:
      return { text: status, color: 'secondary' };
  }
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Format phone number
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Basic phone formatting for Indian numbers
  if (phone.length === 10) {
    return `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`;
  }
  
  return phone;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};