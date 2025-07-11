"use client"

import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Pill, Mail, Lock, User, Loader } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import FloatingLabelInput from "../components/FloatingLabelInput"
import Toast from "../components/Toast"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setToast({
        type: "error",
        message: "Passwords do not match",
      })
      return false
    }

    if (formData.password.length < 6) {
      setToast({
        type: "error",
        message: "Password must be at least 6 characters",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    const result = await register(formData.name, formData.email, formData.password)

    if (result.success) {
      setToast({
        type: "success",
        message: "Account created successfully! Please sign in.",
      })
      setTimeout(() => navigate("/login"), 2000)
    } else {
      setToast({
        type: "error",
        message: result.error,
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Join us to never miss your medications</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FloatingLabelInput
              type="text"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              required
            />

            <FloatingLabelInput
              type="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <div className="relative">
              <FloatingLabelInput
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <FloatingLabelInput
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base font-semibold">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Register
