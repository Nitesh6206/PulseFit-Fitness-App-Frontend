"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LogOut, Menu, X, Home, Calendar, Activity } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      navigate("/login")
    } catch (error) {
      console.error("Failed to log out")
    }
  }

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "My Bookings", path: "/my-bookings", icon: Calendar },
    { name: "My Fitness Plans", path: "/my-fitness-plans", icon: Activity },
  ]

  const isActive = (path) => location.pathname === path

  return (
    // <CHANGE> Professional header with clean white background
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* <CHANGE> Professional logo with clean styling */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                <span className="text-slate-700">Pulse</span>
                <span className="text-slate-500">Fit</span>
              </h1>
            </div>
          </motion.div>

          {/* <CHANGE> Clean navigation with professional styling */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-slate-100 text-slate-700 shadow-sm"
                    : "text-gray-600 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </motion.button>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-100"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      navigate(item.path)
                      setIsMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-slate-100 text-slate-700"
                        : "text-gray-600 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </motion.button>
                ))}

                <div className="h-px bg-gray-200 my-2"></div>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </motion.button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header
