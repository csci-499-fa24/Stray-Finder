"use client";
import { FaBell } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProfileMenu from "./Profile_Menu";
import useAuth from "@/app/hooks/useAuth";
import pawIcon from "../assets/file.png";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentPath, setCurrentPath] = useState("");
  const [notifications, setNotifications] = useState([]); // Store all notifications
  const [unreadCount, setUnreadCount] = useState(0); // Store the total unread count
  const [newNotificationsCount, setNewNotificationsCount] = useState(0); // Store new notifications since last open


  // Set the current path using window.location.pathname
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Fetch notifications on load
  useEffect(() => {
    if (isAuthenticated && user) {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const allNotifications = data.notifications || [];
          const pinnedNotifications = allNotifications.filter((n) => n.isPinned); // Extract pinned notifications
          const regularNotifications = allNotifications.filter((n) => !n.isPinned); // Extract non-pinned notifications

          const sortedNotifications = [...pinnedNotifications, ...regularNotifications]; // Prioritize pinned notifications

          const totalUnread = sortedNotifications.filter((n) => !n.read).length;

          setNotifications(sortedNotifications);
          setUnreadCount(totalUnread);
          setNewNotificationsCount(totalUnread); // Initialize with total unread on load
        })
        .catch((err) => {
          console.error("Error fetching notifications:", err);
        });
    }
  }, [isAuthenticated, user]);

  // Recalculate counts whenever notifications change
  useEffect(() => {
    const totalUnread = notifications.filter((n) => !n.read).length;
    setUnreadCount(totalUnread);
    setNewNotificationsCount(totalUnread);
  }, [notifications]);

  // Poll for new notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && user) {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            const allNotifications = data.notifications || [];
            const totalUnread = allNotifications.filter((n) => !n.read).length;
            const newUnreadNotifications = allNotifications.filter(
              (n) => !n.read && !notifications.find((old) => old._id === n._id)
            );

            setNotifications(allNotifications);
            setUnreadCount(totalUnread);
            setNewNotificationsCount(newUnreadNotifications.length);
          })
          .catch((err) => {
            console.error("Error fetching new notifications:", err);
          });
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [isAuthenticated, user, notifications]);

  const handleNotificationsClick = async () => {
    try {
      // Fetch notifications and show the page without marking as read
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications`, {
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Error fetching notifications");
      }
  
      const data = await response.json();
      setNotifications(data.notifications);
  
      // Optionally mark notifications as read after some delay
      setTimeout(async () => {
        const markAsReadResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/notifications/mark-as-read`, {
          method: "POST",
          credentials: "include",
        });
  
        if (!markAsReadResponse.ok) {
          throw new Error("Error marking notifications as read");
        }
  
        // Update frontend state after marking as read
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
        setNewNotificationsCount(0);
      }, 3000); // Delay marking notifications as read (3 seconds for example)
    } catch (err) {
      console.error("Error handling notifications click:", err);
    }
  };  

  // Helper function to determine if a link is active
  const isActive = (path) => currentPath === path;

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Toggle button for collapsible navbar on small screens - added */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Logo and Site Name */}
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image src={pawIcon} alt="Stray Finder Logo" width={60} height={50} priority />
          <span className="brand-text ms-3">STRAY FINDER</span>
        </Link>

        {/* Collapsible Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Strays" className={`nav-link ${isActive("/Strays") ? "active" : ""}`}>
                Find Your Lost Pet
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/LostPets" className={`nav-link ${isActive("/LostPets") ? "active" : ""}`}>
                Help Find Missing Pets
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/reportAnimal" className={`nav-link ${isActive("/reportAnimal") ? "active" : ""}`}>
                Report
              </Link>
            </li>
          </ul>
        </div>

    {/* Authentication: ProfileMenu or Login Button */}
    <div className="d-flex align-items-center login-profile-container">
      {isAuthenticated && user ? (
        <>
          {/* Notifications */}
          <div className="notification-icon-container">
            <Link 
              href="/notifications-page" 
              className="notification-icon"
              onClick={handleNotificationsClick}
            >
              <FaBell />
              {newNotificationsCount > 0 && (
                <span className="notification-count">{newNotificationsCount}</span>
              )}
            </Link>
          </div>

          <div className="profile">
            <ProfileMenu />
          </div>
        </>
      ) : (
        <div className="login">
          <Link href="/auth" className="login-button">Login</Link>
        </div>
      )}
    </div>
  </div>
    </nav>
  );
};

export default Navbar;
