import React from "react";
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
  } = useForm();

  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("in the login page", location);

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
    console.log("form data", data);
    signInUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);

        // 3. Implement the success toast here
        showSuccessToast("Login Successful!", () => {
          // ⭐ Navigation is now INSIDE the callback function.
          // This function runs after the 1500ms timer is complete.
          navigate(location?.state || "/");
        });

      })
      .catch((error) => {
        console.log(error);
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
    <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
      <h3 className="text-3xl text-center py-3">Welcome Back!</h3>
      <p className="text-center">Please login</p>
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
  );
};

export default Login;