'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CreateNoteModal from '@/app/components/CreateNoteModal'
import {
  FiPlus,
  FiSearch,
  FiClock,
  FiFileText,
  FiLogOut,
  FiLayout,
  FiAlertCircle,
  FiFolder,
  FiCalendar,
  FiGrid,
  FiList,
  FiEye,
  FiX,
  FiCopy,
  FiCheck,
  FiTrash2,
  FiLoader,
  FiAlignLeft
} from 'react-icons/fi'

interface Note {
  id: string
  title: string
  description?: string
  content: string
  created_at: string
  updated_at?: string
  is_public?: boolean
  category?: string
}

export default function NotesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Interactive UI Filters & Modals State
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkAuthAndFetchNotes()
  }, [])

  const checkAuthAndFetchNotes = async () => {
    try {
      const { data } = await supabase.auth.getSession()

      if (!data.session?.user) {
        router.push('/register')
        return
      }

      setUser(data.session.user)
      await fetchNotes(data.session.user.id)
    } catch (err) {
      console.error('Auth check failed:', err)
      router.push('/register')
    }
  }

  const fetchNotes = async (userId: string) => {
    try {
      setLoading(true)
      const { data, error: dbError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (dbError) {
        setError(dbError.message)
      } else {
        setNotes(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!noteToDelete) return

    try {
      setIsDeleting(true)
      const { error: dbError } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteToDelete.id)

      if (dbError) {
        setError(dbError.message)
      } else {
        setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteToDelete.id))
        setNoteToDelete(null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete note'
      setError(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/register')
  }

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Filter notes by search query across title, description, or content
  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase()
    return (
      note.title.toLowerCase().includes(query) ||
      (note.description && note.description.toLowerCase().includes(query)) ||
      note.content.toLowerCase().includes(query)
    )
  })

  const userDisplayName = user?.email ? user.email.split('@')[0] : 'User'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center antialiased">
        <div className="w-12 h-12 border-4 border-[#0D530E]/20 border-t-[#0D530E] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-700">Syncing notes with Supabase...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/80 text-gray-900 pb-20 antialiased selection:bg-[#0D530E] selection:text-white">
      
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#0D530E] to-[#127014] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#0D530E]/20 shrink-0">
              {userDisplayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  My Knowledge Base
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D530E] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {notes.length} Notes
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate max-w-xs sm:max-w-md mt-0.5">
                Logged in as <strong className="text-gray-700 font-semibold">{user?.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <Link
              href="/dashboard"
              className="bg-white hover:bg-slate-50 text-gray-700 active:scale-[0.98] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl border border-gray-200 transition-all flex items-center gap-2 shadow-2xs"
            >
              <FiLayout size={16} />
              <span>Dashboard</span>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100/80 text-rose-700 active:scale-[0.98] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl border border-rose-200/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FiLogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Error Alert Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-rose-600 shrink-0" size={20} />
              <p className="text-xs sm:text-sm font-semibold">
                <strong>Error:</strong> {error}
              </p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="p-1 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors cursor-pointer"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* Toolbar: Search, Filters & Action Button */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description or text..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* View Mode Toggle Switch */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-gray-200/60">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#0D530E] shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                title="Grid View"
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#0D530E] shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                title="List View"
              >
                <FiList size={18} />
              </button>
            </div>

            {/* Create New Note CTA */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#0D530E] hover:bg-[#0A430B] active:scale-[0.98] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-[#0D530E]/20 transition-all flex items-center gap-2 group shrink-0 cursor-pointer"
            >
              <FiPlus className="text-lg group-hover:rotate-90 transition-transform duration-200" />
              <span>New Note</span>
            </button>

          </div>

        </div>

        {/* Empty State vs Notes Display */}
        {filteredNotes.length === 0 ? (
          <div className="bg-white p-12 sm:p-16 rounded-3xl border border-gray-200/80 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-emerald-50 text-[#0D530E] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <FiFileText size={32} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                {searchQuery ? 'No matching notes found' : 'Your notebook is empty'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-1 leading-relaxed">
                {searchQuery
                  ? `No notes matched "${searchQuery}". Try clearing your search.`
                  : 'Start capturing your ideas, descriptions, research notes, and goals in one secure workspace.'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-[#0D530E] hover:bg-[#0A430B] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <FiPlus size={16} />
                <span>Create First Note</span>
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="group bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-[#0D530E]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category / Folder Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0D530E] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      <FiFolder size={12} />
                      {note.category || 'General'}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 font-mono">
                      #{note.id.slice(0, 6)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => setSelectedNote(note)}
                    className="text-base font-extrabold text-gray-900 group-hover:text-[#0D530E] transition-colors leading-snug line-clamp-2 mb-2 cursor-pointer"
                  >
                    {note.title}
                  </h3>

                  {/* Description Preview (If Present) */}
                  {note.description && (
                    <p className="text-xs font-semibold text-emerald-950 bg-emerald-50/70 px-3 py-1.5 rounded-xl border border-emerald-100/60 line-clamp-2 mb-3 flex items-center gap-1.5">
                      <FiAlignLeft size={13} className="text-[#0D530E] shrink-0" />
                      <span>{note.description}</span>
                    </p>
                  )}

                  {/* Content Preview */}
                  <p 
                    onClick={() => setSelectedNote(note)}
                    className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-6 cursor-pointer"
                  >
                    {note.content}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-semibold gap-2">
                  <span className="flex items-center gap-1.5">
                    <FiClock size={13} className="text-gray-400" />
                    {new Date(note.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setNoteToDelete(note)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                      title="Delete Note"
                    >
                      <FiTrash2 size={15} />
                    </button>

                    <button
                      onClick={() => setSelectedNote(note)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D530E] bg-emerald-50 hover:bg-[#0D530E] hover:text-white px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-all shrink-0 cursor-pointer"
                    >
                      <FiEye size={14} />
                      <span>Read</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View Layout */
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden divide-y divide-gray-100">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 hover:bg-emerald-50/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0D530E] flex items-center justify-center shrink-0 mt-0.5">
                    <FiFileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 
                        onClick={() => setSelectedNote(note)}
                        className="text-sm font-extrabold text-gray-900 truncate hover:text-[#0D530E] cursor-pointer"
                      >
                        {note.title}
                      </h3>
                      <span className="text-[10px] font-extrabold uppercase text-[#0D530E] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0">
                        {note.category || 'General'}
                      </span>
                    </div>

                    {/* Description preview in list view */}
                    {note.description && (
                      <p className="text-xs font-medium text-emerald-900 truncate max-w-xl mb-0.5">
                        {note.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 truncate max-w-2xl">
                      {note.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 font-medium shrink-0 justify-between sm:justify-end w-full sm:w-auto">
                  <span className="flex items-center gap-1 mr-2">
                    <FiCalendar size={13} />
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => setNoteToDelete(note)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                    title="Delete Note"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  <button
                    onClick={() => setSelectedNote(note)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D530E] bg-emerald-50 hover:bg-[#0D530E] hover:text-white px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-all shrink-0 cursor-pointer"
                  >
                    <FiEye size={14} />
                    <span>Read</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Read Note Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 bg-linear-to-r from-slate-50 via-emerald-50/20 to-white">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0D530E] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    <FiFolder size={12} />
                    {selectedNote.category || 'General'}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                    <FiClock size={12} />
                    {new Date(selectedNote.created_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                  {selectedNote.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedNote(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all shrink-0 cursor-pointer"
                title="Close Modal"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body / Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1 bg-white">
              {/* Optional Description Callout Box */}
              {selectedNote.description && (
                <div className="p-4 bg-emerald-50/80 border border-emerald-100 text-emerald-950 rounded-2xl flex items-start gap-3">
                  <FiAlignLeft className="text-[#0D530E] mt-0.5 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] font-bold text-[#0D530E] uppercase tracking-wider mb-0.5">
                      Description Summary
                    </p>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                      {selectedNote.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="prose prose-slate max-w-none">
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedNote.content}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 bg-slate-50 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
              <span className="text-gray-400 font-medium">
                {selectedNote.content.split(/\s+/).filter(Boolean).length} words · {selectedNote.content.length} chars
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyContent(selectedNote.content)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-gray-700 hover:bg-gray-200/60 font-bold border border-gray-200 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <FiCheck size={14} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy size={14} />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const note = selectedNote
                    setSelectedNote(null)
                    setNoteToDelete(note)
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                  title="Delete this note"
                >
                  <FiTrash2 size={16} />
                </button>

                <button
                  onClick={() => setSelectedNote(null)}
                  className="bg-[#0D530E] hover:bg-[#0A430B] text-white font-bold px-5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-6 space-y-5">
            
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <FiTrash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Delete Note
                </h3>
                <p className="text-xs text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Note Title
              </p>
              <p className="text-sm font-extrabold text-gray-800 line-clamp-1">
                "{noteToDelete.title}"
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete this note permanently from your database?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setNoteToDelete(null)}
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteNote}
                className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <FiLoader className="animate-spin" size={16} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    <span>Delete Note</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create Note Modal Component */}
      {showCreateModal && (
        <CreateNoteModal
          userId={user?.id}
          onNoteCreated={() => {
            setShowCreateModal(false)
            checkAuthAndFetchNotes()
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}

    </div>
  )
}