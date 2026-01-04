// apiClient.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

/**
 * apiRequest
 * - endpoint: string (e.g. "/auth/register")
 * - options: same shape as fetch options (method, body, headers, credentials, etc)
 *
 * Behavior:
 * - Guarantees Content-Type: application/json unless overridden explicitly
 * - Defaults credentials to 'include' if no credentials option is provided (match server credentials:true)
 * - Safely handles non-JSON responses
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Build headers safely so callers can override/extend
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Default credentials to 'include' to match server-side credentials: true.
  // Callers can override by passing options.credentials explicitly.
  const credentials = options.credentials ?? 'include';

  const fetchOptions = {
    ...options,
    headers,
    credentials,
  };

  try {
    const res = await fetch(url, fetchOptions);

    // Safely parse response body (handle empty or non-JSON responses)
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      // If response is not JSON, keep raw text
      data = text;
    }

    if (!res.ok) {
      // If server provided a structured error, prefer its message
      const message = (data && data.message) ? data.message : (typeof data === 'string' ? data : res.statusText);
      const error = new Error(message || 'API Error');
      error.status = res.status;
      error.response = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('[apiClient] API request failed:', error);
    throw error;
  }
}
