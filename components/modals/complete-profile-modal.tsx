'use client'

import { useState } from 'react'
import { GraduationCap, Phone, Calendar, User, Save, AlertCircle, Loader2 } from 'lucide-react'

interface CompleteProfileModalProps {
  isOpen: boolean
  currentName: string
  onSubmit: (className: string, phone: string, dob: string) => Promise<void>
}

export function CompleteProfileModal({
  isOpen,
  currentName,
  onSubmit,
}: CompleteProfileModalProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const fd = new FormData(e.currentTarget)
    const className = (fd.get('class') as string).trim().toUpperCase()
    const phone = (fd.get('phone') as string).trim()
    const dob = fd.get('dob') as string

    if (!className) {
      setErrorMsg('Vui lòng điền thông tin lớp học.')
      setLoading(false)
      return
    }
    if (!phone) {
      setErrorMsg('Vui lòng điền số điện thoại liên hệ.')
      setLoading(false)
      return
    }

    try {
      await onSubmit(className, phone, dob)
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl p-6 space-y-4 animate-scale-in">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 border border-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Bổ Sung Thông Tin Thành Viên
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Chào **{currentName}**, vui lòng cập nhật thêm thông tin lớp học và số điện thoại để hoàn tất đăng ký tài khoản phòng STEM Lab.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
              Lớp học
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="class"
                required
                placeholder="Ví dụ: 11A1, 12A2, 10A3..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
              Số điện thoại liên hệ
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="phone"
                required
                type="tel"
                placeholder="Ví dụ: 0912345678"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
              Ngày sinh (Tùy chọn)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="dob"
                type="date"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 py-2.5 font-bold text-xs sm:text-sm text-white shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Hoàn tất đăng ký
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
