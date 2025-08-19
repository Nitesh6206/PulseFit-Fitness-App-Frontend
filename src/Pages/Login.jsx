"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../redux/authSlice"
import { useToast } from "../components/ui/toast"
import { Mail, Lock, Eye, EyeOff, Dumbbell, ArrowRight, Shield, Users, Zap } from "lucide-react"

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const dispatch = useDispatch()
  // const { loading, error } = useSelector((state) => state.auth);
  const { toast } = useToast()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.password) newErrors.password = "Password is required"
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const result = await dispatch(login(formData))
    if (login.fulfilled.match(result)) {
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      navigate("/")
    } else {
      toast({
        title: "Error",
        description: result.payload,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700 rounded-2xl mb-8 shadow-lg">
              <Dumbbell className="w-10 h-10 text-white transform rotate-45" />
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-6">PulseFit</h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your fitness journey with personalized training programs and community support.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  title: "Secure & Private",
                  desc: "Your health data is protected with enterprise-grade security",
                },
                {
                  icon: Users,
                  title: "Community Driven",
                  desc: "Connect with trainers and members who share your goals",
                },
                {
                  icon: Zap,
                  title: "Quick Results",
                  desc: "Track your progress and see improvements faster",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shadow-sm">
                    <feature.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Mobile Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-xl mb-4 shadow-sm lg:hidden">
                <Dumbbell className="w-8 h-8 text-white transform rotate-45" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue your fitness journey</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Mail className="w-4 h-4 text-slate-600" />
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Lock className="w-4 h-4 text-slate-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 pr-12 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-slate-600 hover:text-slate-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-slate-800 transition-all duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  type="button"
                  className="text-slate-600 hover:text-slate-700 font-semibold transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
