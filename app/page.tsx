'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import {
  FiEdit3,
  FiLayers,
  FiShare2,
  FiArrowRight,
  FiGlobe,
  FiLock,
  FiZap,
  FiChevronDown,
  FiBookOpen,
  FiUsers,
  FiClock,
  FiPlus,
  FiLoader
} from 'react-icons/fi'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Auth Session State
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const features = [
    {
      title: 'Distraction-Free Writing',
      description:
        'Focus on your thoughts with a clean, responsive editor designed for speed, structure, and instant clarity.',
      icon: <FiEdit3 size={26} />,
      badge: 'Editor'
    },
    {
      title: 'Community Explore Feed',
      description:
        'Publish notes publicly to share knowledge with the world or discover valuable insights written by others.',
      icon: <FiGlobe size={26} />,
      badge: 'Social'
    },
    {
      title: 'Effortless Organization',
      description:
        'Keep your personal workspace structured with custom tags, folders, and fast search capabilities.',
      icon: <FiLayers size={26} />,
      badge: 'Workflow'
    },
    {
      title: 'One-Click Public Sharing',
      description:
        'Generate shareable links instantly so friends, teammates, or readers can access your notes securely.',
      icon: <FiShare2 size={26} />,
      badge: 'Sharing'
    },
    {
      title: 'Private & Secure Vault',
      description:
        'Your private notes remain encrypted and strictly accessible only to you through Supabase authentication.',
      icon: <FiLock size={26} />,
      badge: 'Security'
    },
    {
      title: 'Lightning Fast Sync',
      description:
        'Instant cloud synchronization ensures your thoughts and documentation are always up to date across devices.',
      icon: <FiZap size={26} />,
      badge: 'Performance'
    }
  ]

  const metrics = [
    { label: 'Active Thinkers', value: '15,000+' },
    { label: 'Public Notes Shared', value: '45,000+' },
    { label: 'Cloud Uptime', value: '99.9%' },
    { label: 'Community Rating', value: '4.9 / 5' }
  ]

  const sampleNotes = [
    {
      title: 'Next.js 14 App Router Best Practices',
      excerpt:
        'Server components allow us to fetch data directly on the server without extra client-side state hooks...',
      author: 'Alex Rivera',
      time: '3 min read',
      tag: 'Development'
    },
    {
      title: 'Daily System Architecture Checklist',
      excerpt:
        '1. Ensure database row level security is active. 2. Verify response caching strategies. 3. Monitor memory usage...',
      author: 'Sarah Chen',
      time: '5 min read',
      tag: 'Engineering'
    },
    {
      title: 'Designing Clean UI with Tailwind CSS',
      excerpt:
        'Utilize generous padding, high-contrast dark greens, subtle gradients, and rounded corners for maximum readability...',
      author: 'Marcus Vance',
      time: '4 min read',
      tag: 'Design'
    }
  ]

  const faqs = [
    {
      question: 'Is NoteHub free to use?',
      answer:
        'Yes! NoteHub is 100% free to create an account, write private notes, and publish public articles to the community explore feed.'
    },
    {
      question: 'Who can see my notes?',
      answer:
        'By default, all personal notes are completely private and accessible only when logged into your account. When you choose to publish via "Share Note", it becomes viewable on the Explore feed.'
    },
    {
      question: 'Can I edit or delete my public posts?',
      answer:
        'Absolutely. You maintain total ownership of your content. You can manage or permanently delete your posts at any time directly from the Explore page.'
    },
    {
      question: 'Do I need an account to browse public notes?',
      answer:
        'No account is required to read community posts on the Explore page! However, signing up allows you to publish your own notes and build your library.'
    }
  ]

  return (
    <main className="min-h-screen bg-[#FFFFFF] flex flex-col antialiased selection:bg-[#0D530E] selection:text-white">
      {/* ---------------- 1. Hero Section ---------------- */}
      <section className="relative bg-[url('/noteshub-hero-bg.svg')] bg-cover bg-center min-h-[90vh] w-full flex flex-col items-center justify-center py-20 px-6 overflow-hidden">
        {/* Deep Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D530E]/90 via-[#0D530E]/80 to-[#0D530E]/95 z-0" />

        {/* Content Container (z-10 ensures clickability & proper stacking over absolute overlay) */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Subtle Feature Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium mb-8 border border-white/20 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
            Smart & Effortless Note Taking
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#FFFFFF] mb-6 tracking-tight leading-[1.1] drop-shadow-md">
            Welcome to{' '}
            <span className="underline decoration-emerald-400/80 decoration-4 underline-offset-8">
              NoteHub
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#FFFFFF]/90 mb-10 max-w-2xl font-normal leading-relaxed drop-shadow-sm">
            Your ultimate note-taking and documentation platform. Capture, organize, and share your thoughts effortlessly. Start your journey to better productivity today!
          </p>

          {/* Dynamic Hero Call To Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center mb-16 min-h-[56px]">
            {authLoading ? (
              /* Loading skeleton while checking auth state */
              <div className="px-8 py-3.5 bg-white/10 rounded-xl text-white/70 text-sm font-bold flex items-center gap-2 border border-white/20 animate-pulse">
                <FiLoader className="animate-spin" size={18} />
                <span>Checking status...</span>
              </div>
            ) : session ? (
              /* Signed In State */
              <>
                <Link
                  href="/notes"
                  className="w-full sm:w-auto bg-[#FFFFFF] text-[#0D530E] hover:bg-emerald-50 active:scale-[0.98] transition-all duration-200 px-8 py-3.5 text-lg font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 group"
                >
                  <FiBookOpen size={20} />
                  <span>Go to Workspace</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/share"
                  className="w-full sm:w-auto border-2 border-[#FFFFFF]/80 text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#0D530E] active:scale-[0.98] transition-all duration-200 px-8 py-3.5 text-lg font-bold rounded-xl backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <FiPlus size={20} />
                  <span>Share New Note</span>
                </Link>
              </>
            ) : (
              /* Signed Out / Guest State */
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-[#FFFFFF] text-[#0D530E] hover:bg-emerald-50 active:scale-[0.98] transition-all duration-200 px-8 py-3.5 text-lg font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span>Get Started</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto border-2 border-[#FFFFFF]/80 text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#0D530E] active:scale-[0.98] transition-all duration-200 px-8 py-3.5 text-lg font-bold rounded-xl backdrop-blur-sm flex items-center justify-center"
                >
                  Learn More
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- 2. Metrics Bar ---------------- */}
      <section className="bg-white border-b border-gray-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-gray-100">
            {metrics.map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="text-2xl sm:text-4xl font-extrabold text-[#0D530E] tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 3. Features Section ---------------- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-[#0D530E] font-bold text-xs sm:text-sm tracking-widest uppercase bg-[#0D530E]/10 px-3.5 py-1.5 rounded-full border border-[#0D530E]/20">
            Why NoteHub
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0D530E] mt-4 mb-4 tracking-tight">
            Everything you need to stay organized
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            NoteHub is designed to help you focus on what matters most. No clutter, just clean and powerful tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col justify-between p-8 rounded-2xl bg-white border border-gray-200/80 hover:border-[#0D530E]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-4 rounded-2xl bg-[#0D530E]/10 text-[#0D530E] group-hover:bg-[#0D530E] group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D530E] bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0D530E]">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-normal">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-xs font-bold text-[#0D530E]">
                <span>Explore capability</span>
                <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 4. Explore Preview Feed ---------------- */}
      <section id="explore-preview" className="bg-emerald-50/60 border-y border-emerald-100/80 py-24 px-6 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[#0D530E] font-extrabold text-xs tracking-widest uppercase bg-white border border-[#0D530E]/20 px-3.5 py-1.5 rounded-full shadow-sm">
                Community Feed
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0D530E] tracking-tight">
                Discover trending public notes
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Read notes and guides published by developers and creators in the NoteHub community.
              </p>
            </div>

            <Link
              href="/explore"
              className="px-6 py-3.5 bg-[#0D530E] hover:bg-[#0A430B] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-[#0D530E]/20 flex items-center gap-2 self-start md:self-auto"
            >
              <span>View Explore Feed</span>
              <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleNotes.map((note) => (
              <div
                key={note.title}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between hover:border-[#0D530E]/30 hover:shadow-xl transition duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D530E] bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                      {note.tag}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                      <FiClock size={12} />
                      {note.time}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0D530E] leading-snug">
                    {note.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {note.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#0D530E]/10 text-[#0D530E] flex items-center justify-center font-bold text-[10px]">
                      <FiUsers size={12} />
                    </div>
                    <span className="font-semibold text-gray-700">{note.author}</span>
                  </div>

                  <Link
                    href="/explore"
                    className="text-[#0D530E] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Read</span>
                    <FiArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 5. FAQ Accordion ---------------- */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16 space-y-3">
          <span className="text-[#0D530E] font-bold text-xs sm:text-sm tracking-widest uppercase bg-[#0D530E]/10 px-3.5 py-1.5 rounded-full border border-[#0D530E]/20">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D530E] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div
                key={faq.question}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-[#0D530E] text-sm sm:text-base hover:bg-emerald-50/50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <FiChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 text-[#0D530E] ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------------- 6. Call to Action (CTA) Section ---------------- */}
      <section className="relative overflow-hidden bg-[#0D530E] py-20 px-6 mt-auto">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FFFFFF] tracking-tight">
            Ready to boost your productivity?
          </h2>

          <p className="text-[#FFFFFF]/90 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
            Join thousands of users who are already organizing their life and work with NoteHub.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center pt-2">
            {session ? (
              <>
                <Link
                  href="/notes"
                  className="w-full sm:w-auto bg-[#FFFFFF] text-[#0D530E] hover:bg-emerald-50 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 px-8 py-4 text-base font-bold rounded-xl shadow-xl flex items-center justify-center gap-2"
                >
                  <FiBookOpen size={18} />
                  <span>Go to My Notes</span>
                </Link>
                <Link
                  href="/explore"
                  className="w-full sm:w-auto border-2 border-white/80 text-white hover:bg-white hover:text-[#0D530E] active:scale-95 transition-all duration-200 px-8 py-4 text-base font-bold rounded-xl backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <FiGlobe size={18} />
                  <span>Explore Feed</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-[#FFFFFF] text-[#0D530E] hover:bg-emerald-50 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 px-8 py-4 text-base font-bold rounded-xl shadow-xl"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/explore"
                  className="w-full sm:w-auto border-2 border-white/80 text-white hover:bg-white hover:text-[#0D530E] active:scale-95 transition-all duration-200 px-8 py-4 text-base font-bold rounded-xl backdrop-blur-sm"
                >
                  Explore Public Feed
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}