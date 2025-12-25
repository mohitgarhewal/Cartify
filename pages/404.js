import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found | Cartify</title>
        <meta name="description" content="Page not found" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
          
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Go Home
              </motion.button>
            </Link>
            
            <Link href="/collection">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline"
              >
                Browse Products
              </motion.button>
            </Link>
          </div>

          {/* Decorative Elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mt-16"
          >
            <svg
              className="w-64 h-64 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
