import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Error from "../../components/Error";
import {toast} from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const sendOtp = async (type) => {
    try {
      const response = await fetch("http://localhost:3001/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, type: 'Signin' }),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent successfully.");
        navigate(`/otp?email=${formData.email}&type=Signin`);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setError("An error occurred while sending OTP.");
      console.error("Error:", error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(formData.email)) {
      setError("Email address is required");
      return;
    }
    if (formData.email !== "" && formData.password !== "") {
      try {
        const response = await fetch('http://localhost:3001/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          if(data.tfa_enabled) {
            await sendOtp('Signin');
            navigate(`/otp?email=${formData.email}&type=Signin`);
            return;
          } else {
            login(data.user);
          }
          const origin = location.state?.from?.pathname || '/dashboard';
          navigate(origin, { replace: true });
        } else {
          const errorData = await response.json();
          if (errorData.message === 'Unverified Account') {
            setError('Unverified Account');
            await sendOtp('Register');
            navigate(`/otp?email=${formData.email}&type=Signin`);
          } else {
            setError(errorData.message || "An error occurred during sign-in.");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
      }
    } else {
      setError("Email and password are required.");
    }
  };
  

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700">InvenTrack</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

          <Error error={error} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Sign in
          </button>
        </form>
        <div className="text-center">
          <Link to="/signup" className="text-sm font-medium text-primary-600 hover:underline">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignIn;