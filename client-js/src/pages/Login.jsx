import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThunk';
import { clearError } from '../features/auth/authSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [turnstileLoading, setTurnstileLoading] = useState(true);
  const turnstileRef = useRef(null);

const from = location.state?.from?.pathname || "/";

  useEffect(() => {
      if (user) {
    navigate(from, { replace: true });
  }
    return () => dispatch(clearError());
  }, [user, navigate, from, dispatch]);

  // Load Cloudflare Turnstile
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    script.async = true;
    script.defer = true;

    window.onTurnstileLoad = () => {
      if (turnstileRef.current && window.turnstile) {
        // Use env variable or Cloudflare's always-pass test key for development
        const sitekey = import.meta.env.VITE_TURNSTILE_SITEKEY || '1x00000000000000000000AA';
        window.turnstile.render(turnstileRef.current, {
          sitekey,
          callback: (token) => {
            setTurnstileToken(token);
            setTurnstileLoading(false);
          },
          'expired-callback': () => {
            setTurnstileToken(null);
            setTurnstileLoading(false);
          },
          theme: 'dark',
        });
      }
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
      delete window.onTurnstileLoad;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!turnstileToken) return;
    dispatch(loginUser({ email, password }));
  };

  const isFormValid = email && password && turnstileToken;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-8 relative overflow-hidden">
      {/* Animated gradient orb */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full bg-lime-500/15 blur-[180px] animate-pulse" />
      </div>

      {/* Firefly particles */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className="absolute firefly"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(163, 230, 53, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(163, 230, 53, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glassmorphism card */}
      <div className="
        w-full max-w-md
        backdrop-blur-2xl
        bg-white/[0.03]
        border border-white/10
        rounded-3xl
        p-8 md:p-10
        shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
        animate-fade-in
      ">
        {/* Logo / Icon */}
        <div className="flex justify-center mb-6">
          <div className="
            w-16 h-16 
            rounded-2xl
            bg-gradient-to-br from-lime-400/20 to-lime-500/10
            border border-lime-400/20
            flex items-center justify-center
            shadow-[0_0_30px_rgba(163,230,53,0.15)]
          ">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-lime-400" viewBox="0 0 24 24">
              <path fill="currentColor" d="m17.713 10.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M2.828 12l4.243 4.243l-1.414 1.414L0 12l5.657-5.657L7.07 7.757zm15.515 5.657L24 12l-2.83-2.828l-1.414 1.414L21.171 12l-4.242 4.243z" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-white/50 mt-3">
            Login to continue building with AI
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              {error}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-lime-400 transition-colors" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full pl-12 pr-4 py-3.5
                  rounded-xl
                  bg-white/[0.03]
                  border border-white/10
                  text-white text-sm
                  placeholder:text-white/25
                  focus:outline-none focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20
                  hover:border-white/20
                  transition-all duration-200
                "
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-lime-400 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full pl-12 pr-12 py-3.5
                  rounded-xl
                  bg-white/[0.03]
                  border border-white/10
                  text-white text-sm
                  placeholder:text-white/25
                  focus:outline-none focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20
                  hover:border-white/20
                  transition-all duration-200
                "
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-4 top-1/2 -translate-y-1/2
                  text-white/30 hover:text-lime-400
                  transition-colors duration-200
                  focus:outline-none
                "
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Turnstile widget */}
          <div className="flex justify-center py-2">
            <div
              ref={turnstileRef}
              className="rounded-xl overflow-hidden"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="
              w-full py-4
              rounded-xl
              bg-gradient-to-r from-lime-400 to-lime-500
              text-black text-sm font-bold uppercase tracking-wider
              shadow-[0_0_20px_rgba(163,230,53,0.3)]
              hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]
              hover:from-lime-300 hover:to-lime-400
              active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]
              transition-all duration-200
              flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Footer links */}
        <div className="space-y-3 text-center">
          <p className="text-sm text-white/40">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-lime-400 hover:text-lime-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
          <p className="text-xs text-white/30">
            Admin?{' '}
            <Link
              to="/admin/login"
              className="text-white/50 hover:text-lime-400 transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
