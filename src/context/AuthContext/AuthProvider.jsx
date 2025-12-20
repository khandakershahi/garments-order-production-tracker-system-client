import React, { useState } from "react";
import { AuthContext } from "./AuthContext";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import { useEffect } from "react";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signInGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    };

    // observe user state
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    const token = await currentUser.getIdToken();
                    // Attach a short-lived accessToken for axios/interceptors
                    setUser({ ...currentUser, accessToken: token });
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Failed to get ID token', err);
                setUser(currentUser);
            } finally {
                setLoading(false);
            }
        });
        return () => {
            unSubscribe();
        };
    }, []);

    const authInfo = {
        registerUser,
        signInUser,
        signInGoogle,
        user,
        loading,
        logOut,
        updateUserProfile,
    };

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
