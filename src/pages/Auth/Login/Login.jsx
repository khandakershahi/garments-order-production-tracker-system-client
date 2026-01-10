import React from "react";
import { Helmet } from 'react-helmet-async';
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
// 1. IMPORT SWEETALERT2
import Swal from 'sweetalert2';
// You might need to import the CSS depending on your setup:
// import 'sweetalert2/dist/sweetalert2.min.css'; 

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Demo credentials
  const demoAccounts = [
    { email: "admin@test.com", password: "123456Ab@", role: "Admin" },
    { email: "a@test.com", password: "123456Ab@", role: "Manager" },
    { email: "b@test.com", password: "123456Ab@", role: "Buyer" },
  ];

  // Auto-fill function
  const handleDemoLogin = (email, password) => {
    setValue("email", email);
    setValue("password", password);
  };

  // Function to show a small success toast, now accepts a callback
  const showSuccessToast = (titleText, callback) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: titleText,
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'swal2-toast-custom',
        icon: 'swal2-icon-custom'
      },
      // ⭐ THIS IS THE KEY CHANGE: Execute callback when the timer closes the toast
      willClose: () => {
        if (callback && typeof callback === 'function') {
          callback();
        }
      }
    });
  }

  const handleLogin = (data) => {
    signInUser(data.email, data.password)
      .then((result) => {
        // 3. Implement the success toast here
        showSuccessToast("Login Successful!", () => {
          // ⭐ Navigation is now INSIDE the callback function.
          // This function runs after the 1500ms timer is complete.
          navigate(location?.state || "/");
        });

      })
      .catch((error) => {
        // Add an error toast here for failed login attempts
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message || 'Invalid email or password.',
          confirmButtonText: 'Try Again'
        });
      });
  };


  return (
    <>
      <Helmet>
        <title>Login - Garments Order Tracker</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen">
    <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
      <h3 className="text-2xl md:text-3xl text-center py-3 font-bold">Welcome Back!</h3>
      <p className="text-center">Please login</p>
      
      {/* Demo Login Section */}
      <div className="px-8 pt-4">
        <div className="alert bg-base-200 py-2 border border-base-300">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">🎯 Demo Accounts</span>
            </div>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  className="btn btn-sm btn-outline w-full justify-between"
                >
                  <span className="text-xs">{account.role}</span>
                  <span className="text-xs opacity-70">{account.email}</span>
                </button>
              ))}
            </div>
            <p className="text-xs mt-2 opacity-70">Click to auto-fill credentials</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} className="card-body">
        <fieldset className="fieldset">
          {/* email */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input"
            placeholder="Email"
          />

          {errors.email?.type === "required" && (
            <p className="text-red-500">Email is required</p>
          )}
          {/* password*/}
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">
              Password must be 6 charecter or longer
            </p>
          )}
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
        <p>
          New to THIRTEEN CLOTHING? <Link
            state={location.state}
            to="/register"
            className="text-primary underline"
          > Register Now
          </Link>
        </p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  </div>
    </>
  );
};

export default Login;