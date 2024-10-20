'use client'

import Link from 'next/link'

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg justify-content-center custom-navbar">
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
                <Link className="navbar-brand" href="/">
                    Stray Finder
                </Link>

                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        {/* Home Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/">
                                Home
                            </Link>
                        </li>

                        {/* About Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/about">
                                About
                            </Link>
                        </li>

                        {/* Contact Page Link */}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" href="/contact">
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

                    {/* Wrap Search Form and Advanced Search in a new container */}
                    <div className="d-flex flex-column align-items-center">
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

                        {/* Advanced Search link below the search box, centered */}
                        <div className="mt-2 text-center">
                            <Link href="/advanced-search" className="advanced-search-link">
                                Advanced Search
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Login Link */}
                <div className="p-3 ml-auto">
                    <Link href="/login">Login</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
