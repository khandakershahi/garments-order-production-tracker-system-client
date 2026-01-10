# Garments Order Production Tracker System - Client

A comprehensive garments order and production management system built with React. This application enables buyers to place orders, managers to handle production, and administrators to oversee the entire operation.

🔗 **Live Demo**: [https://garments-order-production-tracker-s-six.vercel.app](https://garments-order-production-tracker-s-six.vercel.app)

## 🎯 Demo Accounts

- **Admin**: `admin@test.com` / `123456Ab@`
- **Manager**: `a@test.com` / `123456Ab@`
- **Buyer**: `a@test.com` / `123456Ab@`

## ✨ Features

### 🔐 Authentication & Authorization
- Email and Google authentication with Firebase
- Role-based access control (Admin, Manager, Buyer)
- User profile management with photo upload
- Profile update functionality
- Account suspension system with feedback
- Demo login buttons for easy testing

### 🛒 Buyer Features
- Browse products with advanced filtering (search, category, price range)
- Multiple sorting options (newest, price, name)
- View detailed product information with image gallery
- Place orders with quantity customization
- Real-time order tracking with status updates
- Manage personal orders dashboard
- Submit product feedback and ratings
- View order history with pagination

### 👔 Manager Features
- Add new products with multiple images
- Edit and delete products
- Manage pending orders (approve/reject with feedback)
- View approved orders
- Track production status
- Upload product images to ImgBB
- Product inventory management

### 👨‍💼 Admin Features
- Comprehensive user management (promote, demote, suspend)
- Suspend users with reason and feedback
- View all products with search functionality
- Update product details including pricing
- Toggle "Show on Home" for featured products
- Delete products with confirmation
- View all orders across the system
- Track order statistics and metrics
- Full system overview dashboard

### 🎨 UI/UX Features
- **11 Home Page Sections**: Hero, Categories, Products, Features, How It Works, Highlights, Statistics, Testimonials, Trust Badges, Newsletter, CTA
- Dynamic page titles with react-helmet-async
- Dark/light mode toggle
- Fully responsive design for all devices
- Scroll-to-top button site-wide
- Loading states and error handling
- Custom 404 Not Found page
- Smooth animations with Framer Motion
- Beautiful toast notifications with SweetAlert2
- Sticky navigation bars
- Interactive map on Contact page (Leaflet)

### 📄 Additional Pages
- About Us with company stats
- Contact page with map integration
- FAQ page with collapsible questions
- Help Center with topic cards
- Privacy Policy
- Terms & Conditions

### 🔍 Advanced Filtering & Search
- **Search**: Real-time product search
- **Category Filter**: 8 product categories
- **Price Range Filter**: Under $50, $50-$100, $100-$200, $200-$500, $500+
- **Sorting**: Newest, Oldest, Price (Low to High), Price (High to Low), Name (A-Z, Z-A)
- **Pagination**: Smooth navigation through products

### 💳 Payment Integration
- Stripe payment gateway integration
- Payment success/cancellation handling
- Payment history tracking

## 🛠 Technologies

### Core
- **React** v19.2.3 - UI library
- **Vite** v7.2.4 - Build tool and dev server
- **React Router** v7.10.1 - Client-side routing

### State Management & Data Fetching
- **TanStack Query** v4.36.1 - Server state management
- **React Hook Form** v7.68.0 - Form state management
- **Axios** v1.7.9 - HTTP client

### Styling & Animation
- **Tailwind CSS** v4.1.17 - Utility-first CSS
- **DaisyUI** v5.5.8 - Component library
- **Framer Motion** v12.0.2 - Animation library
- **React Countup** v6.5.3 - Animated counters
- **React Intersection Observer** v9.16.1 - Scroll animations

### UI Components & Icons
- **React Icons** v5.5.0 - Icon library
- **Lottie React** v2.4.0 - Animation player
- **SweetAlert2** v11.15.10 - Beautiful alerts
- **Leaflet** v1.9.4 - Interactive maps
- **React-Leaflet** v5.0.0 - React wrapper for Leaflet

### SEO & Meta
- **react-helmet-async** v2.0.5 - Dynamic page titles

### Authentication
- **Firebase** v11.1.0 - Authentication and hosting

### Payment
- **Stripe** - Payment processing

### Development Tools
- **ESLint** v9.18.0 - Code linting
- **PostCSS** v8.4.49 - CSS processing

## 📦 Environment Variables

Create a `.env.local` file for development and `.env.production` for production:

```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_image_host_key=your_imgbb_api_key
VITE_API_URL=http://localhost:5000
```

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/khandakershahi/garments-order-production-tracker-system-client.git
   cd garments-order-production-tracker-system-client
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   Note: Use `--legacy-peer-deps` for React 19 compatibility

3. **Configure environment variables**
   - Create `.env.local` and `.env.production` files
   - Add all required environment variables (see above)

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Application will open at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── assets/              # Static assets (images, JSON files)
├── components/          # Reusable components
│   ├── Forbidden/       # Access denied component
│   ├── Loading/         # Loading spinner component
│   ├── Logo/            # App logo component
│   ├── ScrollToTop/     # Scroll to top button
│   └── Shared/          # Shared components (Navbar, Footer)
├── context/             # React Context providers
│   └── AuthContext/     # Authentication context
├── firebase/            # Firebase configuration
├── hooks/               # Custom React hooks
│   ├── useAuth.jsx      # Authentication hook
│   ├── useAxios.jsx     # Axios instance hook
│   ├── useAxiosSecure.jsx  # Secure axios with auth
│   └── useRole.jsx      # User role hook
├── Layouts/             # Layout components
│   ├── AuthLayout.jsx   # Authentication pages layout
│   ├── DashboardLayout.jsx # Dashboard layout
│   └── RootLayout.jsx   # Main app layout
├── pages/               # Page components
│   ├── AboutUs/         # About page
│   ├── AllProducts/     # Products listing with filters
│   ├── Auth/            # Login/Register pages
│   ├── Contact/         # Contact page with map
│   ├── FAQ/             # FAQ page
│   ├── HelpCenter/      # Help center page
│   ├── PrivacyPolicy/   # Privacy policy page
│   ├── TermsConditions/ # Terms & conditions page
│   ├── Dashboard/       # Dashboard pages
│   │   ├── Admin/       # Admin-specific pages
│   │   ├── Manager/     # Manager-specific pages
│   │   ├── User/        # User/Buyer pages
│   │   ├── Payment/     # Payment pages
│   │   └── UserProfile/ # User profile page
│   ├── Home/            # Homepage sections
│   │   ├── Hero/        # Hero slider
│   │   ├── Categories/  # Product categories
│   │   ├── ProductsSection/ # Featured products
│   │   ├── Features/    # Features section
│   │   ├── HowItWorks/  # How it works
│   │   ├── Highlights/  # Highlights section
│   │   ├── Statistics/  # Animated statistics
│   │   ├── Feedback/    # Testimonials
│   │   ├── TrustBadges/ # Trust badges
│   │   ├── Newsletter/  # Newsletter signup
│   │   └── CTABanner/   # Call to action
│   ├── NotFound/        # 404 page
│   └── ProductDetails/  # Product detail page
├── routes/              # Route configuration
│   ├── AdminRoute.jsx   # Admin route guard
│   ├── ManagerRoute.jsx # Manager route guard
│   ├── PrivateRoute.jsx # Auth route guard
│   └── router.jsx       # Main router config
├── App.jsx              # Root component
└── main.jsx             # App entry point
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Key Features Implementation

### Role-Based Access Control
The application implements three user roles with different permissions:
- **Buyer**: Can view products, place orders, and track deliveries
- **Manager**: Can manage products and approve/reject orders
- **Admin**: Full system access including user management and system configuration

### Advanced Product Filtering
- **Search**: Real-time search across product names and descriptions
- **Category**: Filter by 8 garment categories
- **Price Range**: 5 price brackets from under $50 to $500+
- **Sorting**: 6 sorting options for customized product display
- **Pagination**: Efficient navigation through large product catalogs

### Image Upload & Management
Products support:
- Feature image (main product image)
- Multiple product images (gallery view)
- Images uploaded to ImgBB for reliable CDN hosting
- Image preview before upload

### Order Tracking System
Complete order lifecycle management:
1. **Pending** - Order placed, awaiting manager approval
2. **Approved** - Manager confirmed the order
3. **In Production** - Order being manufactured
4. **Shipped** - Order dispatched to buyer
5. **Delivered** - Order completed successfully

### User Profile Management
- Update display name and photo URL
- Real-time profile updates in both Firebase and MongoDB
- Secure endpoint ensuring users can only update their own profile
- Success/error feedback with SweetAlert2

### Payment Integration
- Stripe checkout integration
- Secure payment processing
- Payment success/cancellation handling
- Payment history tracking in database

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is an educational project. Contributions, issues, and feature requests are welcome!

## 📄 License

This project is for educational purposes as part of Programming Hero curriculum.

## 📞 Contact

- **Portfolio**: [khandakershahi.com](https://khandakershahi.com)
- **GitHub**: [@khandakershahi](https://github.com/khandakershahi)
- **LinkedIn**: [khandaker-shahi](https://linkedin.com/in/khandaker-shahi)

---

**Note**: Make sure the backend server is running before starting the client application. Backend repository: [garments-order-production-tracker-system-server](https://github.com/khandakershahi/garments-order-production-tracker-system-server)
