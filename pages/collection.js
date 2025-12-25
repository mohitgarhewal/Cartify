import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/data/products';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Collection() {
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);

  useEffect(() => {
    // Get category from URL query
    if (router.query.category) {
      setSelectedCategory(router.query.category);
    }
  }, [router.query]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured first
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, priceRange]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Product Collection',
    description: 'Browse our complete collection of quality products',
  };

  return (
    <Layout>
      <Head>
        <title>Collection - Cartify</title>
        <meta
          name="description"
          content="Browse our complete collection of quality products including electronics, clothing, accessories, and more."
        />
        <meta property="og:title" content="Product Collection - Cartify" />
        <meta
          property="og:description"
          content="Browse our complete collection of quality products"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 space-y-6">
              {/* Category Filter */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left px-4 py-2 rounded transition-colors ${
                        selectedCategory === category.slug
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="space-y-2">
                    <button
                      onClick={() => setPriceRange([0, 50])}
                      className="w-full text-left px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm transition-colors"
                    >
                      Under $50
                    </button>
                    <button
                      onClick={() => setPriceRange([50, 150])}
                      className="w-full text-left px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm transition-colors"
                    >
                      $50 - $150
                    </button>
                    <button
                      onClick={() => setPriceRange([150, 500])}
                      className="w-full text-left px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm transition-colors"
                    >
                      Over $150
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <span className="text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              {/* Products */}
              {filteredProducts.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">No products found matching your filters.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setPriceRange([0, 500]);
                    }}
                    className="mt-4 btn-outline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
