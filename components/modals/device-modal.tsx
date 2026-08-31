'use client'

import { X } from 'lucide-react'
import type { Device } from '@/lib/types'

interface DeviceModalProps {
  isOpen: boolean
  onClose: () => void
  editDevice: Device | null
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  categories: string[]
}

export function DeviceModal({
  isOpen,
  onClose,
  editDevice,
  onSubmit,
  categories,
}: DeviceModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl backdrop-blur-xl animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <h3 className="font-extrabold text-lg text-slate-900">
            {editDevice ? 'Chỉnh sửa Thiết bị' : 'Thêm Linh Kiện Mới'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tên thiết bị</label>
            <input
              name="name"
              required
              defaultValue={editDevice?.name || ''}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Danh mục</label>
              <select
                name="category"
                defaultValue={editDevice?.category || 'Vi điều khiển'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition cursor-pointer text-slate-800 font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mã thiết bị</label>
              <input
                name="code"
                required
                defaultValue={editDevice?.code || ''}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Số lượng kho</label>
              <input
                name="total"
                type="number"
                min="0"
                required
                defaultValue={editDevice?.total ?? 0}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Khả dụng</label>
              <input
                name="available"
                type="number"
                min="0"
                required
                defaultValue={editDevice?.available ?? 0}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tình trạng</label>
              <select
                name="status"
                defaultValue={editDevice?.status || 'Tốt'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition"
              >
                <option>Tốt</option>
                <option>Hỏng nhẹ</option>
                <option>Hỏng nặng</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Vị trí</label>
              <input
                name="description"
                defaultValue={editDevice?.description || ''}
                placeholder="Tủ A, Ngăn 1"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">URL Ảnh</label>
            <input
              name="image_url"
              type="url"
              defaultValue={editDevice?.image_url || ''}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-black py-3 rounded-xl shadow-md transition"
          >
            {editDevice ? 'Cập nhật thiết bị' : 'Thêm vào hệ thống'}
          </button>
        </form>
      </div>
    </div>
  )
}
