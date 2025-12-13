import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
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
            <span className={`badge badge-lg ${badgeColor} text-black font-bold`}>
                Role: {role.toUpperCase()}
            </span>
            <p className="mt-3 text-lg text-gray-700">{content}</p>
        </div>
    );
};


// --- 2. Main Profile Component Rendering ---
const UserProfile = () => {
    // 1. Get Authentication and Role Data
    const { user, loading: authLoading } = useAuth();
    const { role, roleLoading } = useRole();

    // 2. Handle Loading State
    if (authLoading || roleLoading) {
        return <Loading />;
    }

    // 3. Handle Case where User is Not Logged In
    if (!user) {
        return <p className="text-center text-red-500 text-xl">User data not found. Please log in.</p>;
    }

    // 4. Render Main Content
    return (
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-3xl mx-auto my-10">
            <h2 className="text-4xl font-extrabold text-center text-primary mb-8 border-b pb-4">
                👋 Welcome, {user.displayName || user.email}!
            </h2>

            <div className="flex flex-col items-center">
                {/* User Avatar */}
                <div className="avatar">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                            src={user.photoURL || 'https://via.placeholder.com/150'}
                            alt={`${user.displayName}'s profile`}
                        />
                    </div>
                </div>

                {/* Basic User Information */}
                <div className="mt-6 w-full space-y-3">
                    <p className="flex justify-between items-center text-xl border-b pb-2">
                        <span className="font-semibold text-gray-600">Full Name:</span>
                        <span className="text-gray-900">{user.displayName || "Not Provided"}</span>
                    </p>
                    <p className="flex justify-between items-center text-xl border-b pb-2">
                        <span className="font-semibold text-gray-600">Email:</span>
                        <span className="text-gray-900">{user.email}</span>
                    </p>
                    <p className="flex justify-between items-center text-xl border-b pb-2">
                        <span className="font-semibold text-gray-600">Account Created:</span>
                        <span className="text-gray-900">
                            {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                        </span>
                    </p>
                </div>

                {/* Role Specific Content (Pass the 'role' as a prop) */}
                <RoleSpecificContent role={role} />

                {/* Profile Update Button (Global) */}
                <button
                    className="btn btn-primary mt-8 w-full sm:w-auto"
                    onClick={() => console.log('Edit Profile Clicked')}
                >
                    Update Profile Details
                </button>
            </div>
        </div>
    );
};

export default UserProfile;