import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/app/utils/api'
import Link from 'next/link'

const RegisterForm = () => {
    const router = useRouter()
    const redirect = router.query?.redirect || '/'
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault()

        if (password !== repeatPassword) {
            console.error('Passwords do not match')
            return
        }

        try {
            await registerUser(username, email, password)
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
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="email"
                        id="registerEmail"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="registerPassword"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="registerRepeatPassword"
                        className="form-control"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
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