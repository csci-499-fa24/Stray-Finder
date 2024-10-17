import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LoginForm = () => {
    const router = useRouter()
    const redirect = router.query?.redirect || '/'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Login failed', errorData)
                return
            }

            const data = await response.json()
            router.push(redirect)
        } catch (error) {
            console.error('Login failed', error)
        }
    }

    return (
        <div
            className="tab-pane fade show active"
            id="pills-login"
            role="tabpanel"
            aria-labelledby="tab-login"
        >
            <form onSubmit={handleLogin}>
                <div className="text-center mb-3">
                    <p>Sign in with:</p>
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
                        id="loginUsername"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="loginPassword"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>

                <div className="row mb-4">
                    <div className="col-md-6 d-flex justify-content-center">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="loginCheck"
                            />
                            <label
                                className="form-check-label"
                                htmlFor="loginCheck"
                            >
                                {' '}
                                Remember me{' '}
                            </label>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex justify-content-center">
                        <a href="#">Forgot password?</a>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-purple btn btn-primary btn-block mb-4"
                >
                    Sign in
                </button>

                <div className="text-center">
                    <p>
                        Not a member? <a href="#">Register</a>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LoginForm
