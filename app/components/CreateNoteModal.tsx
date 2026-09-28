'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FiX, FiSave, FiAlertCircle, FiFolder, FiLoader, FiAlignLeft, FiType } from 'react-icons/fi'

interface CreateNoteModalProps {
  userId: string
  onNoteCreated: () => void
  onClose: () => void
}

export default function CreateNoteModal({ userId, onNoteCreated, onClose }: CreateNoteModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, isSubmitting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { error: dbError } = await supabase
        .from('notes')
        .insert([{
          user_id: userId,
          title: title.trim(),
          description: description.trim(),
          category: category.trim() || 'General',
          content: content.trim()
        }])

      if (dbError) throw dbError

      onNoteCreated()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create note'
      setError(errorMessage)
      setIsSubmitting(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose()
        }
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] transition-all">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4 bg-linear-to-r from-slate-50 via-emerald-50/30 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0D530E] text-white flex items-center justify-center font-bold shadow-md shadow-[#0D530E]/20 shrink-0">
              <FiType size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Create New Note
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Organize thoughts, summaries, and key ideas in one workspace.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all shrink-0 cursor-pointer disabled:opacity-50"
            title="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 shadow-xs">
              <FiAlertCircle className="text-rose-600 shrink-0" size={18} />
              <p className="text-xs sm:text-sm font-semibold">{error}</p>
            </div>
          )}

          <form id="create-note-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title & Custom Category Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1.5">
                <label htmlFor="title" className="text-xs font-extrabold text-gray-700 uppercase tracking-wider block">
                  Note Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Q3 Marketing Strategy"
                  className="w-full px-4 py-3 bg-white text-gray-900 font-medium rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition-all placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              <div className="w-full sm:w-56 space-y-1.5">
                <label htmlFor="category" className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FiFolder size={14} className="text-[#0D530E]" /> Category
                </label>
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Work, Ideas"
                  className="w-full px-4 py-3 bg-white text-gray-900 font-medium rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Note Description (New Field) */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <FiAlignLeft size={14} className="text-[#0D530E]" /> Short Description / Subtitle
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary or context for quick reference..."
                className="w-full px-4 py-3 bg-white text-gray-900 font-medium rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-1.5">
              <label htmlFor="content" className="text-xs font-extrabold text-gray-700 uppercase tracking-wider block">
                Note Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your full note content here..."
                rows={7}
                className="w-full px-4 py-3 bg-white text-gray-900 font-normal rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D530E] focus:ring-2 focus:ring-[#0D530E]/20 transition-all placeholder:text-gray-400 leading-relaxed resize-y"
              />
            </div>

          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium text-gray-400 hidden sm:inline-block">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-mono">Esc</kbd> to exit
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-200/60 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              form="create-note-form"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#0D530E] hover:bg-[#0A430B] active:scale-[0.98] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md shadow-[#0D530E]/20 transition-all disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" size={16} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  <span>Save Note</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}