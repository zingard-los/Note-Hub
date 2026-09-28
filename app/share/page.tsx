'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiGlobe,
  FiBookOpen,
  FiCompass,
  FiLogOut,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiEdit3,
  FiArrowLeft,
  FiLoader,
  FiInfo,
  FiUser
} from 'react-icons/fi'

export default function SharePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession()

      if (!data.session?.user) {
        router.push('/register')
        return
      }

      setUser(data.session.user)
    } catch (err) {
      console.error('Auth check failed:', err)
      router.push('/register')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)

    try {
      const { error: dbError } = await supabase.from('notes').insert([
        {
          title: title.trim(),
          content: content.trim(),
          user_id: user?.id,
          is_public: true // Public post flag
        }
      ])

      if (dbError) {
        setError(dbError.message)
      } else {
        setSuccess(true)
        setTitle('')
        setContent('')
        setTimeout(() => {
          router.push('/explore')
        }, 1800)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/register')
  }

  // Calculate word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 pb-20 antialiased selection:bg-[#0D530E] selection:text-white">
      {/* Glassmorphic Navigation Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link
            href="/explore"
            className="flex items-center gap-3 group transition"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#0D530E] text-white flex items-center justify-center font-bold shadow-md shadow-[#0D530E]/20 group-hover:scale-105 transition-transform shrink-0">
              <FiGlobe size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-[#0D530E] transition-colors">
                  Share Note
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#0D530E] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  Public Feed
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Publish knowledge to the community explore feed
              </p>
            </div>
          </Link>

          {/* Nav Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/notes"
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm"
            >
              <FiBookOpen size={16} />
              <span className="hidden sm:inline">My Notes</span>
            </Link>

            <Link
              href="/explore"
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 shadow-sm"
            >
              <FiCompass size={16} />
              <span className="hidden sm:inline">Explore</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Banner Card */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-[#0D530E] rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-slate-800">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0D530E]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <span>Create Public Post</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Share Knowledge with Everyone
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
                Write insights, guides, or notes. Once published, your post will be immediately visible on the global Explore page.
              </p>
            </div>

            {user?.email && (
              <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                  <FiUser size={18} />
                </div>
                <div className="text-xs">
                  <span className="text-slate-400 block font-medium">Publishing as</span>
                  <span className="font-bold text-white max-w-[160px] truncate block">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 shadow-sm text-xs sm:text-sm font-medium animate-fadeIn">
            <FiAlertCircle className="text-rose-600 shrink-0" size={20} />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 shadow-sm text-xs sm:text-sm font-medium animate-fadeIn">
            <FiCheckCircle className="text-emerald-600 shrink-0" size={20} />
            <span className="flex-1">
              Note published successfully! Redirecting you to the Explore feed...
            </span>
          </div>
        )}

        {/* Main Editor Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Input Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FiFileText size={14} className="text-[#0D530E]" />
                <span>Note Title <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your public note a title..."
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D530E]/30 focus:border-[#0D530E] focus:bg-white transition-all"
                disabled={loading}
                required
              />
            </div>

            {/* Content Textarea Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FiEdit3 size={14} className="text-[#0D530E]" />
                  <span>Content</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-400">
                  {wordCount} words
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note content, thoughts, or guide here..."
                rows={10}
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D530E]/30 focus:border-[#0D530E] focus:bg-white transition-all leading-relaxed"
                disabled={loading}
              />
            </div>

            {/* Public Notice Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0D530E] flex items-center justify-center shrink-0 mt-0.5">
                <FiGlobe size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#0D530E] uppercase tracking-wider">
                  Public Visibility Notice
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  This note will be publicly viewable by all users in the Explore community feed. You can delete your own posts at any time from the Explore page.
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center gap-3">
              <Link
                href="/explore"
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs rounded-xl transition text-center flex items-center justify-center gap-2"
              >
                <FiArrowLeft size={16} />
                <span>Cancel</span>
              </Link>

              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="w-full sm:flex-1 py-3.5 px-6 bg-[#0D530E] hover:bg-[#0A430B] active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold text-xs rounded-xl transition-all duration-200 shadow-md shadow-[#0D530E]/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader size={16} className="animate-spin" />
                    <span>Publishing Note...</span>
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    <span>Publish Note Now</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}