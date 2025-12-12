import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const location = useLocation();
    const navigate = useNavigate();

    const { registerUser, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();

    const handleRegistration = (data) => {
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
            .then(() => {
                // 1. store the image in form data
                const formData = new FormData();
                formData.append("image", profileImg);

                // 2. send the photo to store and get the url
                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
                axios.post(image_API_URL, formData).then((res) => {
                    const photoURL = res.data.data.url;

                    //create user in the database
                    const userInfo = {
                        email: data.email,
                        name: data.name,
                        photoURL: photoURL,
                        // ADDED: Role from form input
                        role: data.role,
                        // ADDED: Default status as 'pending'
                        status: "pending",
                    };

                    axiosSecure.post("/users", userInfo).then((res) => {
                        if (res.data.insertedId) {
                            console.log("user created in database");
                            // You can add your success toast/sweet alert here
                        }
                    });

                    // update user profile user to firebase
                    const userProfile = {
                        displayName: data.name,
                        photoURL: photoURL,
                    };

                    updateUserProfile(userProfile)
                        .then(() => {
                            console.log("user profile update done");
                            navigate(location.state || "/");
                        })
                        .catch();
                });
            })
            .catch((error) => {
                console.log(error);
                // You can add your error toast/sweet alert here
            });
    };

    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className="text-3xl text-center py-3">Create an account</h3>
            <p className="text-center">Please Register</p>
            <div className="card-body">
                <form onSubmit={handleSubmit(handleRegistration)}>
                    <fieldset className="fieldset">
                        {/* name*/}
                        <label className="label">Name</label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            className="input"
                            placeholder="Name"
                        />
                        {errors.name?.type === "required" && (
                            <p className="text-red-500">Name is required</p>
                        )}
                        {/* photo*/}
                        <label className="label">Photo</label>
                        <input
                            type="file"
                            {...register("photo", { required: true })}
                            className="file-input "
                            placeholder="Photo"
                        />
                        {errors.photo?.type === "required" && (
                            <p className="text-red-500">Photo is required</p>
                        )}
                        {/* email*/}
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

                        {/* Role (ADDED)*/}
                        <label className="label">Role</label>
                        <select
                            {...register("role", { required: true })}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select Role</option>
                            <option value="buyer">Buyer</option>
                            <option value="manager">Manager</option>
                        </select>
                        {errors.role?.type === "required" && (
                            <p className="text-red-500">Role is required</p>
                        )}

                        {/* password*/}
                        <label className="label">Password</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: true,
                                minLength: 6,
                                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
                            })}
                            className="input"
                            placeholder="Password"
                        />
                        {errors.password?.type === "required" && (
                            <p className="text-red-500">Password required</p>
                        )}
                        {errors.password?.type === "minLength" && (
                            <p className="text-red-500">
                                Password must be 6 characters or more
                            </p>
                        )}
                        {errors.password?.type === "pattern" && (
                            <p className="text-red-500">
                                Password must include: one uppercase, one lowercase, one number, and one special character.
                            </p>
                        )}

                        <div>
                            <a className="link link-hover">Forgot password?</a>
                        </div>

                        <button className="btn btn-neutral mt-4">Register</button>
                    </fieldset>
                    <p>
                        Already have an account? <Link
                            state={location.state}
                            to="/login"
                            className="text-primary underline"
                        > Login
                        </Link>
                    </p>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Register;