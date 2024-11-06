"use client";
import Link from "next/link";
import Image from "next/image";
import ProfileMenu from "./Profile_Menu";
import useAuth from "@/app/hooks/useAuth";
import pawIcon from "./paw.png"; 
import "./Navbar.css";

const Navbar = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
            <div className="container-fluid d-flex justify-content-between">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <Link className="navbar-brand d-flex align-items-center" href="/">
                    <Image
                        src={pawIcon}
                        alt="Paw Icon"
                        width={100} 
                        height={100}
                        className="me-2"
                        priority
                    />
                    <span className="brand-text">STRAY FINDER</span>
                </Link>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" href="/">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" href="/about">
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" href="/contact">
                                Contact
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" href="/match">
                                Match
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" href="/reportAnimal">
                                Report
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link nav-link-custom dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Registry
                            </Link>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" href="/Strays">
                                        Strays
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" href="/LostPets">
                                        Lost Pets
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" href="/FoundPets">
                                        Found Pets
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className="p-3 ml-auto">
                    {isAuthenticated && user ? (
                        <div className="profile">
                            <ProfileMenu />
                        </div>
                    ) : (
                        <div className="login">
                            <Link href="/auth" className="login-button">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
};

export default Navbar;

