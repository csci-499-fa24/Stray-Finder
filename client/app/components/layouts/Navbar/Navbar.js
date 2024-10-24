'use client'

import Link from 'next/link'
import useAuth from '@/app/hooks/useAuth'
import { Background } from 'react-parallax';



const Navbar = () => {

    const { isAuthenticated, user } = useAuth()

    return (
        <nav className="navbar navbar-expand-lg justify-content-center custom-navbar" style={{
            backgroundImage: "linear-gradient(to right, #825A88, #8888cc)", // Gradient definition
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
                <Link className="navbar-brand highlight-brand stray-finder-logo" href="/home">
                    Stray Finder
                </Link>
                
                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        
                        {/* Home Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/home" style = {{color: '#cf7bed'}}>
                                Home
                            </Link>
                        </li>
                        
                        {/* About Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/about" style = {{color: '#cf7bed'}}>
                                About
                            </Link>
                        </li>
                        
                        {/* Contact Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/contact" style = {{color: '#cf7bed'}}>
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
                                style = {{color: '#cf7bed'}}
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
                    
                    {/* Search Form */}
                    <form className="d-flex" role="search">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="e.g. name, breed"
                            aria-label="Search"
                        />
                        <button
                            className="btn btn-outline-success search-button"
                            type="submit"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Conditional Login/Welcome User */}
                {/* Login Link */}
                <div className="p-3 ml-auto">
                    {isAuthenticated && user ? (
                        <h6>{`Welcome, ${user.username}`}</h6>
                    ) : (
                        <Link href="/login">Login</Link>
                    )}
                    {/* Profile icon coming some time later */}
                    <Link href="/login" style={{color: 'var(--purple-7)'}}>Login</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;