'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { supabase } from '@/lib/supabase'

interface NavItem {
  label: string
  url: string
}

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const navItems: NavItem[] = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Aims', url: '/aim' },
    { label: 'Explore', url: '/explore' },
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setIsLoggedIn(!!data.session?.user)
      } catch (err) {
        console.error('Auth check failed:', err)
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for real-time auth changes (login/logout events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <nav className="bg-[#0D530E] backdrop-blur-md text-[#0D530E] border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link className="flex items-center gap-2 group" href="/">
            <Image
              src="/notepad.png"
              alt="NoteHub logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <h2 className="text-2xl font-extrabold tracking-tight bg-clip-text text-white bg-gradient-to-r from-[#0D530E] to-[#1a731b]">
              NoteHub
            </h2>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex text-[15px] font-bold items-center gap-8">
            {navItems.map((item, index) => {
              const isActive = pathname === item.url
              return (
                <Link 
                  key={index} 
                  href={item.url}
                  className={`relative transition-colors hover:text-blue-600 ${
                    isActive ? 'text-white font-bold' : 'text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#0D530E] rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop Call to Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!loading ? (
              isLoggedIn ? (
                <>
                  <Link 
                    className="flex items-center gap-2 border-1 border-gray-200 text-white hover:border-[#0D530E] hover:text-blue-600 transition-all px-5 py-2 font-semibold rounded-xl" 
                    href="/share"
                  >
                    <span>🌍</span> Share
                  </Link>
                  <Link 
                    className="flex items-center gap-2 bg-[#0D530E] text-white hover:bg-[#0a420b] hover:shadow-md hover:-translate-y-0.5 transition-all px-5 py-2 font-semibold rounded-xl" 
                    href="/notes"
                  >
                    <span>✏️</span> Create
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    className="text-white hover:text-blue-600 font-bold border py-1 px-4 rounded-xl transition-colors px-4 py-2" 
                    href="/register"
                  >
                    Sign In
                  </Link>
                  <Link 
                    className="bg-[#0D530E] text-white hover:bg-[#0a420b] hover:shadow-md hover:-translate-y-0.5 transition-all px-6 py-2.5 font-semibold rounded-xl" 
                    href="/register"
                  >
                    Get Started
                  </Link>
                </>
              )
            ) : (
              // Skeleton loading state to prevent layout shift
              <div className="flex gap-4">
                <div className="w-24 h-10 bg-gray-100 animate-pulse rounded-xl" />
                <div className="w-28 h-10 bg-gray-100 animate-pulse rounded-xl" />
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 focus:outline-none focus:ring-2 focus:ring-[#0D530E] rounded-lg bg-gray-50/50"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4 max-h-[calc(100vh-80px)] overflow-y-auto">
          {navItems.map((item, index) => {
            const isActive = pathname === item.url
            return (
              <Link 
                key={index} 
                href={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 text-lg font-medium transition-colors ${
                  isActive ? 'text-[#0D530E]' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          
          <div className="h-px bg-gray-100 my-2" />
          
          {!loading && (
            <div className="flex flex-col gap-3 pb-4">
              {isLoggedIn ? (
                <>
                  <Link 
                    className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 hover:border-[#0D530E] hover:text-[#0D530E] transition-all px-5 py-3 font-semibold rounded-xl" 
                    href="/share"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🌍 Share
                  </Link>
                  <Link 
                    className="flex items-center justify-center gap-2 bg-[#0D530E] text-white hover:bg-[#0a420b] transition-all px-5 py-3 font-semibold rounded-xl" 
                    href="/notes"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ✏️ Create
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    className="flex items-center justify-center border-2 border-[#0D530E] text-[#0D530E] hover:bg-[#0D530E] hover:text-white transition-all px-5 py-3 font-semibold rounded-xl" 
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    className="flex items-center justify-center bg-[#0D530E] text-white hover:bg-[#0a420b] transition-all px-5 py-3 font-semibold rounded-xl" 
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}