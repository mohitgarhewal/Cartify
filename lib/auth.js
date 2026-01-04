// Simple authentication utility for protected routes
// Checks if a user is logged in by verifying if a token exists in localStorage

export function isLoggedIn() {
  // Interview note: In production, use httpOnly cookies or secure storage
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('token'));
}

// Optionally, get the token for API requests
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
