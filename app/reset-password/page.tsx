'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiLock,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiLoader,
  FiArrowLeft,
  FiShield,
  FiKey
} from 'react-icons/fi'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sessionChecking, setSessionChecking] = useState(true)

  // Real-time validation states
  const hasMinLength = password.length >= 6
  const passwordsMatch = password.length > 0 && password === confirmPassword

  // Check if user has valid session (established via Supabase reset link)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setError('Invalid or expired password reset link. Please request a new link.')
      }
      setSessionChecking(false)
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Both password fields are required.')
      return
    }

    if (!hasMinLength) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/register')
        }, 3000)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF] relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 antialiased selection:bg-[#0D530E] selection:text-white overflow-hidden">
      {/* Background Lighting Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-50/80 rounded-full blur-3xl opacity-80" />
        <div className="absolute -bottom-40 -left-40 w-80 sm:w-96 h-80 sm:h-96 bg-[#0D530E]/5 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="w-full max-w-md sm:max-w-lg relative z-10 my-auto">
        {/* Navigation & Branding Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#0D530E] transition-colors duration-200 group"
          >
            <FiArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Sign In</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#0D530E] text-white flex items-center justify-center shadow-md shadow-[#0D530E]/20 group-hover:scale-105 transition-transform duration-200">
              <FiKey size={16} />
            </div>
            <span className="text-lg font-extrabold text-[#0D530E] tracking-tight">
              NoteHub
            </span>
          </Link>
        </div>

        {/* Main Card Container */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xl shadow-gray-100/80 p-6 sm:p-8 md:p-10 transition-all">
          {/* Header Icon & Title */}
          <div className="text-center mb-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-[#0D530E] flex items-center justify-center mx-auto shadow-sm">
              <FiLock size={26} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D530E] tracking-tight">
              Create New Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
              Enter a new strong password below to secure your NoteHub account.
            </p>
          </div>

          {success ? (
            /* ---------------- Success View ---------------- */
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 sm:p-5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 rounded-xl flex items-start gap-3.5 shadow-sm">
                <FiCheckCircle
                  className="text-[#0D530E] shrink-0 mt-0.5"
                  size={22}
                />
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-bold text-[#0D530E] text-base">
                    Password Reset Successful!
                  </p>
                  <p className="text-emerald-800 leading-relaxed">
                    Your password has been updated. Redirecting you to sign in...
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
                <FiLoader className="animate-spin text-[#0D530E]" size={16} />
                <span>Redirecting automatically in 3 seconds...</span>
              </div>

              <Link
                href="/register"
                className="w-full py-3.5 bg-[#0D530E] hover:bg-[#0A430B] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#0D530E]/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Sign In Immediately</span>
              </Link>
            </div>
          ) : (
            /* ---------------- Form View ---------------- */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Callout */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200/80 text-red-700 rounded-xl text-xs sm:text-sm flex items-start gap-3 shadow-sm">
                  <FiAlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">{error}</div>
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FiLock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={loading || sessionChecking}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition duration-200 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirm"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FiLock size={18} />
                  </div>
                  <input
                    id="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={loading || sessionChecking}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition duration-200 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Interactive Requirement Criteria */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#0D530E]">
                  <FiShield size={14} />
                  <span>Password Security Checklist</span>
                </div>
                <ul className="space-y-1.5 text-gray-600 pl-1">
                  <li className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                        hasMinLength
                          ? 'bg-[#0D530E] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={
                        hasMinLength ? 'text-gray-900 font-medium' : ''
                      }
                    >
                      At least 6 characters long
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                        passwordsMatch
                          ? 'bg-[#0D530E] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={
                        passwordsMatch ? 'text-gray-900 font-medium' : ''
                      }
                    >
                      Passwords must match
                    </span>
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  loading ||
                  sessionChecking ||
                  !hasMinLength ||
                  !passwordsMatch
                }
                className="w-full py-3.5 bg-[#0D530E] hover:bg-[#0A430B] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#0D530E]/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <FiLoader size={18} className="animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>

              {/* Footer Sign In Redirect */}
              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link
                    href="/register"
                    className="text-[#0D530E] hover:underline font-bold transition duration-200"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-gray-400 mt-6 font-medium">
          Protected by Supabase Authentication &bull; NoteHub
        </p>
      </div>
    </main>
  )
}