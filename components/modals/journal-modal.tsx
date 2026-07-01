'use client'

import { useState } from 'react'
import { X, Star } from 'lucide-react'

interface JournalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  userRole: string
  activeJournalTab: 'hoc-sinh' | 'giao-vien' | 'quan-tri'
}

const MODAL_TITLES: Record<string, string> = {
  'hoc-sinh': '📝 Ghi Nhật Ký Buổi Học',
  'giao-vien': '📋 Đánh Giá Buổi Học',
  'quan-tri': '🏫 Ghi Tình Trạng Phòng Lab',
}

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              i <= (hover || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-xs font-bold text-slate-500">
        {value > 0 ? `${value}/5` : 'Chưa đánh giá'}
      </span>
    </div>
  )
}

export function JournalModal({ isOpen, onClose, onSubmit, userRole, activeJournalTab }: JournalModalProps) {
  const [rating, setRating] = useState(0)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setRating(0)
    onSubmit(e)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 className="font-extrabold text-lg text-slate-900">
            {MODAL_TITLES[activeJournalTab]}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Hidden field: journal_role */}
          <input type="hidden" name="journal_role" value={activeJournalTab} />
          {/* Hidden field: rating (teacher only) */}
          {activeJournalTab === 'giao-vien' && (
            <input type="hidden" name="rating" value={rating} />
          )}

          {/* Common: Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ngày</label>
              <input
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Buổi</label>
              <select
                name="time"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition"
              >
                <option>Sáng</option>
                <option>Chiều</option>
                <option>Tối</option>
              </select>
            </div>
          </div>

          {/* Student & Teacher: Subject */}
          {(activeJournalTab === 'hoc-sinh' || activeJournalTab === 'giao-vien') && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Môn học / Chủ đề
              </label>
              <input
                name="subject"
                placeholder="VD: Lập trình Arduino, Robotics, IoT..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          )}

          {/* Teacher: Target class */}
          {activeJournalTab === 'giao-vien' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Lớp đánh giá
              </label>
              <input
                name="target_class"
                placeholder="VD: 11A1, 10B2..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          )}

          {/* Admin: Room condition */}
          {activeJournalTab === 'quan-tri' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Tình trạng phòng
              </label>
              <select
                name="room_condition"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition"
              >
                <option>Tốt</option>
                <option>Bình thường</option>
                <option>Cần sửa chữa</option>
              </select>
            </div>
          )}

          {/* Common: Title */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tiêu đề</label>
            <input
              name="title"
              required
              placeholder={
                activeJournalTab === 'hoc-sinh'
                  ? 'VD: Buổi học lắp mạch LED cơ bản...'
                  : activeJournalTab === 'giao-vien'
                  ? 'VD: Đánh giá buổi thực hành Arduino lớp 11A1...'
                  : 'VD: Kiểm tra phòng Lab sau buổi chiều...'
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>

          {/* Common: Content */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              {activeJournalTab === 'hoc-sinh' ? 'Ghi chép buổi học' : activeJournalTab === 'giao-vien' ? 'Nội dung nhận xét' : 'Mô tả tình trạng'}
            </label>
            <textarea
              name="content"
              rows={4}
              required
              placeholder={
                activeJournalTab === 'hoc-sinh'
                  ? 'Hôm nay em đã học được...'
                  : activeJournalTab === 'giao-vien'
                  ? 'Nhận xét chung về buổi học, thái độ học sinh...'
                  : 'Tình trạng vệ sinh, bàn ghế, nguồn điện...'
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>

          {/* Admin: Equipment notes */}
          {activeJournalTab === 'quan-tri' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Ghi chú thiết bị
              </label>
              <textarea
                name="equipment_notes"
                rows={3}
                placeholder="Liệt kê thiết bị hỏng, cần bảo trì, cần thay thế..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          )}

          {/* Teacher: Star rating */}
          {activeJournalTab === 'giao-vien' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Đánh giá buổi học
              </label>
              <StarSelector value={rating} onChange={setRating} />
            </div>
          )}

          {/* Student & Teacher: Participants */}
          {(activeJournalTab === 'hoc-sinh' || activeJournalTab === 'giao-vien') && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                {activeJournalTab === 'hoc-sinh' ? 'Số người tham gia' : 'Số học sinh'}
              </label>
              <input
                name="participants"
                type="number"
                min="0"
                defaultValue="0"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl shadow-md transition"
          >
            {activeJournalTab === 'hoc-sinh' ? 'Lưu nhật ký buổi học' : activeJournalTab === 'giao-vien' ? 'Gửi đánh giá' : 'Lưu tình trạng phòng'}
          </button>
        </form>
      </div>
    </div>
  )
}
