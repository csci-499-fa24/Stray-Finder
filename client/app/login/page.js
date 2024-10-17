'use client'
import Link from 'next/link'
import { useState } from 'react'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Footer from '../components/layouts/Footer'

const Login = () => {
    const [activeTab, setActiveTab] = useState('login')

    const handleTabSwitch = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div>
            <h2 className="main-prp d-flex justify-content-center align-items-center pt-5 pb-0">
                Login or Register
            </h2>

            <div className="d-flex justify-content-center align-items-start vh-100 bg-light">
                <div
                    className="border-purple p-4 p-md-5 rounded w-100 w-md-75 w-lg-50"
                    style={{ maxWidth: '600px' }}
                >
                    <ul className="nav nav-pills nav-justified mb-4">
                        <li className="nav-item" role="presentation">
                            <a
                                className={`nav-link ${
                                    activeTab === 'login' ? 'active' : ''
                                }`}
                                onClick={() => handleTabSwitch('login')}
                                role="tab"
                                aria-controls="pills-login"
                                aria-selected={activeTab === 'login'}
                            >
                                Login
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className={`nav-link ${
                                    activeTab === 'register' ? 'active' : ''
                                }`}
                                onClick={() => handleTabSwitch('register')}
                                role="tab"
                                aria-controls="pills-register"
                                aria-selected={activeTab === 'register'}
                            >
                                Register
                            </a>
                        </li>
                    </ul>

                    <div className="tab-content">
                        {activeTab === 'login' && <LoginForm />}
                        {activeTab === 'register' && <RegisterForm />}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Login