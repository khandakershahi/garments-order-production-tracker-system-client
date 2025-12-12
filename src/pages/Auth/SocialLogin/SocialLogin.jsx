import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
// Since error toast is handled here, we import Swal
import Swal from 'sweetalert2';

// Receive 'showToast' as a prop from the parent component (Login or Register)
const SocialLogin = ({ showToast }) => {
    const { signInGoogle } = useAuth();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;
    const buttonAction = currentPath.includes('/register') ? 'Register' : 'Login';
    const toastMessage = `${buttonAction} Successful!`;


    const handleGoogleSignIn = () => {
        signInGoogle()
            .then((result) => {
                const isNewUser = buttonAction === 'Register';

                // 1. Define navigation callback (to be executed after toast timer)
                const navigateCallback = () => {
                    navigate(location.state || "/");
                };

                if (isNewUser) {
                    // Logic for registration/first-time login
                    const defaultRole = "buyer";
                    const defaultStatus = "pending";

                    const userInfo = {
                        email: result.user.email,
                        name: result.user.displayName,
                        photoURL: result.user.photoURL,
                        role: defaultRole,
                        status: defaultStatus,
                    };

                    axiosSecure.post("/users", userInfo).then((res) => {
                        console.log("User data processed by server:", res.data);

                        // 2. Show toast with the delayed navigation callback
                        if (showToast) {
                            showToast(toastMessage, navigateCallback);
                        } else {
                            // Fallback (instant navigation if showToast wasn't passed, though unlikely now)
                            navigateCallback();
                        }
                    });
                } else {
                    // Logic for successful login (existing user)

                    // 2. Show toast with the delayed navigation callback
                    if (showToast) {
                        showToast(toastMessage, navigateCallback);
                    } else {
                        navigateCallback();
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                // Handle social login error toast
                Swal.fire({
                    icon: 'error',
                    title: `${buttonAction} Failed`,
                    text: error.message || 'Social sign-in failed.',
                    confirmButtonText: 'Try Again'
                });
            });
    };

    return (
        <div className="text-center pb-8">
            <p className="mb-2">Or</p>
            {/* Google */}
            <button
                onClick={handleGoogleSignIn}
                className="btn bg-white text-black border-[#e5e5e5]"
            >
                <svg
                    aria-label="Google logo"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                >
                    <g>
                        <path d="m0 0H512V512H0" fill="#fff"></path>
                        <path
                            fill="#34a853"
                            d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                        ></path>
                        <path
                            fill="#4285f4"
                            d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                        ></path>
                        <path
                            fill="#fbbc02"
                            d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                        ></path>
                        <path
                            fill="#ea4335"
                            d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                        ></path>
                    </g>
                </svg>
                {buttonAction} with Google
            </button>
        </div>
    );
};

export default SocialLogin;