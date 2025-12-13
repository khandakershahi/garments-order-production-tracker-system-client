import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaUserShield, FaUserTie, FaUser, FaCheckCircle } from 'react-icons/fa';
import { FiShieldOff } from 'react-icons/fi'; // Assuming you have an appropriate icon for demotion

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
        <div className="bg-white">
            <h2 className="text-5xl ml-4 py-3">Manage Users: {users.length}</h2>
            <p>{searchText}</p>
            {/* Search Input remains the same */}
            <label className="input ml-5">
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
                    className="grow"
                    placeholder="Search users"
                />
            </label>

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
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
                            <tr key={user._id}>
                                <td>{index + 1}</td>
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
                                            <div className="font-bold">{user.name}</div>

                                        </div>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    {/* Capitalize role for better display */}
                                    {user.role ? user.role.toUpperCase() : 'N/A'}
                                </td>

                                {/* 2. STATUS DISPLAY */}
                                <td>
                                    {user.status && (
                                        <span
                                            className={`badge badge-sm ${user.status === 'active' ? 'badge-success' : 'badge-warning'} font-bold text-white`}
                                        >
                                            {user.status.toUpperCase()}
                                        </span>
                                    )}
                                </td>

                                {/* 3. ACTIONS COLUMN (Consolidated) */}
                                <td className="flex gap-2">
                                    {/* APPROVE/ACTIVATE BUTTON (Visible only if PENDING) */}
                                    {user.status === "pending" && (
                                        <button
                                            onClick={() => handleApproveUser(user)}
                                            className="btn btn-sm bg-yellow-500 text-white"
                                            title="Approve & Activate"
                                        >
                                            <FaCheckCircle /> Approve
                                        </button>
                                    )}

                                    {/* MAKE ADMIN Button (Visible if NOT Admin) */}
                                    {user.role !== "admin" && (
                                        <button
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-sm bg-green-400"
                                            title="Make Admin"
                                            disabled={user.status === "pending"} // Disable promotion while pending
                                        >
                                            <FaUserShield />
                                        </button>
                                    )}

                                    {/* DEMOTE Button (Visible if Admin/Manager) */}
                                    {user.role !== "buyer" && (
                                        <button
                                            onClick={() => handleDemoteToBuyer(user)}
                                            className="btn btn-sm bg-red-400"
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