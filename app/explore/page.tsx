'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  FiGlobe,
  FiSearch,
  FiPlus,
  FiFileText,
  FiUser,
  FiClock,
  FiCalendar,
  FiShare2,
  FiX,
  FiRefreshCw,
  FiCheck,
  FiCompass,
  FiBookOpen,
  FiAlertCircle,
  FiTrash2,
  FiAlertTriangle,
  FiLoader,
  FiHeart
} from 'react-icons/fi'

interface PublicNote {
  id: string
  title: string
  content: string
  created_at: string
  user_id: string
  likes_count: number
  user_has_liked: boolean
}

export default function ExplorePage() {
  const router = useRouter()
  
  const [notes, setNotes] = useState<PublicNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Auth state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Modals & Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [readNote, setReadNote] = useState<PublicNote | null>(null)
  const [noteToDelete, setNoteToDelete] = useState<PublicNote | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [likeLoadingIds, setLikeLoadingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    checkAuthAndFetchNotes()
  }, [])

  const checkAuthAndFetchNotes = async () => {
    try {
      const { data, error: authError } = await supabase.auth.getSession()
      const user = data.session?.user
      
      if (authError || !user) {
        router.push('/register')
        return
      }

      setCurrentUserId(user.id)
      await fetchPublicNotes(user.id)
    } catch (err) {
      console.error('Error checking auth state:', err)
      router.push('/register')
    }
  }

  const fetchPublicNotes = async (userId = currentUserId) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: dbError } = await supabase
        .from('notes')
        .select('id, title, content, created_at, user_id')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (dbError) {
        console.error('Database error:', dbError)
        setError(`Error fetching notes: ${dbError.message}`)
      } else {
        const publicNotes = data || []
        const noteIds = publicNotes.map((note) => note.id)
        const { data: likeRows, error: likesError } = noteIds.length
          ? await supabase
              .from('note_likes')
              .select('note_id, user_id')
              .in('note_id', noteIds)
          : { data: [], error: null }

        if (likesError) {
          throw likesError
        }

        const likesByNote = new Map<string, { count: number; liked: boolean }>()
        likeRows?.forEach((like) => {
          const current = likesByNote.get(like.note_id) || { count: 0, liked: false }
          likesByNote.set(like.note_id, {
            count: current.count + 1,
            liked: current.liked || like.user_id === userId,
          })
        })

        setNotes(
          publicNotes.map((note) => {
            const likes = likesByNote.get(note.id) || { count: 0, liked: false }
            return {
              ...note,
              likes_count: likes.count,
              user_has_liked: likes.liked,
            }
          }),
        )
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('Fetch error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (noteId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()

    if (!currentUserId || likeLoadingIds.has(noteId)) return

    const note = notes.find((item) => item.id === noteId)
    if (!note || note.user_id === currentUserId) return

    const wasLiked = note.user_has_liked
    const nextLiked = !wasLiked

    setLikeLoadingIds((ids) => new Set(ids).add(noteId))
    setNotes((items) =>
      items.map((item) =>
        item.id === noteId
          ? {
              ...item,
              user_has_liked: nextLiked,
              likes_count: Math.max(0, item.likes_count + (nextLiked ? 1 : -1)),
            }
          : item,
      ),
    )

    setReadNote((openNote) =>
      openNote?.id === noteId
        ? {
            ...openNote,
            user_has_liked: nextLiked,
            likes_count: Math.max(0, openNote.likes_count + (nextLiked ? 1 : -1)),
          }
        : openNote,
    )
    const { error: likeError } = nextLiked
      ? await supabase.from('note_likes').insert({ note_id: noteId, user_id: currentUserId })
      : await supabase
          .from('note_likes')
          .delete()
          .eq('note_id', noteId)
          .eq('user_id', currentUserId)

    if (likeError) {
      setNotes((items) =>
        items.map((item) =>
          item.id === noteId
            ? {
                ...item,
                user_has_liked: wasLiked,
                likes_count: Math.max(0, item.likes_count + (wasLiked ? 1 : -1)),
              }
            : item,
        ),
      )
      setReadNote((openNote) =>
        openNote?.id === noteId
          ? {
              ...openNote,
              user_has_liked: wasLiked,
              likes_count: Math.max(0, openNote.likes_count + (wasLiked ? 1 : -1)),
            }
          : openNote,
      )
      setError(`Unable to update like: ${likeError.message}`)
    }

    setLikeLoadingIds((ids) => {
      const nextIds = new Set(ids)
      nextIds.delete(noteId)
      return nextIds
    })
  }

  const handleDeleteNote = async () => {
    if (!noteToDelete || !currentUserId) return
    if (noteToDelete.user_id !== currentUserId) {
      alert("Unauthorized: You can only delete your own posts.")
      return
    }

    try {
      setIsDeleting(true)

      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteToDelete.id)
        .eq('user_id', currentUserId)

      if (deleteError) {
        throw deleteError
      }

      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteToDelete.id))
      
      if (readNote?.id === noteToDelete.id) {
        setReadNote(null)
      }

      setNoteToDelete(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete note'
      console.error('Delete error:', msg)
      alert(`Error deleting note: ${msg}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes
    const q = searchQuery.toLowerCase()
    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(q) ||
        note.content?.toLowerCase().includes(q)
    )
  }, [notes, searchQuery])

  const getReadTime = (text: string) => {
    const words = text ? text.trim().split(/\s+/).length : 0
    const minutes = Math.max(1, Math.ceil(words / 200))
    return `${minutes} min read`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Recently'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateStr))
  }

  const getUserHandle = (userId: string) => {
    if (!userId) return 'Contributor'
    if (userId === currentUserId) return 'You'
    return `User #${userId.substring(0, 6)}`
  }

  const handleCopyLink = (noteId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const url = `${window.location.origin}/explore#${noteId}`
    navigator.clipboard.writeText(url)
    setCopiedId(noteId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading && !currentUserId) {
    return (
      <div className="min-h-screen bg-slate-50/80 flex flex-col items-center justify-center p-4">
        <FiLoader size={36} className="animate-spin text-[#0D530E]" />
        <p className="mt-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Explore Feed...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 pb-20 antialiased selection:bg-[#0D530E] selection:text-white overflow-x-hidden">
      
      {/* Glassmorphic Responsive Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#0D530E] text-white flex items-center justify-center font-bold shadow-md shadow-[#0D530E]/20 shrink-0 ring-2 ring-emerald-600/10">
              <FiGlobe size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
                  Explore
                </h1>
                <span className="hidden md:inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#0D530E] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                  Public Knowledge
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block truncate">
                Discover community insights and public notes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/notes"
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1.5 sm:gap-2 shadow-sm active:scale-95"
            >
              <FiBookOpen size={16} />
              <span className="hidden sm:inline">My Notes</span>
            </Link>
            <Link
              href="/share"
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-[#0D530E] hover:bg-[#0A430B] active:scale-95 text-white rounded-xl transition-all duration-200 shadow-md shadow-[#0D530E]/20 flex items-center gap-1.5 sm:gap-2 shrink-0"
            >
              <FiPlus size={16} className="stroke-[3]" />
              <span>Share Note</span>
            </Link>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        
        {/* Responsive Hero Banner */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-[#0D530E] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl overflow-hidden border border-slate-800">
          <div className="absolute -top-24 -right-24 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 sm:w-96 sm:h-96 bg-[#0D530E]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-semibold backdrop-blur-md">
                <span>Open Community Feed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Explore Community Knowledge
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
                Browse public notes shared by the community. Tap any card to open and read the full entry.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 p-3 sm:p-3.5 rounded-2xl shrink-0 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0">
                <FiCompass size={20} />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs text-slate-300 font-medium block">Public Notes</span>
                <span className="text-base sm:text-lg font-black text-white">{notes.length} Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Search community notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D530E]/30 focus:border-[#0D530E] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 font-semibold px-1 shrink-0">
            <span>Showing {filteredNotes.length} of {notes.length} entries</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#0D530E] hover:underline font-bold ml-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
              <FiAlertCircle className="text-rose-600 shrink-0" size={20} />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchPublicNotes()}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
            >
              <FiRefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200/60 p-5 sm:p-6 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="w-20 h-4 bg-slate-200 rounded-full" />
                  <div className="w-16 h-4 bg-slate-200 rounded" />
                </div>
                <div className="w-3/4 h-6 bg-slate-200 rounded" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-slate-200 rounded" />
                  <div className="w-5/6 h-4 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 sm:py-16 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shrink-0">
              <FiFileText size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {searchQuery ? 'No matching notes found' : 'No public notes yet'}
              </h3>
              <p className="text-xs text-slate-500">
                {searchQuery
                  ? `Try adjusting your search query "${searchQuery}"`
                  : 'Be the first member to share a public note with the community!'}
              </p>
            </div>
            
            <Link
              href="/share"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0D530E] hover:bg-[#0A430B] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition w-full sm:w-auto"
            >
              <FiPlus size={16} />
              <span>Share Your Note</span>
            </Link>
          </div>
        ) : (
          /* Notes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredNotes.map((note) => {
              const isOwner = currentUserId && currentUserId === note.user_id

              return (
                <article
                  key={note.id}
                  onClick={() => setReadNote(note)}
                  className="group bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-[#0D530E]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden active:scale-[0.99] md:active:scale-100"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0D530E] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        <FiGlobe size={11} />
                        Public
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <FiClock size={12} />
                        {getReadTime(note.content)}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#0D530E] transition-colors line-clamp-2 leading-snug break-words">
                      {note.title || 'Untitled Note'}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed font-normal break-words">
                      {note.content}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2 font-medium min-w-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${isOwner ? 'bg-emerald-100 text-[#0D530E]' : 'bg-slate-100 text-slate-600'}`}>
                        <FiUser size={12} />
                      </div>
                      <span className={`truncate max-w-[80px] sm:max-w-[100px] font-semibold text-xs ${isOwner ? 'text-[#0D530E]' : 'text-slate-700'}`}>
                        {getUserHandle(note.user_id)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
                        <FiCalendar size={12} />
                        {formatDate(note.created_at)}
                      </span>

                      {!isOwner && (
                        <button
                          onClick={(e) => handleLike(note.id, e)}
                          disabled={likeLoadingIds.has(note.id)}
                          title={note.user_has_liked ? 'Unlike note' : 'Like note'}
                          className={`p-2 rounded-lg transition active:scale-90 disabled:opacity-50 ${note.user_has_liked ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'}`}
                        >
                          <FiHeart size={14} fill={note.user_has_liked ? 'currentColor' : 'none'} />
                          <span className="sr-only">{note.user_has_liked ? 'Unlike' : 'Like'}</span>
                        </button>
                      )}

                      <span className="text-[10px] font-semibold text-slate-400 min-w-4 text-center">
                        {note.likes_count}
                      </span>

                      <button
                        onClick={(e) => handleCopyLink(note.id, e)}
                        title="Copy Share Link"
                        className="p-2 text-slate-400 hover:text-[#0D530E] hover:bg-emerald-50 rounded-lg transition active:scale-90"
                      >
                        {copiedId === note.id ? <FiCheck size={14} className="text-emerald-600" /> : <FiShare2 size={14} />}
                      </button>

                      {/* Owner-only Delete Button */}
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setNoteToDelete(note)
                          }}
                          title="Delete Note"
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition active:scale-90"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

      </main>

      {/* 📖 READ MODAL */}
      {readNote && (
        <div
          onClick={() => setReadNote(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto"
          >
            {/* Reader Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50 shrink-0">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0D530E] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    Community Note
                  </span>
                  <span className="text-xs text-slate-400 font-medium truncate">
                    {formatDate(readNote.created_at)}
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug break-words">
                  {readNote.title}
                </h3>
              </div>

              <button
                onClick={() => setReadNote(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition shrink-0"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Reader Content Body */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-4 font-normal text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {readNote.content}
            </div>

            {/* Reader Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 shrink-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <FiUser size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">By: {getUserHandle(readNote.user_id)}</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5">
                {currentUserId && currentUserId !== readNote.user_id && (
                  <button
                    onClick={() => handleLike(readNote.id)}
                    disabled={likeLoadingIds.has(readNote.id)}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 ${readNote.user_has_liked ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700'}`}
                  >
                    <FiHeart size={14} fill={readNote.user_has_liked ? 'currentColor' : 'none'} />
                    <span>{readNote.user_has_liked ? 'Liked' : 'Like'} ({readNote.likes_count})</span>
                  </button>
                )}

                <button
                  onClick={() => handleCopyLink(readNote.id)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {copiedId === readNote.id ? <FiCheck size={14} className="text-emerald-600" /> : <FiShare2 size={14} />}
                  <span>{copiedId === readNote.id ? 'Copied' : 'Share'}</span>
                </button>

                {currentUserId && currentUserId === readNote.user_id && (
                  <button
                    onClick={() => setNoteToDelete(readNote)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <FiTrash2 size={14} />
                    <span>Delete</span>
                  </button>
                )}

                <button
                  onClick={() => setReadNote(null)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition text-center active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🗑️ DELETE CONFIRMATION MODAL */}
      {noteToDelete && (
        <div
          onClick={() => !isDeleting && setNoteToDelete(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-center my-auto"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shrink-0">
              <FiAlertTriangle size={28} className="sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Delete Public Note?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed break-words">
                Are you sure you want to remove <span className="font-bold text-slate-800">"{noteToDelete.title}"</span>? This action is permanent.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setNoteToDelete(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition disabled:opacity-50 active:scale-95"
              >
                Cancel
              </button>

              <button
                disabled={isDeleting}
                onClick={handleDeleteNote}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 disabled:opacity-50 active:scale-95"
              >
                {isDeleting ? (
                  <>
                    <FiLoader size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}