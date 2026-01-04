# Cartify 🛒

A modern, full-stack e-commerce web application built with Next.js and Supabase. Cartify delivers a complete shopping experience with secure authentication, user profile management, cart functionality, and order handling—all powered by Supabase's PostgreSQL database and Row Level Security.

## 🌐 Live Demo

[View Live Demo](https://your-deployed-app.vercel.app) *(Replace with your actual Vercel URL)*

## ✨ Key Features

- 🔐 **Google OAuth Authentication** - Secure, one-click login with Google
- 📧 **Email Verification** - Account confirmation via email before access
- 👤 **User Profile** - Personalized profile page with account details
- 🛒 **Shopping Cart** - Add, remove, and manage cart items with persistence
- 📦 **Order Management** - Complete checkout flow and order history
- 🔒 **Row Level Security (RLS)** - Database-level security policies protecting user data
- 🚪 **Session Management** - Secure logout with session cleanup
- 📱 **Responsive Design** - Optimized for all devices
- ⚡ **Fast Performance** - Server-side rendering with Next.js

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework with pages router
- **React** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Backend
- **Node.js/Express** - Backend API server
- **Supabase Client** - Backend integration with Supabase

### Authentication & Database
- **Supabase Auth** - Authentication service with Google OAuth
- **Supabase (PostgreSQL)** - Database with Row Level Security
- **Google OAuth 2.0** - Social login provider

### Hosting & Deployment
- **Vercel** - Frontend and serverless functions
- **Supabase Cloud** - Database and authentication hosting

## 🔐 Authentication & Security

### Email Verification
New users must verify their email address before gaining access to protected features. Supabase automatically sends confirmation emails upon registration.

### Google OAuth
Users can authenticate using their Google account, providing a seamless and secure login experience without managing passwords.

### Row Level Security (RLS)
Supabase RLS policies ensure that:
- Users can only access their own cart items
- Users can only view their own orders
- Profile data is isolated per user
- All database queries are automatically filtered by user identity

### Session Management
- Sessions are securely stored and managed by Supabase
- Logout functionality clears both client and server sessions
- Automatic session refresh on page load

## 📋 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Frontend (Next.js)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=
```

### Backend (Express)
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PORT=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Note:** Never commit your `.env` files to version control. Add `.env*` to your `.gitignore`.

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- Google Cloud Console project (for OAuth)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/cartify.git
cd cartify
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### Step 4: Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to Project Settings > API to get your credentials
3. Enable Google OAuth in Authentication > Providers
4. Set up your database tables and RLS policies (see Database Schema section)

### Step 5: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs from Supabase Auth settings
6. Copy Client ID and Client Secret to your environment variables

### Step 6: Configure Environment Variables

Create `.env.local` in the root directory and `backend/.env` with your credentials from Supabase and Google.

### Step 7: Run the Development Servers

**Frontend (Next.js):**
```bash
npm run dev
```

**Backend (Express):**
```bash
cd backend
npm run dev
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000` (or your configured port).

### Step 8: Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on each push to main branch

### Backend Deployment

Deploy the Express backend to any Node.js hosting service:
- **Vercel** (serverless functions)
- **Railway**
- **Render**
- **Heroku**

Update `NEXT_PUBLIC_API_URL` to point to your deployed backend URL.

### Supabase Configuration

1. Ensure your Supabase project is in production mode
2. Add your production domain to Supabase Auth > URL Configuration
3. Update Google OAuth redirect URIs with production URLs

## 📁 Folder Structure

```
Cartify/
├── backend/                # Express backend API
│   ├── routes/            # API route handlers
│   ├── supabaseClient.js  # Supabase configuration
│   ├── cors.js            # CORS configuration
│   └── index.js           # Server entry point
├── components/            # React components
│   ├── Layout.js          # Main layout wrapper
│   └── ProductCard.js     # Product display card
├── hooks/                 # Custom React hooks
│   └── useAuth.js         # Authentication hook
├── lib/                   # Utilities and contexts
│   ├── supabaseClient.js  # Frontend Supabase client
│   ├── auth.js            # Auth helper functions
│   ├── apiClient.js       # API request utilities
│   └── CartContext.js     # Cart state management
├── pages/                 # Next.js pages
│   ├── account/           # Login and registration
│   ├── api/               # API routes
│   ├── auth/              # OAuth callback
│   ├── product/           # Product pages
│   ├── index.js           # Home page
│   ├── profile.js         # User profile
│   ├── cart.js            # Shopping cart
│   └── checkout.js        # Checkout page
├── styles/                # CSS styles
│   └── globals.css        # Global styles
└── .env.local             # Environment variables (not committed)
```

## 🔮 Future Improvements

- ✅ Payment integration (Stripe/PayPal)
- ✅ Admin dashboard for product and order management
- ✅ Product reviews and ratings
- ✅ Wishlist functionality
- ✅ Email notifications for order updates
- ✅ Advanced product search and filtering
- ✅ Inventory management system
- ✅ Multi-language support
- ✅ Customer support chat

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

---

**Built with ❤️ using Next.js and Supabase**
