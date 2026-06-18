'use client'

import { X } from 'lucide-react'

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ScheduleModal({ isOpen, onClose, onSubmit }: ScheduleModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 className="font-extrabold text-lg text-slate-900">Tạo Lịch Hoạt Động Mới</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tên sự kiện</label>
            <input
              name="title"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ngày diễn ra</label>
              <input
                name="date"
                type="date"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Giờ diễn ra</label>
              <input
                name="time_range"
                placeholder="08:00 - 11:00"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Người phụ trách</label>
            <input
              name="instructor"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Đối tượng tham gia</label>
            <input
              name="target"
              required
              placeholder="Học sinh CLB Robotics, Toàn trường,..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mô tả chi tiết</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl shadow-md transition"
          >
            Tạo lịch hoạt động
          </button>
        </form>
      </div>
    </div>
  )
}
