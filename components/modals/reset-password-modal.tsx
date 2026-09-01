'use client'

import { useState } from 'react'
import { X, Lock, Loader2, CheckCircle2 } from 'lucide-react'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (newPassword: string) => Promise<void>
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onSubmit,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp!')
      return
    }

    try {
      setLoading(true)
      await onSubmit(password)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl animate-scale-in">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 bg-slate-50/70 px-6 py-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Đặt Lại Mật Khẩu Mới
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-slate-800">
                Đã đổi mật khẩu thành công!
              </h4>
              <p className="text-xs text-slate-500">
                Mật khẩu của bạn đã được cập nhật. Cửa sổ sẽ tự động đóng.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                  Mật khẩu mới (tối thiểu 6 ký tự)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 py-3 font-bold text-xs sm:text-sm text-white shadow-xs transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> LƯU MẬT KHẨU MỚI
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
