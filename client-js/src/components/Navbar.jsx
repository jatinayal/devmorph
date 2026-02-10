import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/authThunk'
import logo from '../assets/logoNav.png'
import { ArrowRight, Menu, X, ChevronDown, LogOut, User as UserIcon, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    console.log(import.meta.env.VITE_BASEURL)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate('/')
    })
  }

  const navItems = [
    { name: 'Projects', path: '/projects' },
    { name: 'MorphSpace', path: '/morphspace' },
    { name: 'Docs', path: '/docs' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' }
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`
          max-w-7xl mx-auto flex items-center justify-between
          px-6 py-3 rounded-4xl
          transition-all duration-500
          ${scrolled
            ? 'bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]'
            : 'bg-black/20 backdrop-blur-md border border-white/5 shadow-none'
          }
        `}
      >
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="text-lime-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="currentColor" d="m17.713 10.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M2.828 12l4.243 4.243l-1.414 1.414L0 12l5.657-5.657L7.07 7.757zm15.515 5.657L24 12l-2.83-2.828l-1.414 1.414L21.171 12l-4.242 4.243z" />
            </svg>
          </motion.div>
          <motion.img
            src={logo}
            alt="Logo"
            className="h-7 md:h-8"
            whileHover={{ opacity: 0.8 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-400 mx-4"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 mx-4 scale-x-0 group-hover:scale-x-100 transition-transform origin-center"
                />
              </Link>
            )
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="group flex items-center gap-2 px-1 py-1 rounded-full bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold transition-all duration-300 pr-4"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-lime-400 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight size={18} />
                </div>
                <span>Get Started</span>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              {/* Credits Badge */}
              <Link
                to="/pricing"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <CreditCard size={14} className="text-lime-400" />
                <span className="text-xs font-bold text-white/90">{user.credits ?? 0} Credits</span>
              </Link>

              {/* User Profil Dropdown */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-lime-400 to-emerald-500 flex items-center justify-center text-black font-black text-xs uppercase">
                    {(user.fullName || user.name || 'U').charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-white/90">{user.fullName || user.name}</span>
                  <ChevronDown size={14} className={`text-white/50 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden z-[60]"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Account</p>
                        <p className="text-sm text-white/90 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-1.5">

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-3 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navItems.map((item, idx) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.name}
                >
                  <Link
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${location.pathname === item.path ? 'bg-lime-400/10 text-lime-400' : 'text-white/70 hover:bg-white/5'
                      }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <div className="h-px bg-white/10 my-2" />

              {!user ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/5 text-white font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center px-4 py-3 rounded-xl bg-lime-400 text-black font-extrabold"
                    onClick={() => setMobileOpen(false)}
                  >
                    Signup
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-400/10 text-red-400 font-semibold"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
