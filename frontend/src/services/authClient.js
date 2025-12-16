// Mock authentication service that simulates Better Auth API
// This will be replaced with actual Better Auth implementation

// For now, we'll simulate the authentication flow
// In a real implementation, this would interface with Better Auth's actual API

const BASE_URL = typeof window !== 'undefined'
  ? window.REACT_APP_API_BASE_URL || 'http://localhost:8000'
  : 'http://localhost:8000';

// Store for mock session data
let mockSession = null;

// Mock sign in functionality
export const signIn = {
  email: async ({ email, password, callbackURL }) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate simple authentication validation
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } };
    }

    // In a real implementation, this would call the actual Better Auth API
    mockSession = {
      user: {
        id: `user_${Date.now()}`,
        email: email,
        name: email.split('@')[0] // Use part of email as name
      },
      token: `mock_token_${Math.random().toString(36).substring(2, 15)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    };

    // Store in localStorage to persist across page reloads
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('better-auth-session', JSON.stringify(mockSession));
    }

    return { success: true, session: mockSession };
  },

  google: async ({ callbackURL, redirect }) => {
    // Simulate OAuth redirect flow
    await new Promise(resolve => setTimeout(resolve, 500));

    // For this mock implementation, we'll simulate successful Google auth
    mockSession = {
      user: {
        id: `google_user_${Date.now()}`,
        email: 'user@gmail.com', // In a real impl, this would come from Google
        name: 'Google User',
        provider: 'google'
      },
      token: `mock_token_${Math.random().toString(36).substring(2, 15)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    // Store in localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('better-auth-session', JSON.stringify(mockSession));
    }

    return { success: true, session: mockSession };
  }
};

// Mock sign out functionality
export const signOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Clear mock session
  mockSession = null;
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('better-auth-session');
  }

  return { success: true };
};

// Mock get session functionality
export const getSession = async () => {
  // Check if we have a session in localStorage
  if (typeof window !== 'undefined') {
    const storedSession = window.localStorage.getItem('better-auth-session');
    if (storedSession) {
      const session = JSON.parse(storedSession);

      // Check if session is expired
      if (new Date(session.expiresAt) > new Date()) {
        mockSession = session;
        return session;
      } else {
        // Session expired, clear it
        window.localStorage.removeItem('better-auth-session');
        return null;
      }
    }
  }

  return mockSession;
};

// Mock get account functionality
export const getAccount = async () => {
  const session = await getSession();
  return session?.user || null;
};

// Mock function to get auth token
export const getAuthToken = async () => {
  const session = await getSession();
  return session?.token || null;
};

// Mock function to check if user is authenticated
export const isAuthenticated = async () => {
  const session = await getSession();
  return !!(session && session.user);
};

// Mock function to initialize auth state
export const initializeAuth = async () => {
  return await getSession();
};