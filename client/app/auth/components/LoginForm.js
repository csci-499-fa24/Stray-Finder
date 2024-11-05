import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/app/utils/api'
import toast from 'react-hot-toast';

const LoginForm = () => {
    const router = useRouter()
    const redirect = router.query?.redirect || '/'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('') // State for error message

    const handleLogin = async (e) => {
        e.preventDefault()
        setErrorMessage('') // Reset error message on new attempt

        const result = await loginUser(username, password)
        if (result.error) {
            // Set the error message if the loginUser function returns an error
            setErrorMessage(result.message)
        } else {
            
            toast.success("Login successful!", {
                duration: 2000, // Toast will show for 5 seconds
            });
            // Login successful, redirect
            router.push(redirect)
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
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
                <button
                    type="submit"
                    className="btn-purple btn btn-primary btn-block mb-4"
                >
                    Sign in
                </button>
            </form>
        </div>
    )
}

export default LoginForm
