import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaUserShield, FaUserTie, FaUser, FaCheckCircle, FaBan, FaUnlock } from 'react-icons/fa';
import { FiShieldOff } from 'react-icons/fi';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState("");

    const { refetch, data: users = [] } = useQuery({
        queryKey: ["user", searchText],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?searchText=${searchText}`);
            return res.data;
        },
    });

    // Suspend User with Reason and Feedback
    const handleSuspendUser = async (user) => {
        const { value: formValues } = await Swal.fire({
            title: `Suspend ${user.name}?`,
            html: `
                <div class="text-left space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Suspend Reason:</label>
                        <input id="swal-reason" class="swal2-input w-full" placeholder="e.g., Policy violation">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Feedback/Details:</label>
                        <textarea id="swal-feedback" class="swal2-textarea w-full" rows="4" placeholder="Explain why this user is being suspended..."></textarea>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Suspend User",
            preConfirm: () => {
                const reason = document.getElementById('swal-reason').value;
                const feedback = document.getElementById('swal-feedback').value;
                
                if (!reason || !feedback) {
                    Swal.showValidationMessage('Both reason and feedback are required');
                    return false;
                }
                
                return { reason, feedback };
            }
        });

        if (formValues) {
            try {
                const res = await axiosSecure.patch(`/users/${user._id}/suspend`, {
                    suspendReason: formValues.reason,
                    suspendFeedback: formValues.feedback
                });

                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        icon: 'success',
                        title: 'User Suspended',
                        text: `${user.name} has been suspended successfully.`,
                        timer: 2500
                    });
                }
            } catch (error) {
                console.error("Error suspending user:", error);
                Swal.fire("Error", "Failed to suspend user.", "error");
            }
        }
    };

    // Unsuspend User
    const handleUnsuspendUser = (user) => {
        Swal.fire({
            title: `Unsuspend ${user.name}?`,
            text: "This will restore user access and remove suspend feedback.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Unsuspend"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/users/${user._id}/unsuspend`);
                    
                    if (res.data.modifiedCount) {
                        refetch();
                        Swal.fire({
                            icon: 'success',
                            title: 'User Unsuspended',
                            text: `${user.name} is now active.`,
                            timer: 2500
                        });
                    }
                } catch (error) {
                    console.error("Error unsuspending user:", error);
                    Swal.fire("Error", "Failed to unsuspend user.", "error");
                }
            }
        });
    };

    // Helper function for Role/Status Update with Confirmation (Based on our previous discussion)
    const updateRoleAndStatus = (user, newRole, newStatus, successMessage) => {
        // IMPORTANT: Ensure your backend supports this payload on the /role-and-status endpoint
        const updateInfo = { role: newRole, status: newStatus };

        Swal.fire({
            title: `Confirm Action for ${user.name}?`,
            text: `Set Role to ${newRole.toUpperCase()} and Status to ${newStatus.toUpperCase()}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, Proceed!`
        }).then((result) => {
            if (result.isConfirmed) {
                // NOTE: Using the correct combined endpoint
                axiosSecure.patch(`/users/${user._id}/role-and-status`, updateInfo).then((res) => {
                    if (res.data.modifiedCount) {
                        refetch();
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: successMessage,
                            showConfirmButton: false,
                            timer: 2500,
                        });
                    }
                }).catch(error => {
                    console.error("Error updating user:", error);
                    Swal.fire("Error", "Failed to update user status/role.", "error");
                });
            }
        });
    };

    // Role/Status Action Handlers
    const handleApproveUser = (user) => {
        // Keeps the current role, but sets status to active
        updateRoleAndStatus(
            user,
            user.role,
            "active",
            `${user.name} is now Active!`
        );
    };

    const handleMakeAdmin = (user) => {
        // Promotes to admin and activates the account
        updateRoleAndStatus(user, "admin", "active", `${user.name} is now an Admin!`);
    };

    const handleDemoteToBuyer = (user) => {
        // Demotes to buyer and ensures the account is active
        updateRoleAndStatus(user, "buyer", "active", `${user.name} demoted to Buyer.`);
    };

    // Note: The original role handlers from your provided code were removed, 
    // and the logic was consolidated into the more robust handleApproveUser/handleMakeAdmin/handleDemoteToBuyer 
    // to correctly manage both role AND status, which is required for the pending workflow.

    return (
        <div className="bg-base-100 min-h-screen p-6">
            <h2 className="text-3xl font-bold text-base-content mb-4">Manage Users: {users.length}</h2>
            
            {/* Search Input */}
            <label className="input input-bordered bg-base-200 flex items-center gap-2 max-w-md mb-6">
                <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input
                    onChange={(e) => setSearchText(e.target.value)}
                    type="search"
                    className="grow bg-transparent text-base-content"
                    placeholder="Search users"
                />
            </label>

            <div className="overflow-x-auto bg-base-200 rounded-lg shadow-lg">
                <table className="table">
                    {/* head */}
                    <thead className="bg-base-300">
                        <tr className="text-base-content">
                            <th>#</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            {/* 1. NEW STATUS COLUMN ADDED */}
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="hover:bg-base-300 transition-colors">
                                <td className="text-base-content">{index + 1}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                {/* Added onError handler for image loading robustness */}
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.name}
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://via.placeholder.com/150'; // Fallback image
                                                        e.currentTarget.onerror = null;
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-base-content">{user.name}</div>

                                        </div>
                                    </div>
                                </td>
                                <td className="text-base-content">{user.email}</td>
                                <td className="text-base-content">
                                    {/* Capitalize role for better display */}
                                    {user.role ? user.role.toUpperCase() : 'N/A'}
                                </td>

                                {/* 2. STATUS DISPLAY */}
                                <td>
                                    {user.status && (
                                        <span
                                            className={`badge badge-sm ${
                                                user.status === 'active' ? 'badge-success' : 
                                                user.status === 'suspended' ? 'badge-error' : 
                                                'badge-warning'
                                            } font-bold text-white`}
                                        >
                                            {user.status.toUpperCase()}
                                        </span>
                                    )}
                                </td>

                                {/* 3. ACTIONS COLUMN */}
                                <td className="flex gap-2 flex-wrap">
                                    {/* APPROVE/ACTIVATE BUTTON (Visible only if PENDING) */}
                                    {user.status === "pending" && (
                                        <button
                                            onClick={() => handleApproveUser(user)}
                                            className="btn btn-sm btn-warning text-white"
                                            title="Approve & Activate"
                                        >
                                            <FaCheckCircle /> Approve
                                        </button>
                                    )}

                                    {/* SUSPEND BUTTON (Visible if Active) */}
                                    {user.status === "active" && (
                                        <button
                                            onClick={() => handleSuspendUser(user)}
                                            className="btn btn-sm btn-error text-white"
                                            title="Suspend User"
                                        >
                                            <FaBan /> Suspend
                                        </button>
                                    )}

                                    {/* UNSUSPEND BUTTON (Visible if Suspended) */}
                                    {user.status === "suspended" && (
                                        <button
                                            onClick={() => handleUnsuspendUser(user)}
                                            className="btn btn-sm btn-success text-white"
                                            title="Unsuspend User"
                                        >
                                            <FaUnlock /> Unsuspend
                                        </button>
                                    )}

                                    {/* MAKE ADMIN Button (Visible if NOT Admin and Not Suspended) */}
                                    {user.role !== "admin" && user.status !== "suspended" && (
                                        <button
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-sm btn-success"
                                            title="Make Admin"
                                            disabled={user.status === "pending"}
                                        >
                                            <FaUserShield />
                                        </button>
                                    )}

                                    {/* DEMOTE Button (Visible if Admin/Manager and Not Suspended) */}
                                    {user.role !== "buyer" && user.status !== "suspended" && (
                                        <button
                                            onClick={() => handleDemoteToBuyer(user)}
                                            className="btn btn-sm btn-error"
                                            title="Demote to Buyer"
                                        >
                                            <FiShieldOff />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;