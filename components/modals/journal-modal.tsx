'use client'

import { X } from 'lucide-react'

interface JournalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function JournalModal({ isOpen, onClose, onSubmit }: JournalModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 className="font-extrabold text-lg text-slate-900">Ghi Nhật Ký Mới</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ngày thực hiện</label>
              <input
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Thời gian</label>
              <input
                name="time"
                type="time"
                defaultValue={new Date().toTimeString().slice(0, 5)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phân loại hoạt động</label>
              <select
                name="type"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition"
              >
                {['Buổi học', 'Kiểm kê', 'Bảo trì', 'Sự kiện', 'Khác'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Số lượng người tham gia</label>
              <input
                name="participants"
                type="number"
                min="0"
                defaultValue="0"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tiêu đề nhật ký</label>
            <input
              name="title"
              required
              placeholder="Vd: Buổi học lập trình Arduino cơ bản..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nội dung tóm tắt</label>
            <textarea
              name="content"
              rows={4}
              required
              placeholder="Mô tả các nội dung chính diễn ra tại Lab..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Trạng thái</label>
            <select
              name="status"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition"
            >
              <option>Hoàn thành</option>
              <option>Đang diễn ra</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl shadow-md transition"
          >
            Lưu nhật ký phòng Lab
          </button>
        </form>
      </div>
    </div>
  )
}
