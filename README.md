# Cartify 🛒

A modern, fully-responsive e-commerce frontend built with Next.js, TailwindCSS, and Framer Motion. This project features a complete shopping experience with product browsing, filtering, cart management, and checkout UI.

## ✨ Features

- 🏠 **Home Page** - Hero section, featured products, and promotional banners
- 📦 **Product Collection** - Browse all products with advanced filtering and sorting
- 🔍 **Product Details** - Individual product pages with variant selection
- 🛒 **Shopping Cart** - Full cart functionality with localStorage persistence
- 💳 **Checkout UI** - Complete checkout flow (UI only, no payment processing)
- 👤 **Account Pages** - Login and registration forms (UI only)
- 🎨 **Responsive Design** - Mobile-first design that works on all devices
- ⚡ **Smooth Animations** - Powered by Framer Motion
- 🔎 **SEO Optimized** - Meta tags and JSON-LD structured data
- 📱 **Progressive Enhancement** - Fast loading and great user experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mohitgarhewal/Cartify.git
cd Cartify
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
Cartify/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout with header and footer
│   └── ProductCard.js  # Product card component
├── data/               # Static data and seed files
│   └── products.js     # Product data
├── lib/                # Utility functions and contexts
│   └── CartContext.js  # Cart state management
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── account/       # Account pages (login/register)
│   ├── product/       # Product detail pages
│   ├── index.js       # Home page
│   ├── collection.js  # Products listing page
│   ├── cart.js        # Shopping cart page
│   ├── checkout.js    # Checkout page
│   └── 404.js         # Custom 404 page
├── public/            # Static assets
├── styles/            # Global styles
│   └── globals.css    # Tailwind and custom CSS
└── next.config.js     # Next.js configuration
```

## 🎯 Key Features Explained

### Cart Management

The cart uses React Context API with localStorage for persistence:
- Add/remove items
- Update quantities
- Persist cart across sessions
- Real-time cart count in navigation

### Product Filtering

Filter products by:
- Category
- Price range
- Sort by price, rating, or name

### Animations

Smooth animations using Framer Motion:
- Page transitions
- Add to cart animations
- Hover effects
- Scroll animations

### Mock API Routes

The project includes mock API routes for demonstration:
- `GET /api/products` - List all products with filters
- `GET /api/products/[slug]` - Get single product
- `POST /api/orders` - Create order (mock)

## 🔧 Technologies Used

- **Next.js 14** - React framework with pages router
- **React 18** - UI library
- **TailwindCSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **JavaScript** - Programming language (no TypeScript)

## 📱 Pages

1. **Home (/)** - Landing page with hero and featured products
2. **Collection (/collection)** - All products with filters
3. **Product Detail (/product/[slug])** - Individual product pages
4. **Cart (/cart)** - Shopping cart
5. **Checkout (/checkout)** - Checkout form (UI only)
6. **Login (/account/login)** - Login page (UI only)
7. **Register (/account/register)** - Registration page (UI only)
8. **404** - Custom 404 error page

## 🔐 Note on Authentication & Payments

This is a **frontend demonstration project**. The authentication and payment forms are UI only and do not process real data. For a production application, you would need to:

- Implement proper backend authentication
- Integrate a payment gateway (Stripe, PayPal, etc.)
- Add server-side validation
- Implement security measures

## 🌐 Building a Full MERN Stack Application

To extend this frontend into a complete MERN (MongoDB, Express, React, Node.js) stack application, follow these steps:

### Backend Setup

1. **Initialize Node.js Backend**
```bash
mkdir cartify-backend
cd cartify-backend
npm init -y
```

2. **Install Backend Dependencies**
```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

3. **Create Express Server** (`server.js`)
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

4. **Create Models** (`models/`)

**User Model** (`models/User.js`)
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
```

**Product Model** (`models/Product.js`)
```javascript
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
  rating: Number,
  reviews: Number,
  inStock: { type: Boolean, default: true },
  colors: [String],
  sizes: [String],
});

module.exports = mongoose.model('Product', ProductSchema);
```

**Order Model** (`models/Order.js`)
```javascript
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
    selectedColor: String,
    selectedSize: String,
  }],
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  total: Number,
  status: { type: String, default: 'processing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
```

5. **Create API Routes** (`routes/`)

**Auth Routes** (`routes/auth.js`)
```javascript
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

6. **Environment Variables** (`.env`)
```
MONGODB_URI=mongodb://localhost:27017/cartify
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

7. **Connect Frontend to Backend**

Update your Next.js frontend to make API calls to the backend:

```javascript
// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const getProducts = async (filters) => {
  const queryString = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}/products?${queryString}`);
  return response.json();
};

export const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return response.json();
};
```

### Database Setup

1. **Install MongoDB**
   - Download and install MongoDB Community Server
   - Or use MongoDB Atlas (cloud database)

2. **Seed Database**
```javascript
// scripts/seed.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const products = require('../data/products');

mongoose.connect('mongodb://localhost:27017/cartify')
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Database seeded!');
    process.exit();
  });
```

Run: `node scripts/seed.js`

### Deployment

**Frontend (Vercel)**
```bash
npm install -g vercel
vercel
```

**Backend (Heroku, Railway, or Render)**
```bash
# Example with Heroku
heroku create cartify-backend
git push heroku main
```

**Database (MongoDB Atlas)**
1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Update .env with connection string

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ by Mohit Garhewal

## 🙏 Acknowledgments

- Product images from Unsplash
- Icons from Heroicons
- Inspiration from modern e-commerce platforms
