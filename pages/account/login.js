import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // Fix: Add error state for login errors
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    // Updated: Use backend API for authentication
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const { email, password } = formData;
      // Call backend login endpoint using API client
      const res = await import('@/lib/apiClient').then(mod =>
        mod.apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })
      );
      // Accept either access_token or token for compatibility
      const token = res.access_token || res.token;
      if (token) {
        localStorage.setItem("token", token);
        router.push("/");
      } else {
        // Show error from backend, or fallback
        setError(res.error || res.message || "User not found or invalid credentials");
      }
    } catch (err) {
      setError(err.message || "Login error");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
          skipBrowserRedirect: true, // attempt popup first
        },
      });

      if (error) throw error;

      // Popup may be blocked; fallback to full redirect
      if (data?.url) {
        window.location.assign(data.url);
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      console.error('Google login error:', err);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Login - Cartify</title>
        <meta name="description" content="Login to your Cartify account" />
        <meta name="robots" content="noindex" />
      </Head>

      {/* Show error message if login fails */}
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-600">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                >
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs uppercase text-gray-400">or</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </a>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary"
              >
                Sign In
              </motion.button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="ml-2 text-sm font-medium">Google</span>
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="ml-2 text-sm font-medium">Facebook</span>
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/account/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
