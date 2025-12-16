/**
 * Service function to handle communication with the backend API
 * @param {string} query - The search query to send to the backend
 * @param {string} backendUrl - The base URL of the backend API
 * @returns {Promise<Object>} - Promise that resolves to the API response
 */
const searchAPI = async (query, backendUrl = 'http://localhost:8000') => {
  try {
    const response = await fetch(`${backendUrl}/retrieve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default searchAPI;