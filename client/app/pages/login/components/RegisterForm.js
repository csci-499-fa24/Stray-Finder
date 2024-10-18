import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const RegisterForm = () => {
    const router = useRouter()
    const redirect = router.query?.redirect || '/';
    const [username, setUsername] = useState('') // Username field
    const [email, setEmail] = useState('') // Email field
    const [password, setPassword] = useState('') // Password field
    const [repeatPassword, setRepeatPassword] = useState('') // Confirm password field

    const handleRegister = async (e) => {
        e.preventDefault()

        if (password !== repeatPassword) {
            console.error('Passwords do not match')
            return
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Registration failed', errorData)
                return
            }

            const data = await response.json()
            router.push(redirect)
        } catch (error) {
            console.error('Registration failed', error)
        }
    }

    return (
        <div>
            <form onSubmit={handleRegister}>
                <div className="text-center mb-3">
                    <p>Sign up with:</p>
                    <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                    >
                        <i className="fab fa-facebook-f"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                    >
                        <i className="fab fa-google"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                    >
                        <i className="fab fa-twitter"></i>
                    </button>
                    <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                    >
                        <i className="fab fa-github"></i>
                    </button>
                </div>

                <p className="text-center">or:</p>

                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="registerUsername"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Controlled input
                        placeholder="Username"
                    />
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="email"
                        id="registerEmail"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Controlled input
                        placeholder="Email"
                    />
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="registerPassword"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Controlled input
                        placeholder="Password"
                    />
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="registerRepeatPassword"
                        className="form-control"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)} // Controlled input
                        placeholder="Confirm Password"
                    />
                </div>

                <div className="form-check d-flex justify-content-center mb-4">
                    <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="registerCheck"
                    />
                    <label className="form-check-label" htmlFor="registerCheck">
                        I have read and agree to the terms
                    </label>
                </div>

                <button
                    type="submit"
                    className="btn-purple btn btn-primary btn-block mb-3"
                >
                    Sign up
                </button>
            </form>
        </div>
    )
}

export default RegisterForm