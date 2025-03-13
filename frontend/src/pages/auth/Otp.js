import React, { useState, useEffect } from 'react';
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom';
import {useAuth} from "../../context/AuthContext";
import Error from "../../components/Error";
import {BASE_URL} from "../../context/Api";

const Otp = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const email = searchParams.get('email');
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { password } = location.state || {};
    const { login } = useAuth();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            alert("Session Expired");
            navigate('/');
        }, 90000);

        return () => clearTimeout(timeoutId);
    }, [navigate]);


    const handleChange = (e) => {
        setOtp(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(false);
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, otp }),
            });
            setLoading(false);
            if (response.ok) {
                if(type === 'Signin') {
                    setLoading(false);
                    const updatedResponse = await fetch(`${BASE_URL}/auth/user`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({email}),
                    });
                    if(updatedResponse.ok) {
                        const data = await updatedResponse.json();
                        login(data.user);
                        navigate('/dashboard');
                    } else  {
                        setError('Could not login');
                    }
                    return;
                } else if(type === 'Register') {
                    setLoading(false);
                    navigate('/signin');
                    return;
                } else if(type === 'forgot-password') {
                    const updateResponse = await fetch(`${BASE_URL}/auth/update/user/password`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password, type }),
                    });
                    if (updateResponse.ok) {
                        setLoading(false);
                        navigate("/signin");
                        return;
                    } else {
                        const updateError = await updateResponse.json();
                        setError(updateError.message || "Failed to update password.");
                        setLoading(false);
                    }
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to verify OTP.');
            }
        } catch (err) {
            console.error(err || 'Could not verify OTP.');
            setError('Failed to Verify OTP.');
        }
    };
    return (
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl border border-gray-200">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary-700">Verification</h1>
                    <p className="mt-2 text-sm text-gray-600">Please enter the OTP sent to your email</p>
                </div>
                <Error error={error} />
                <div className="flex justify-center">
                    <input
                        type="text"
                        name="otp"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={handleChange}
                        className="tracking-widest w-full text-center mt-1 block px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

                <button 
                    onClick={handleSubmit}
                    className="w-full py-2 px-5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </div>
        </section>

    );
};
export default Otp;