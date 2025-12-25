import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useCart } from '@/lib/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  return (
    <Layout>
      <Head>
        <title>Shopping Cart - Cartify</title>
        <meta name="description" content="Review your shopping cart and proceed to checkout" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-12 text-center"
            >
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <Link href="/collection">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.cartItemId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white rounded-lg shadow-sm p-6"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Link
                                href={`/product/${item.slug}`}
                                className="font-semibold text-lg hover:text-primary-600 transition-colors"
                              >
                                {item.name}
                              </Link>
                              <div className="text-sm text-gray-600 space-y-1 mt-1">
                                {item.selectedColor && (
                                  <div>Color: {item.selectedColor}</div>
                                )}
                                {item.selectedSize && (
                                  <div>Size: {item.selectedSize}</div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  updateQuantity(item.cartItemId, item.quantity - 1)
                                }
                                className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                              >
                                -
                              </button>
                              <span className="font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.cartItemId, item.quantity + 1)
                                }
                                className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Clear Cart Button */}
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                      </span>
                      <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">
                        {getCartTotal() > 50 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          '$9.99'
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary-600">
                          ${(getCartTotal() + (getCartTotal() > 50 ? 0 : 9.99)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {getCartTotal() < 50 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm">
                      <p className="text-yellow-800">
                        Add ${(50 - getCartTotal()).toFixed(2)} more for free shipping!
                      </p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full btn-primary mb-4"
                  >
                    Proceed to Checkout
                  </motion.button>

                  <Link href="/collection">
                    <button className="w-full btn-outline">Continue Shopping</button>
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>30-day returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Customer support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
