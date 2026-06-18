'use client'

import { X } from 'lucide-react'

interface MaterialModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function MaterialModal({ isOpen, onClose, onSubmit }: MaterialModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 className="font-extrabold text-lg text-slate-900">Tải lên Tài liệu Mới</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tiêu đề tài liệu</label>
            <input
              name="title"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phân loại</label>
              <select
                name="type"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition"
              >
                <option value="video">Video bài giảng</option>
                <option value="pdf">Sách / Giáo trình PDF</option>
                <option value="guide">Source Code & Hướng dẫn</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tác giả</label>
              <input
                name="author"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mô tả ngắn</label>
            <textarea
              name="description"
              rows={2}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">URL Tài liệu (Drive, Youtube, Github...)</label>
            <input
              name="url"
              required
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl shadow-md transition"
          >
            Lưu tài liệu
          </button>
        </form>
      </div>
    </div>
  )
}
