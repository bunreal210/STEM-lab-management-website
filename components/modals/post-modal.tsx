'use client'

import { X } from 'lucide-react'

interface PostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function PostModal({ isOpen, onClose, onSubmit }: PostModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 className="font-extrabold text-lg text-slate-900">Đăng Bản Tin Mới</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tiêu đề bài viết</label>
            <input
              name="title"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Danh mục</label>
            <select
              name="category"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition"
            >
              {['Tin tức', 'Dự án', 'Sự kiện', 'Thông báo'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">URL Ảnh bìa (Unsplash, Imgur...)</label>
            <input
              name="image_url"
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nội dung bài viết</label>
            <textarea
              name="content"
              required
              rows={5}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl shadow-md transition"
          >
            Đăng bài viết
          </button>
        </form>
      </div>
    </div>
  )
}
