import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";
import  Error from "../../components/Error";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loading) return;
    setError("");
    if(formData.password.length < 8) {
      setError("Password should contain at least 8 characters.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(formData.email)) {
      setError("Email address is required");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          type: 'forgot-password',
        }),
      });
      setLoading(false);
      if (response.ok) {
        toast.success("OTP sent successfully.");
        navigate(`/otp?email=${formData.email}&type=forgot-password`, { state: { password: formData.password } });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while sending OTP.");
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your email and new password.</p>
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
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {loading ? 'Sending...':'Send OTP'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
