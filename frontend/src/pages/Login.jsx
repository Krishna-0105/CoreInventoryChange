import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', { email, password })
      login(data)
      toast.success(`Welcome back, ${data.name}!`)
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/30">
        {/* Logo */}
        <div className='flex items-center gap-2 mb-8'>
          <div className='w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white animate-pulse'>
            CI
          </div>
          <span className='text-xl font-semibold text-gray-800'>CoreInventory</span>
        </div>

        <h2 className='text-2xl font-bold text-gray-800 mb-1'>Welcome back</h2>
        <p className='text-gray-500 text-sm mb-6'>Sign in to your account</p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className="relative">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>

            <FiMail className="absolute left-3 top-9 text-gray-400" />

            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full pl-10 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='you@example.com'
            />
          </div>

          <div className="relative">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>

            <FiLock className="absolute left-3 top-9 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full pl-10 pr-10 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='••••••••'
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50'
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-600 hover:underline font-medium'>
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login