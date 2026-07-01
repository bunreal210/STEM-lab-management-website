'use client'

import { X, Calendar } from 'lucide-react'
import type { Post } from '@/lib/types'
import { formatDate } from '@/lib/utils/date'

interface FullPostModalProps {
  post: Post | null
  onClose: () => void
}

export function FullPostModal({ post, onClose }: FullPostModalProps) {
  if (!post) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/20 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            {post.category}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {post.image_url && (
            <img
              src={post.image_url}
              alt="Bìa"
              className="w-full h-56 object-cover rounded-2xl shadow-sm border border-slate-100"
            />
          )}
          <h2 className="text-2xl font-black text-slate-900 leading-snug">
            {post.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.published_at)} &nbsp;·&nbsp; {post.author}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>
      </div>
    </div>
  )
}
