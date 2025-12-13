import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const isUserAvailable = user && user.email;

    const { isLoading: roleLoading, data: role = "buyer" } = useQuery({ // <<< CHANGED DEFAULT TO "buyer"
        queryKey: ["user-role", user?.email],
        queryFn: async () => {
            if (!user.email) return "buyer";

            const res = await axiosSecure.get(`/users/${user.email}/role`);
            // The API must return an object with a 'role' property (e.g., { role: 'manager' })
            return res.data?.role || "buyer"; // <<< CHANGED DEFAULT TO "buyer"
        },
        enabled: !authLoading && !!isUserAvailable,
    });

    return { role, roleLoading };
};

export default useRole;