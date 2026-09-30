'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  FiMail,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiKey
} from 'react-icons/fi'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${
            typeof window !== 'undefined'
              ? window.location.origin
              : 'https://note-hub-3ojz.vercel.app'
          }/reset-password`
        }
      )

      if (resetError) {
        setError(resetError.message)
      } else {
        setSubmittedEmail(trimmedEmail)
        setSuccess(true)
        setEmail('')
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
      {/* Background Decorative Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-50/80 rounded-full blur-3xl opacity-80" />
        <div className="absolute -bottom-40 -left-40 w-80 sm:w-96 h-80 sm:h-96 bg-[#0D530E]/5 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="w-full max-w-md sm:max-w-lg relative z-10 my-auto">
        {/* Navigation & Brand Header */}
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
              <FiMail size={26} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D530E] tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
              Enter your registered email address below and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {success ? (
            /* ---------------- Success View ---------------- */
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 sm:p-5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 rounded-xl flex items-start gap-3.5 shadow-sm">
                <FiCheckCircle
                  className="text-[#0D530E] shrink-0 mt-0.5"
                  size={20}
                />
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-bold text-[#0D530E]">Check your inbox!</p>
                  <p className="text-emerald-800 leading-relaxed">
                    We&apos;ve sent a password reset link to{' '}
                    <span className="font-bold text-emerald-950 underline decoration-emerald-300">
                      {submittedEmail}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 text-xs text-gray-600 leading-relaxed space-y-1">
                <p className="font-bold text-gray-800">Need help?</p>
                <p>
                  The link expires in 1 hour. If you don&apos;t see the email, check your spam folder or try re-entering your email address.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false)
                    setError(null)
                  }}
                  className="w-full py-3.5 bg-gray-100 hover:bg-gray-200/80 text-[#0D530E] font-bold text-xs sm:text-sm rounded-xl border border-gray-200/80 transition duration-200 active:scale-[0.99] cursor-pointer"
                >
                  Resend Reset Link
                </button>

                <Link
                  href="/register"
                  className="w-full py-3.5 bg-[#0D530E] hover:bg-[#0A430B] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#0D530E]/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <FiArrowLeft size={16} />
                  <span>Return to Sign In</span>
                </Link>
              </div>
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

              {/* Input Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FiMail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition duration-200 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-3.5 bg-[#0D530E] hover:bg-[#0A430B] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#0D530E]/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <>
                    <FiLoader size={18} className="animate-spin" />
                    <span>Sending Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              {/* Sign In Redirect Link */}
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