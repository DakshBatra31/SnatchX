import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import { User } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f1efec] to-[#f9fafb] flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#123458] rounded-full p-3 mb-3 shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#123458] mb-1 tracking-tight">Sign in to your account</h2>
            <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#123458] text-white py-2.5 rounded-lg font-semibold text-lg shadow hover:bg-[#0e2747] transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#123458] hover:underline font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 