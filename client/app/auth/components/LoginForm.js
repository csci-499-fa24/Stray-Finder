import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/utils/api';
import toast from 'react-hot-toast';

const LoginForm = () => {
    const router = useRouter();
    const redirect = router.query?.redirect || '/';
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message on new attempt

        const result = await loginUser(username, password);
        console.log('Login result:', result);

        if (result.error) {
            // Set the error message if the loginUser function returns an error
            setErrorMessage(result.message);
            console.error('Login error:', result.message);
        } else {
            console.log('Login successful');
            toast.success('Login successful!', {
                duration: 2000, // Toast will show for 2 seconds
            });

            // After login success, check the result and the authentication state
            // For debugging purposes, log out the user and their state
            console.log('Redirecting to:', redirect);
            router.push(redirect);
        }
    };

    return (
        <div
            className="tab-pane fade show active"
            id="pills-login"
            role="tabpanel"
            aria-labelledby="tab-login"
        >
            <form onSubmit={handleLogin}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                
                {/* Username Section */}
                <div className="form-outline mb-4">
                    <label htmlFor="loginUsername" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        id="loginUsername"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                
                {/* Password Section */}
                <div className="form-outline mb-4">
                    <label htmlFor="loginPassword" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="loginPassword"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                
                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn-purple btn btn-primary btn-block mb-4"
                >
                    Sign in
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
