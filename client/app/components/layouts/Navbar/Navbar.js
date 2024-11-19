"use client";
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

  // Set the current path using window.location.pathname
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

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
            <li className="nav-item">
              <Link href="/match" className={`nav-link ${isActive("/reportAnimal") ? "active" : ""}`}>
                Match
              </Link>
            </li>
          </ul>
        </div>

    {/* Authentication: ProfileMenu or Login Button */}
    <div className="d-flex align-items-center login-profile-container">
      {isAuthenticated && user ? (
        <div className="profile">
          <ProfileMenu />
        </div>
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
