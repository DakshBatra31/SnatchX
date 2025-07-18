import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signup(email, password, name);
      navigate("/");
    } catch (error) {
      setError(
        error.code === "auth/email-already-in-use"
          ? "Email already exists"
          : "Failed to create an account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f1efec] to-[#f9fafb] flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-[#123458] rounded-full p-3 mb-3 shadow-lg">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#123458] mb-1 tracking-tight">Create your account</h2>
            <p className="text-gray-500 text-sm">Sign up to get started!</p>
          </div>
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123458] transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
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
                autoComplete="new-password"
                minLength={6}
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#123458] text-white py-2.5 rounded-lg font-semibold text-lg shadow hover:bg-[#0e2747] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#123458] hover:underline font-semibold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 