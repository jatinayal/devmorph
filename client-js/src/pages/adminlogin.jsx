import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      navigate('/admin/dashboard')
      alert("Admin login successful ✅");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-lime-500/10 border border-lime-500/30 mb-3">
            <ShieldCheck className="text-lime-400" size={24} />
          </div>
          <h2 className="text-xl font-semibold">Admin Login</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Secure access for administrators
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-zinc-500" size={18} />
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-lime-500/40 focus:border-lime-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-zinc-500" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-lime-500/40 focus:border-lime-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-lime-500 text-black font-semibold 
                       rounded-lg py-2.5 hover:bg-lime-400 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Signup link */}
        <div className="mt-6 text-center text-sm text-zinc-400">
          Want to add a new admin?
          <button
            onClick={() => navigate("/admin/signup")}
            className="ml-1 text-lime-400 hover:text-lime-300 font-medium"
          >
            Create Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
