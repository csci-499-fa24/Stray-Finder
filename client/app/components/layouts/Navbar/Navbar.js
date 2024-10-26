'use client'
import Link from 'next/link'
import useAuth from '@/app/hooks/useAuth'
import { Background } from 'react-parallax';

const Navbar = () => {
    const { isAuthenticated, user } = useAuth()

    return (
        <nav className="navbar navbar-expand-lg justify-content-center custom-navbar" style={{
            backgroundImage: "linear-gradient(to right, #825A88, #8888cc)", // Gradient definition
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
                <Link className="navbar-brand highlight-brand stray-finder-logo" href="/" style= {{
                    fontSize: '1.5rem',
                    color: '#b67cd9'
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
                            <Link className="nav-link active" aria-current="page" href="/" style = {{color: '#ffffff'}}>
                                Home
                            </Link>
                        </li>

                        {/* About Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/about" style = {{color: '#ffffff'}}>
                                About
                            </Link>
                        </li>

                        {/* Contact Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/contact" style = {{color: '#ffffff'}}>
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
                                style = {{color: '#ffffff'}}
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
                        <h6>{`Welcome, ${user.username}`}</h6>
                    ) : (
                        <Link href="/login" style={{color: '#ffffff'}}>Login</Link>
                    )}
                    {/* Profile icon coming some time later */}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
