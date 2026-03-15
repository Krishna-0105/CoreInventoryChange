import Select from "react-select"
import { allCountries } from "country-telephone-data"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import API from "../api/axios"
import toast from "react-hot-toast"
import { FaEye, FaEyeSlash } from "react-icons/fa"

// Country list
const countryOptions = allCountries.map((country) => ({
  value: country.dialCode,
  label: `${country.name} (+${country.dialCode})`,
  flag: `https://flagcdn.com/w20/${country.iso2}.png`,
  digits: 10
}))

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "staff",
  })

  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0])
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordStrength, setPasswordStrength] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const checkPasswordStrength = (password) => {

    const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    const mediumRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/   // FIXED

    if (strongRegex.test(password)) {
      setPasswordStrength("Strong")
    } else if (mediumRegex.test(password)) {
      setPasswordStrength("Medium")
    } else {
      setPasswordStrength("Weak")
    }
  }

  const handleChange = (e) => {

    const { name, value } = e.target

    if (name === "password") {
      checkPasswordStrength(value)
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.phone.length !== selectedCountry.digits) {
      toast.error(`Phone number must be ${selectedCountry.digits} digits`)
      return
    }

    const fullPhone = formData.countryCode + formData.phone

    const payload = {
      ...formData,
      phone: fullPhone,
    }

    setLoading(true)

    try {

      const { data } = await API.post("/auth/register", payload)

      login(data)

      toast.success(`Welcome, ${data.name}!`)

      navigate("/")

    } catch (error) {

      toast.error(error.response?.data?.message || "Registration failed")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">

      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/30 hover:scale-[1.02] transition-all duration-300">

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
          Create account
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Get started with CoreInventory
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John Doe"
            />

          </div>

          {/* Email */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="you@example.com"
            />

          </div>

          {/* Phone */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>

            <div className="flex gap-2">

              <div className="w-48">

                <Select
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={(option) => {

                    setSelectedCountry(option)

                    setFormData({
                      ...formData,
                      countryCode: "+" + option.value,
                      phone: "",
                    })

                  }}

                  formatOptionLabel={(country) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img src={country.flag} width="20" alt="flag" />
                      <span>{country.label}</span>
                    </div>
                  )}
                />

              </div>

              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {

                  let value = e.target.value.replace(/\D/g, "")
                  value = value.slice(0, selectedCountry.digits)

                  setFormData({ ...formData, phone: value })

                }}

                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter phone number"
              />

            </div>

          </div>

          {/* Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>

            </div>

            {formData.password && (

              <p className="text-sm mt-1">

                Strength:{" "}

                <span
                  className={
                    passwordStrength === "Strong"
                      ? "text-green-600"
                      : passwordStrength === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {passwordStrength}
                </span>

              </p>

            )}

          </div>

          {/* Confirm Password */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />

              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>

            </div>

          </div>

          {/* Role */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="staff">Warehouse Staff</option>
              <option value="manager">Inventory Manager</option>
              <option value="admin">Admin</option>
            </select>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>

        </p>

      </div>

    </div>

  )
}

export default Register