'use client'
import Link from 'next/link'
import ProfileMenu from './Profile_Menu.js' // Import the Profile Menu component

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
                <Link className="navbar-brand highlight-brand stray-finder-logo" href="/" style={{
                    fontSize: '1.5rem',
                    color: '#a826a2'
                }}>
                    Stray Finder
                </Link>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" href="/" style={{ color: '#67347a' }}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" href="/about" style={{ color: '#67347a' }}>About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" href="/contact" style={{ color: '#67347a' }}>Contact</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#67347a' }}>
                                Actions
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" href="/report-lost">Report Lost</Link></li>
                                <li><Link className="dropdown-item" href="/report-found">Report Found</Link></li>
                                <li><Link className="dropdown-item" href="/report-stray">Report Stray</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                {/* User Profile Icon & Dropdown */}
                <ProfileMenu />
            </div>
        </nav>
    )
}

export default Navbar