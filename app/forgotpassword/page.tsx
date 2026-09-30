'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'https://note-hub-3ojz.vercel.app'}/reset-password`,
})

      if (resetError) {
        setError(resetError.message)
      } else {
        setSuccess(true)
        setEmail('')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* Back Button */}
        <Link 
          href="/register"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <FiArrowLeft size={18} />
          Back to Sign In
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-blue-600" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {success ? (
            // Success Message
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-3">
                <FiCheckCircle className="shrink-0" size={20} />
                <div>
                  <p className="font-semibold">Check your email!</p>
                  <p className="text-sm">We've sent a password reset link to {email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                The link will expire in 1 hour. If you don't see it, check your spam folder.
              </p>
              <Link
                href="/register"
                className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-center transition"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                  ❌ {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}