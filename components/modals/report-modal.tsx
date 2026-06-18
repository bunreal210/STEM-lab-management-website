'use client'

import { X, TriangleAlert, Send } from 'lucide-react'
import type { Device } from '@/lib/types'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  devices: Device[]
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ReportModal({ isOpen, onClose, devices, onSubmit }: ReportModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/80">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <TriangleAlert className="w-5 h-5 text-amber-500" />
            Gửi Phiếu Báo Hỏng
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chọn thiết bị bị lỗi</label>
            <select
              name="device_id"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
            >
              <option value="">-- Chọn thiết bị --</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} [{d.code}]
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mức độ hỏng</label>
            <select
              name="severity"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition"
            >
              <option>Nhẹ</option>
              <option>Vừa</option>
              <option>Nặng</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mô tả chi tiết lỗi</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Mô tả triệu chứng lỗi chi tiết để ban quản trị dễ bảo trì..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition"
          >
            <Send className="w-4 h-4" /> Gửi Báo Cáo
          </button>
        </form>
      </div>
    </div>
  )
}
