// This file sets the backend URL as a global variable for the frontend
// It will be included in the HTML template to set window.__BACKEND_URL__

(function() {
  // Set the backend URL - this can be customized based on environment
  window.__BACKEND_URL__ = window.__BACKEND_URL__ || 'http://localhost:5000';
})();