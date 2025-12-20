import { createBrowserRouter, Link } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AllProducts from "../pages/AllProducts/AllProducts";
import AboutUs from "../pages/AboutUs/AboutUs";
import Contact from "../pages/Contact/Contact";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";

// ⭐ NEW Import: Product Details Page ⭐


// Admin Imports
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import AllOrdersAdmin from "../pages/Dashboard/Admin/AllOrdersAdmin";
import AllProductsAdmin from "../pages/Dashboard/Admin/AllProductsAdmin";

// Manager Imports
import AddProduct from "../pages/Dashboard/Manager/AddProduct";
import ManageProducts from "../pages/Dashboard/Manager/ManageProducts";
import PendingOrders from "../pages/Dashboard/Manager/PendingOrders";
import ApprovedOrders from "../pages/Dashboard/Manager/ApprovedOrders";

// Global Imports
import UserProfile from "../pages/Dashboard/UserProfile/UserProfile";
import MyOrders from "../pages/Dashboard/User/MyOrders";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";
import TrackOrder from "../pages/Dashboard/User/TrackOrder";

// Route Guards
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import ManagerRoute from "./ManagerRoute";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
// Note: You will still need a UserRoute for Buyer-only pages later

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/all-products',
        Component: AllProducts,
      },
      // ⭐ NEW ROUTE: Product Details (Secured with PrivateRoute) ⭐
      {
        path: '/product/:id',
        element: <PrivateRoute>
          <ProductDetails></ProductDetails>
        </PrivateRoute>,
      },
      {
        path: '/about',
        Component: AboutUs,
      },
      {
        path: '/contact',
        Component: Contact,
      },
    ]
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: 'dashboard',
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },

      // ------------------------------------
      // GLOBAL ROUTES (accessible by all roles)
      // ------------------------------------
      {
        path: 'profile', // SINGLE, GLOBAL PROFILE ROUTE
        Component: UserProfile, // NO special role guard needed if wrapped by PrivateRoute
      },
      {
        path: 'my-orders',
        Component: MyOrders,
      },
      {
        path: 'payment-success',
        Component: PaymentSuccess,
      },
      {
        path: 'payment-cancelled',
        Component: PaymentCancelled,
      },

      // ------------------------------------
      // ADMIN RELATED ROUTES
      // ------------------------------------
      {
        path: 'manage-users',
        element: <AdminRoute>
          <ManageUsers></ManageUsers>
        </AdminRoute>
      },
      {
        path: 'all-products-admin', // Admin's view of all products
        element: <AdminRoute>
          <AllProductsAdmin></AllProductsAdmin>
        </AdminRoute>
      },
      {
        path: 'all-orders-admin', // Admin's view of all orders
        element: <AdminRoute>
          <AllOrdersAdmin></AllOrdersAdmin>
        </AdminRoute>
      },


      // ------------------------------------
      // MANAGER RELATED ROUTES (4 total)
      // ------------------------------------
      {
        path: 'add-product',
        element: <ManagerRoute>
          <AddProduct></AddProduct>
        </ManagerRoute>,
      },
      {
        path: 'manage-products',
        element: <ManagerRoute>
          <ManageProducts></ManageProducts>
        </ManagerRoute>,
      },
      {
        path: 'pending-orders',
        element: <ManagerRoute>
          <PendingOrders></PendingOrders>
        </ManagerRoute>,
      },
      {
        path: 'approved-orders',
        element: <ManagerRoute>
          <ApprovedOrders></ApprovedOrders>
        </ManagerRoute>,
      },

      // ------------------------------------
      // USER/BUYER RELATED ROUTES (To be added later)
      // ------------------------------------
      {
        path: 'track-order',
        element: (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
              <p className="text-gray-600 mb-4">Please select an order from your orders list to track its progress.</p>
              <Link to="/dashboard/my-orders" className="btn btn-primary">
                View My Orders
              </Link>
            </div>
          </div>
        ),
      },
      {
        path: 'track-order/:orderId',
        Component: TrackOrder,
      }
    ]
  },
]);