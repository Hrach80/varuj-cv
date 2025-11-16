import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import supabase from '../supabaseClient';
const ADMIN_EMAIL = 'hrachvag1980@gmail.com';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const checkAdminStatus = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user && user.email === ADMIN_EMAIL) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        setLoading(false);
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout failed:', error);
            alert('Ելքի սխալ։');
            return false;
        }
        setIsAdmin(false);
        alert('Դուրս եկաք։');
        return true;
    };

    useEffect(() => {
        checkAdminStatus(); 
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                    checkAdminStatus();
                }
            }
        );

        return () => {
            if (authListener) {
                authListener.subscription.unsubscribe();
            }
        };

    }, [checkAdminStatus]);

    const value = {
        isAdmin,
        loading,
        checkAdminStatus,
        handleLogout,
        ADMIN_EMAIL
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => useContext(AuthContext);