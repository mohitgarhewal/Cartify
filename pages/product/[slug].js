import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { products } from '@/data/products';
import { useCart } from '@/lib/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { addToCart } = useCart();

  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <button onClick={() => router.push('/collection')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    // Validate selections
    if (product.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart(product, quantity, selectedColor, selectedSize);
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    if (product.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedColor, selectedSize);
    router.push('/checkout?source=buy-now');
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };

  return (
    <Layout>
      <Head>
        <title>{product.name} - Cartify</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-8">
            <a href="/" className="hover:text-primary-600">Home</a>
            <span className="mx-2">/</span>
            <a href="/collection" className="hover:text-primary-600">Collection</a>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </nav>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative h-96 lg:h-full bg-gray-200 rounded-lg overflow-hidden"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>

              {/* Product Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 fill-current'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-4xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </div>

                <p className="text-gray-600 leading-relaxed">{product.description}</p>

                <div className="border-t border-b py-6 space-y-4">
                  {/* Color Selection */}
                  {product.colors.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Color: {selectedColor && <span className="text-primary-600">{selectedColor}</span>}
                      </label>
                      <div className="flex gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                              selectedColor === color
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {product.sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Size: {selectedSize && <span className="text-primary-600">{selectedSize}</span>}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                              selectedSize === size
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                      product.inStock
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </motion.button>

                  {product.inStock && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      className="w-full py-4 rounded-lg font-semibold text-lg transition-colors bg-white border border-primary-600 text-primary-600 hover:bg-primary-50"
                    >
                      Buy Now
                    </motion.button>
                  )}

                  {/* Added to Cart Notification */}
                  <AnimatePresence>
                    {showAddedToCart && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-500 text-white px-4 py-3 rounded-lg text-center font-semibold"
                      >
                        ✓ Added to cart!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Product Info */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter((p) => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => {
                  const ProductCard = require('@/components/ProductCard').default;
                  return <ProductCard key={relatedProduct.id} product={relatedProduct} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
