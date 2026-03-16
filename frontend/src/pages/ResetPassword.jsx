import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearchParams } from "react-router-dom"
import API from "../api/axios"
import toast from "react-hot-toast"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const ResetPassword = () => {

    // ✅ Moved inside the component
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState("")

    const checkPasswordStrength = (password) => {
        const strongRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
        const mediumRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/

        if (strongRegex.test(password)) {
            setPasswordStrength("Strong")
        } else if (mediumRegex.test(password)) {
            setPasswordStrength("Medium")
        } else {
            setPasswordStrength("Weak")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        try {
            setLoading(true)
            await API.post("/auth/reset-password", {
                token,
                newPassword: password
            })
            toast.success("Password updated successfully")
            navigate("/login")
        } catch (error) {
            toast.error("Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/30">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Reset Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                checkPasswordStrength(e.target.value)
                            }}
                            className="w-full px-4 py-2.5 border rounded-lg pr-10"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 cursor-pointer text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <p className="text-sm -mt-2">
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
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border rounded-lg pr-10"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 cursor-pointer text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg"
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword