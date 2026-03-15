import { useState } from "react"
import { Link } from "react-router-dom"
import API from "../api/axios"
import toast from "react-hot-toast"
import { FiMail } from "react-icons/fi"

const ForgotPassword = () => {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      await API.post("/auth/forgot-password", { email })

      toast.success("Password reset request sent")

    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">

      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/30">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white animate-pulse">
            CI
          </div>
          <span className="text-xl font-semibold text-gray-800">
            CoreInventory
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Enter your email to reset your password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <FiMail className="absolute left-3 top-9 text-gray-400" />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Back to Login
          </Link>
        </p>

      </div>

    </div>
  )
}

export default ForgotPassword