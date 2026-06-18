'use client'

import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  setMode: (m: 'login' | 'register') => void
  onSubmitLogin: (e: React.FormEvent<HTMLFormElement>) => void
  onSubmitRegister: (e: React.FormEvent<HTMLFormElement>) => void
}

export function AuthModal({
  isOpen,
  onClose,
  mode,
  setMode,
  onSubmitLogin,
  onSubmitRegister,
}: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl animate-scale-in">
        <div className="flex items-center justify-between border-b border-slate-200/50 bg-slate-50/50 px-6 py-4">
          <h3 className="text-lg font-black text-slate-900">
            {mode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên Lab'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                  mode === m
                    ? 'bg-white text-stemBlue-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            ))}
          </div>
          {mode === 'login' ? (
            <form onSubmit={onSubmitLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                  Mật khẩu
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-stemBlue-600 py-3 font-black text-white shadow-md hover:bg-stemBlue-700 transition"
              >
                ĐĂNG NHẬP
              </button>
            </form>
          ) : (
            <form onSubmit={onSubmitRegister} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                  Họ và tên
                </label>
                <input
                  name="name"
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                    Lớp
                  </label>
                  <input
                    name="class"
                    required
                    placeholder="11A2"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                    SĐT
                  </label>
                  <input
                    name="phone"
                    placeholder="0912345678"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                  Mật khẩu (ít nhất 6 ký tự)
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                  Ngày sinh
                </label>
                <input
                  name="dob"
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-stemBlue-600 py-3 font-black text-white shadow-md hover:bg-stemBlue-700 transition"
              >
                TẠO TÀI KHOẢN
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
