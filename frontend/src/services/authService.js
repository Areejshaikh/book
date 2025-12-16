// Import the mock authClient that implements Better Auth API
import { signIn, signOut, getSession, getAuthToken, isAuthenticated, getAccount } from './authClient';

// Better Auth service interface to maintain compatibility with existing code
export const authService = {
  /**
   * Checks if the user is currently authenticated
   * @returns {Promise<boolean>} Whether the user is authenticated
   */
  isAuthenticated: async () => {
    try {
      return await isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  },

  /**
   * Gets the current auth token
   * @returns {Promise<string|null>} The auth token or null if not authenticated
   */
  getAuthToken: async () => {
    try {
      return await getAuthToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  /**
   * Gets the current user session
   * @returns {Promise<Object|null>} The session object or null if not authenticated
   */
  getSession: async () => {
    try {
      return await getSession();
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  /**
   * Gets the current user's ID
   * @returns {Promise<string|null>} The user ID or null if not authenticated
   */
  getUserId: async () => {
    try {
      const session = await getSession();
      return session?.user?.id || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  },

  /**
   * Initiates the sign-in process with the specified provider
   * @param {string} provider - The authentication provider ('email', 'google', etc.)
   * @returns {Promise<Object>} The sign-in result
   */
  signIn: async (provider = 'email', options = {}) => {
    try {
      if (provider === 'email' && options.email && options.password) {
        // For email sign in with credentials
        return await signIn.email({
          email: options.email,
          password: options.password,
          callbackURL: options.callbackURL || window.location.href,
          redirect: false,
        });
      } else if (provider === 'email') {
        // For email sign in without credentials, return the function
        return signIn.email;
      } else {
        // For other providers like Google
        return await signIn[provider]({
          callbackURL: options.callbackURL || window.location.href,
          redirect: false,
        });
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Signs out the current user
   * @returns {Promise<void>}
   */
  signOut: async () => {
    try {
      await signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Refreshes the authentication token if needed
   * @returns {Promise<boolean>} Whether the token was successfully refreshed
   */
  refreshToken: async () => {
    try {
      // Better Auth handles token refresh automatically
      // We'll just verify that the session is still valid
      const session = await getSession();
      return !!session;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
};