import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';
import Swal from 'sweetalert2';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase/firebase.init';

// --- 1. Helper Component to display role-specific text (DEFINED OUTSIDE) ---
// It accepts 'role' as a prop, as it no longer has access to useRole() directly
const RoleSpecificContent = ({ role }) => {
    let content;
    let badgeColor;

    switch (role) {
        case 'admin':
            content = "You have full system access. Manage users and global inventory visibility here.";
            badgeColor = "badge-error";
            break;
        case 'manager':
            content = "You are a Garment Manager. Manage your products, view pending orders, and update tracking details.";
            badgeColor = "badge-warning";
            break;
        case 'buyer':
        case 'user':
        default:
            content = "You are a valued Buyer. Check the status of your orders and update your contact information.";
            badgeColor = "badge-success";
            break;
    }

    return (
        <div className="text-center mt-6">
            <span className={`badge badge-lg ${badgeColor} text-white font-bold`}>
                Role: {role.toUpperCase()}
            </span>
            <p className="mt-3 text-lg text-base-content/80">{content}</p>
        </div>
    );
};


// --- 2. Main Profile Component Rendering ---
const UserProfile = () => {
    // 1. Get Authentication and Role Data
    const { user, loading: authLoading } = useAuth();
    const { role, roleLoading } = useRole();
    const axiosSecure = useAxiosSecure();

    // State for editing mode and form data
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        photoURL: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch user data including suspend status
    const { data: userData = null, isLoading: userDataLoading } = useQuery({
        queryKey: ['user-profile-data', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data;
        }
    });

    // Initialize form data when user data is available
    React.useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                photoURL: Array.isArray(user.photoURL) ? user.photoURL[0] : user.photoURL || ''
            });
        }
    }, [user]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsUpdating(true);

        try {
            // Update Firebase profile using auth.currentUser
            const currentUser = auth.currentUser;
            if (currentUser) {
                await updateProfile(currentUser, {
                    displayName: formData.displayName,
                    photoURL: formData.photoURL
                });
            }

            // Update in database
            await axiosSecure.patch(`/users/${user.email}`, {
                displayName: formData.displayName,
                photoURL: formData.photoURL
            });

            setIsEditing(false);
            setIsUpdating(false);
            
            // Show success message with reload callback
            await Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: 'Your profile has been successfully updated. The page will reload.',
                confirmButtonColor: '#10b981',
                timer: 2000,
                showConfirmButton: true
            });

            // Reload after Swal closes
            window.location.reload();
        } catch (error) {
            setIsUpdating(false);
            console.error('Profile update error:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message || 'Failed to update profile. Please try again.',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setFormData({
            displayName: user.displayName || '',
            photoURL: Array.isArray(user.photoURL) ? user.photoURL[0] : user.photoURL || ''
        });
        setIsEditing(false);
    };

    // 2. Handle Loading State
    if (authLoading || roleLoading || userDataLoading) {
        return <Loading />;
    }

    // 3. Handle Case where User is Not Logged In
    if (!user) {
        return <p className="text-center text-error text-xl">User data not found. Please log in.</p>;
    }

    // 4. Render Main Content
    return (
        <div className="bg-base-100 min-h-screen p-8">
            <div className="bg-base-200 p-8 rounded-xl shadow-2xl max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-8 border-b border-base-content/20 pb-4">
                    👋 Welcome, {user.displayName || user.email}!
                </h2>

                <div className="flex flex-col items-center">
                    {/* User Avatar */}
                    <div className="avatar">
                        <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img
                                src={Array.isArray(user.photoURL) ? user.photoURL[0] : user.photoURL || 'https://via.placeholder.com/150'}
                                alt={`${user.displayName}'s profile`}
                            />
                        </div>
                    </div>

                    {/* Basic User Information */}
                    <div className="mt-6 w-full space-y-3">
                        {isEditing ? (
                            // Edit Mode
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Photo URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="photoURL"
                                        value={formData.photoURL}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full"
                                        placeholder="Enter photo URL"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Email (Cannot be changed)</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        className="input input-bordered w-full"
                                        disabled
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="submit"
                                        className="btn btn-success flex-1"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="btn btn-ghost flex-1"
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // View Mode
                            <>
                                <p className="flex justify-between items-center text-xl border-b border-base-content/20 pb-2">
                                    <span className="font-semibold text-base-content/70">Full Name:</span>
                                    <span className="text-base-content">{user.displayName || "Not Provided"}</span>
                                </p>
                                <p className="flex justify-between items-center text-xl border-b border-base-content/20 pb-2">
                                    <span className="font-semibold text-base-content/70">Email:</span>
                                    <span className="text-base-content">{user.email}</span>
                                </p>
                                <p className="flex justify-between items-center text-xl border-b border-base-content/20 pb-2">
                                    <span className="font-semibold text-base-content/70">Account Created:</span>
                                    <span className="text-base-content">
                                        {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                                    </span>
                                </p>
                            </>
                        )}
                    </div>

                    {/* Role Specific Content (Pass the 'role' as a prop) */}
                    <RoleSpecificContent role={role} />

                    {/* Suspend Feedback Display */}
                    {userData?.status === 'suspended' && userData?.suspendFeedback && (
                        <div className="alert alert-error mt-6 w-full shadow-lg">
                            <div className="flex-col items-start w-full">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Account Suspended
                                </h3>
                                <div className="mt-3 w-full">
                                    <p className="font-semibold">Reason: <span className="font-normal">{userData.suspendReason}</span></p>
                                    <p className="font-semibold mt-2">Details:</p>
                                    <p className="font-normal bg-base-100 p-3 rounded mt-1">{userData.suspendFeedback}</p>
                                    <p className="text-sm mt-2 opacity-70">Suspended on: {new Date(userData.suspendedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Update Button (Global) */}
                    {!isEditing && (
                        <button
                            className="btn btn-primary mt-8 w-full sm:w-auto"
                            onClick={() => setIsEditing(true)}
                        >
                            Update Profile Details
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
