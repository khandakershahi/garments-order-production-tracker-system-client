import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';

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

    // Fetch user data including suspend status
    const { data: userData = null, isLoading: userDataLoading } = useQuery({
        queryKey: ['user-profile-data', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data;
        }
    });

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
                <h2 className="text-4xl font-extrabold text-center text-primary mb-8 border-b border-base-content/20 pb-4">
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
                    <button
                        className="btn btn-primary mt-8 w-full sm:w-auto"
                        onClick={() => console.log('Edit Profile Clicked')}
                    >
                        Update Profile Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;