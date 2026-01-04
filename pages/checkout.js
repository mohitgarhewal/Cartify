import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/apiClient';
import { getToken } from '@/lib/auth';
import { isLoggedIn } from '@/lib/auth'; // Import auth utility
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useCart } from '@/lib/CartContext';
import { motion } from 'framer-motion';

export default function Checkout() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    // Protect this route: redirect to login if not authenticated
    if (!isLoggedIn()) {
      // Interview: Protects checkout, only logged-in users can access
      router.replace('/account/login');
      return;
    }
    // Existing logic: redirect to cart if cart is empty
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart.length, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Integrate checkout with backend: send order data to backend
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Prepare order data
      const orderData = {
        ...formData,
        items: cart,
        total: getCartTotal(),
      };
      // Send order to backend, include auth token
      await apiRequest("/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(orderData),
      });
      clearCart();
      router.push("/");
    } catch (err) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Show error if checkout fails
  return (
    <Layout>
      <Head>
        <title>Checkout - Cartify</title>
        <meta name="description" content="Complete your purchase" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}
        {loading && (
          <div className="mb-4 text-blue-600 text-center">Processing order...</div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="your@email.com"
                    />
                  </div>
                </motion.div>

                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                      </select>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ This is a demo. Do not enter real payment information.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-lg shadow-sm p-6 sticky top-24"
                >
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.cartItemId} className="flex gap-3">
                        <div className="relative w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                          <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-sm">{item.name}</p>
                          {item.selectedColor && (
                            <p className="text-xs text-gray-600">
                              {item.selectedColor}
                            </p>
                          )}
                          {item.selectedSize && (
                            <p className="text-xs text-gray-600">{item.selectedSize}</p>
                          )}
                          <p className="text-sm font-semibold text-primary-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full btn-primary mt-6"
                  >
                    Place Order
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By placing your order, you agree to our terms and conditions.
                  </p>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
