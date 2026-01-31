import React, { useState } from "react";
import { UserPlus, User, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/admin/signup", {
        method: "POST",
        credentials: "include", // 🔥 cookie-based auth
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Admin creation failed");

      setSuccess("New admin created successfully ✅");
      setName("");
      setEmail("");
      setPassword("");
      navigate('/admin/login')
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
            <UserPlus className="text-lime-400" size={24} />
          </div>
          <h2 className="text-xl font-semibold">Create Admin</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Only existing admins can add new admins
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 text-sm text-lime-400 bg-lime-500/10 border border-lime-500/20 rounded-lg px-3 py-2">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Admin name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-lime-500/40 focus:border-lime-500"
            />
          </div>

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
            {loading ? "Creating..." : "Create Admin"}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
