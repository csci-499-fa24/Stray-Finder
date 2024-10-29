'use client'
import Link from 'next/link'
import useAuth from '@/app/hooks/useAuth'
import { Background } from 'react-parallax';
import LogoutButton from '../../../auth/components/logout'; // Adjust the import path as necessary


function Navbar() {
    const { isAuthenticated, user } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg justify-content-center custom-navbar" style={{
            backgroundImage: 'white',
            //"linear-gradient(to right, #825A88, #8888cc)", // Gradient definition
            width: "100vw",
            lineHeight: '5px',
        }}>
            <div className="container-fluid d-flex">
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

                {/* Navbar Brand */}
                <Link className="navbar-brand highlight-brand stray-finder-logo" href="/" style={{
                    fontSize: '1.5rem',
                    color: '#a826a2'
                }}>
                    Stray Finder
                </Link>

                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        {/* Home Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/" style={{ color: '#67347a' }}>
                                Home
                            </Link>
                        </li>

                        {/* About Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/about" style={{ color: '#67347a' }}>
                                About
                            </Link>
                        </li>

                        {/* Contact Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/contact" style={{ color: '#67347a' }}>
                                Contact
                            </Link>
                        </li>

                        {/* Dropdown Menu */}
                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ color: '#67347a' }}
                            >
                                Actions
                            </Link>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" href="/report-lost">
                                        Report Lost
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" href="/report-found">
                                        Report Found
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" href="/report-stray">
                                        Report Stray
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>


                </div>

                {/* Conditional Login/Welcome User */}
                <div className="p-3 ml-auto">
                    {isAuthenticated && user ? (
                        <>
                            <h6>{`Welcome, ${user.username}`}</h6>
                            <LogoutButton /> {/* Display the logout button when authenticated */}
                        </>
                ) : (
                    <Link href="/auth" style={{ color: '#67347a' }}>Login</Link>
                )}
            </div>

            </div>
        </nav>
    )
}

export default Navbar
