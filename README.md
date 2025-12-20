# Garments Order Production Tracker System - Client

A comprehensive garments order and production management system built with React. This application enables buyers to place orders, managers to handle production, and administrators to oversee the entire operation.

## Features

### Authentication & Authorization
- Email and Google authentication
- Role-based access control (Admin, Manager, Buyer)
- User profile management with photo upload
- Account suspension system

### Buyer Features
- Browse all garments products with search and category filters
- View detailed product information with image gallery
- Place orders with quantity customization
- Track order status in real-time
- Manage personal orders
- Submit product feedback and ratings
- View order history

### Manager Features
- Add new products with multiple images
- Edit and delete products
- Manage pending orders (approve/reject)
- View approved orders
- Track production status
- Upload product feature images to ImgBB

### Admin Features
- Manage all users (promote, demote, suspend)
- View all products with search functionality
- Update product details including pricing
- Toggle "Show on Home" for featured products
- Delete products
- View all orders across the system
- Track order statistics
- Comprehensive dashboard with metrics

### General Features
- Dynamic page titles with react-helmet-async
- Dark/light mode toggle
- Responsive design for all devices
- Loading states and error handling
- 404 Not Found page
- Animated UI with Framer Motion
- Toast notifications with SweetAlert2
- Image upload integration with ImgBB
- Real-time data updates with TanStack Query

## Technologies

### Core
- **React** v19.2.3 - UI library
- **Vite** v6.2.3 - Build tool and dev server
- **React Router** v7.1.3 - Client-side routing

### State Management & Data Fetching
- **TanStack Query** v4.36.1 - Server state management
- **React Hook Form** v7.68.0 - Form state management
- **Axios** v1.7.9 - HTTP client

### Styling
- **Tailwind CSS** v4.1.17 - Utility-first CSS
- **DaisyUI** v5.5.8 - Component library
- **Framer Motion** v12.0.2 - Animation library

### UI Components & Icons
- **React Icons** v5.5.0 - Icon library
- **Lottie React** v2.4.0 - Animation player
- **SweetAlert2** v11.15.10 - Beautiful alerts

### SEO & Meta
- **react-helmet-async** v2.0.5 - Dynamic page titles

### Authentication
- **Firebase** v11.1.0 - Authentication and hosting

### Development Tools
- **ESLint** v9.18.0 - Code linting
- **PostCSS** v8.4.49 - CSS processing

## Environment Variables

Create a `.env` file in the root directory:

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

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/garments-order-production-tracker-system-client.git
   cd garments-order-production-tracker-system-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   Note: If you encounter peer dependency issues with React 19, use:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory
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

## Project Structure

```
src/
├── assets/           # Static assets (images, JSON files)
├── components/       # Reusable components
│   ├── Forbidden/    # Access denied component
│   ├── Loading/      # Loading spinner component
│   ├── Logo/         # App logo component
│   └── Shared/       # Shared components (Navbar, Footer)
├── context/          # React Context providers
│   └── AuthContext/  # Authentication context
├── firebase/         # Firebase configuration
├── hooks/            # Custom React hooks
│   ├── useAuth.jsx   # Authentication hook
│   ├── useAxios.jsx  # Axios instance hook
│   ├── useAxiosSecure.jsx  # Secure axios with auth
│   └── useRole.jsx   # User role hook
├── Layouts/          # Layout components
│   ├── AuthLayout.jsx      # Authentication pages layout
│   ├── DashboardLayout.jsx # Dashboard layout
│   └── RootLayout.jsx      # Main app layout
├── pages/            # Page components
│   ├── AboutUs/      # About page
│   ├── AllProducts/  # Products listing page
│   ├── Auth/         # Login/Register pages
│   ├── Contact/      # Contact page
│   ├── Dashboard/    # Dashboard pages
│   │   ├── Admin/    # Admin-specific pages
│   │   ├── Manager/  # Manager-specific pages
│   │   └── User/     # User/Buyer pages
│   ├── Home/         # Homepage sections
│   ├── NotFound/     # 404 page
│   └── ProductDetails/  # Product detail page
├── routes/           # Route configuration
│   ├── AdminRoute.jsx    # Admin route guard
│   ├── ManagerRoute.jsx  # Manager route guard
│   ├── PrivateRoute.jsx  # Auth route guard
│   └── router.jsx        # Main router config
├── App.jsx           # Root component
└── main.jsx          # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features Implementation

### Role-Based Access Control
The application implements three user roles with different permissions:
- **Buyer**: Can view products and place orders
- **Manager**: Can manage products and orders
- **Admin**: Full system access including user management

### Image Upload
Products support:
- Feature image (main product image)
- Multiple product images (gallery)
- Images uploaded to ImgBB for reliable hosting

### Order Tracking
Buyers can track their orders through various states:
- Pending (awaiting manager approval)
- Approved (confirmed by manager)
- In Production (being manufactured)
- Shipped (on the way to buyer)
- Delivered (completed)

### Product Management
- Search products by name
- Filter by category (Shirt, Pant, Jacket, Panjabi, Sharee, Three Piece, Kurti, Others)
- Toggle visibility on homepage
- Full CRUD operations for managers/admins

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is an educational project. Contributions, issues, and feature requests are welcome!

## License

This project is for educational purposes as part of Programming Hero curriculum.

## Contact

For any queries, please reach out through the contact page on the application.

---

**Note**: Make sure the backend server is running before starting the client application.
