'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import {
  FiFileText,
  FiPlus,
  FiLogOut,
  FiUser,
  FiZap,
  FiArrowRight,
  FiBookOpen,
  FiLayers
} from 'react-icons/fi'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [notesCount, setNotesCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

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
      await fetchNotesCount(data.session.user.id)
    } catch (err) {
      console.error('Auth check failed:', err)
      router.push('/register')
    } finally {
      setLoading(false)
    }
  }

  const fetchNotesCount = async (userId: string) => {
    try {
      const { count, error: dbError } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (dbError) {
        console.error('Error fetching notes count:', dbError)
      } else {
        setNotesCount(count || 0)
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/register')
  }

  const userDisplayName = user?.email ? user.email.split('@')[0] : 'Member'

  // Dynamic Skeleton Loading UI synchronized with actual grid
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/80 pb-20 antialiased">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-200 animate-pulse shrink-0" />
              <div className="space-y-2">
                <div className="w-24 sm:w-32 h-4 bg-slate-200 rounded animate-pulse" />
                <div className="w-16 sm:w-20 h-3 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-10 h-10 sm:w-24 sm:h-9 bg-slate-200 rounded-xl animate-pulse shrink-0" />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          <div className="h-48 sm:h-44 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-white rounded-3xl border border-slate-200/60 p-6 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 w-full">
                    <div className="w-1/3 h-3 bg-slate-200 rounded" />
                    <div className="w-1/2 h-6 bg-slate-200 rounded" />
                  </div>
                  <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                </div>
                <div className="w-2/3 h-4 bg-slate-200 rounded mt-4" />
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 pb-20 antialiased selection:bg-[#0D530E] selection:text-white overflow-x-hidden">
      
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#0D530E] to-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#0D530E]/20 shrink-0 ring-2 ring-emerald-600/10">
              {userDisplayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
                  Dashboard
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#0D530E] bg-emerald-50/90 px-2.5 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-[140px] sm:max-w-xs font-medium">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-rose-50/80 hover:bg-rose-100/80 text-rose-700 active:scale-95 text-xs sm:text-sm font-bold p-2.5 sm:px-4 sm:py-2.5 rounded-xl border border-rose-200/80 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shrink-0"
            title="Sign Out"
          >
            <FiLogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        
        {/* Welcome Hero Banner */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-[#0D530E] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl overflow-hidden border border-slate-800">
          {/* Subtle Ambient Background Orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 sm:w-96 sm:h-96 bg-[#0D530E]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-3 sm:space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-semibold backdrop-blur-md">
                <span>Knowledge Management Portal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Welcome back, <span className="capitalize text-emerald-400 break-words">{userDisplayName}</span>!
              </h2>
              <p className="text-slate-300 text-sm font-normal leading-relaxed">
                Organize thoughts, manage research, and streamline your workflow with your personal workspace notes.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
              <Link
                href="/notes"
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-sm px-6 py-3.5 sm:py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5"
              >
                <FiPlus size={18} className="stroke-[3]" />
                <span>Open Notes Page</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Notes Count */}
          <div className="group bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Knowledge Items</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{notesCount}</h3>
                <p className="text-xs text-slate-500 font-medium">Total saved notes in database</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-[#0D530E] flex items-center justify-center font-bold shrink-0 ring-4 ring-emerald-50/60 group-hover:scale-110 transition-transform">
                <FiFileText size={20} className="sm:w-[22px] sm:h-[22px]" />
              </div>
            </div>

            <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/notes"
                className="text-xs font-extrabold text-[#0D530E] hover:text-emerald-700 flex items-center gap-1.5 transition-colors group/link"
              >
                <span>View all notes</span>
                <FiArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
              <span className="text-[9px] sm:text-[10px] font-extrabold font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                Live Data
              </span>
            </div>
          </div>

          {/* Card 2: Quick Actions */}
          <div className="group bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Capture Ideas</h3>
                <p className="text-xs text-slate-500 font-medium">Create and categorize new entries</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0 ring-4 ring-amber-50/60 group-hover:scale-110 transition-transform">
                <FiZap size={20} className="sm:w-[22px] sm:h-[22px]" />
              </div>
            </div>

            <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/notes"
                className="w-full bg-slate-900 hover:bg-[#0D530E] text-white active:scale-95 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <FiPlus size={16} />
                <span>Go to Workspace</span>
              </Link>
            </div>
          </div>

          {/* Card 3: User Status */}
          <div className="group bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between gap-4 w-full">
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Account Overview</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Active Status</h3>
                <p className="text-xs text-slate-500 font-medium truncate w-full" title={user?.email}>
                  {user?.email}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0 ring-4 ring-indigo-50/60 group-hover:scale-110 transition-transform">
                <FiUser size={20} className="sm:w-[22px] sm:h-[22px]" />
              </div>
            </div>

            <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                Auth Verified
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Active Session
              </span>
            </div>
          </div>

        </div>

        {/* Workspace Quick Navigation Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mb-2 md:mb-0">
              <FiBookOpen size={24} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Ready to manage your workspace?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 sm:mt-0.5 max-w-md">
                Access all categories, filters, and note details directly from your knowledge engine.
              </p>
            </div>
          </div>

          <Link
            href="/notes"
            className="w-full md:w-auto bg-[#0D530E] hover:bg-[#0A430B] active:scale-95 text-white font-extrabold text-sm px-6 py-3.5 sm:py-3 rounded-xl transition-all shadow-md shadow-[#0D530E]/20 flex items-center justify-center gap-2 shrink-0"
          >
            <FiLayers size={16} />
            <span>Open Knowledge Base</span>
          </Link>
        </div>

      </main>
    </div>
  )
}