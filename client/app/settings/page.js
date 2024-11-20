"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import Navbar from "@/app/components/layouts/Navbar/Navbar";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import Preferences from "./components/Preferences"; 
import styles from "./settings.module.css";

const SettingsPage = () => {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    // State to control modals
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false); 

    useEffect(() => {
        // Redirect to login if explicitly not authenticated
        if (isAuthenticated === false) {
            router.push("/auth");
            return;
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Render nothing while checking auth state
    }

    return (
        <div className={styles.profileBackground}>
            <Navbar />
            <div className={styles.settingsContainer}>
                <h1 className={styles.header}>Settings</h1>
                
                {/* Buttons to open Edit Profile and Change Password modals */}
                <button onClick={() => setIsEditProfileOpen(true)} className={styles.button}>
                    Edit Profile
                </button>
                <button onClick={() => setIsChangePasswordOpen(true)} className={styles.button}>
                    Change Password
                </button>
                
                {/* New button to open Preferences modal */}
                <button onClick={() => setIsPreferencesOpen(true)} className={styles.button}>
                    Preferences
                </button>

                {/* Conditionally render EditProfile and ChangePassword modals */}
                {isEditProfileOpen && (
                    <EditProfile 
                        user={user} 
                        isOpen={isEditProfileOpen} 
                        onClose={() => setIsEditProfileOpen(false)} 
                    />
                )}

                {isChangePasswordOpen && (
                    <ChangePassword 
                        isOpen={isChangePasswordOpen} 
                        onClose={() => setIsChangePasswordOpen(false)} 
                    />
                )}

                {/* Render Preferences Modal */}
                {isPreferencesOpen && (
                    <Preferences 
                        isOpen={isPreferencesOpen} 
                        onClose={() => setIsPreferencesOpen(false)} 
                        user={user} // Pass the user to Preferences
                    />
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
