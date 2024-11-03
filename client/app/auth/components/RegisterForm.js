import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/app/utils/api'

const RegisterForm = () => {
    const router = useRouter()
    const redirect = router.query?.redirect || '/'
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('') // State for error message

    const handleRegister = async (e) => {
        e.preventDefault()
        setErrorMessage('') // Reset error message on new attempt

        if (password !== repeatPassword) {
            setErrorMessage('Passwords do not match')
            return
            }

        try {
            await registerUser(username, email, password);
            router.push(redirect);
        } catch (error) {
            setErrorMessage(error.message || 'Registration failed');
        }
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}{' '}
                {/* Display error in red */}
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
