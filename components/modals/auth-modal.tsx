'use client'

import { useState } from 'react'
import { X, Lock, Mail, User, Phone, GraduationCap, Calendar, Loader2 } from 'lucide-react'

type OAuthProvider = 'google' | 'facebook' | 'github'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  setMode: (m: 'login' | 'register') => void
  onSubmitLogin: (e: React.FormEvent<HTMLFormElement>) => void
  onSubmitRegister: (e: React.FormEvent<HTMLFormElement>) => void
  onOAuthLogin: (provider: OAuthProvider) => void
}

/* ── Authentic Brand SVGs ── */
function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 fill-slate-900" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export function AuthModal({
  isOpen,
  onClose,
  mode,
  setMode,
  onSubmitLogin,
  onSubmitRegister,
  onOAuthLogin,
}: AuthModalProps) {
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null)

  if (!isOpen) return null

  const handleSocialClick = (provider: OAuthProvider) => {
    setOauthLoading(provider)
    onOAuthLogin(provider)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl animate-scale-in">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 bg-slate-50/70 px-6 py-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {mode === 'login' ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Thành Viên Lab'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phòng STEM Lab – THPT Bắc Đông Quan
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
        <div className="max-h-[82vh] overflow-y-auto p-6 space-y-4">
          
          {/* Mode Switcher Pills */}
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === m
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {m === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
              </button>
            ))}
          </div>

          {/* ── SOCIAL LOGINS (Google, Facebook, GitHub) ── */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider text-center">
              Đăng nhập nhanh với
            </p>

            <div className="grid grid-cols-3 gap-2">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialClick('google')}
                disabled={Boolean(oauthLoading)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
              >
                {oauthLoading === 'google' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" /> : <GoogleIcon />}
                <span>Google</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleSocialClick('facebook')}
                disabled={Boolean(oauthLoading)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
              >
                {oauthLoading === 'facebook' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1877F2]" /> : <FacebookIcon />}
                <span>Facebook</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleSocialClick('github')}
                disabled={Boolean(oauthLoading)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 shadow-2xs transition cursor-pointer disabled:opacity-50"
              >
                {oauthLoading === 'github' ? <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-900" /> : <GithubIcon />}
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              hoặc qua email
            </span>
          </div>

          {/* ── EMAIL FORM ── */}
          {mode === 'login' ? (
            <form onSubmit={onSubmitLogin} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="example@email.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 py-3 font-bold text-xs sm:text-sm text-white shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> ĐĂNG NHẬP
              </button>
            </form>
          ) : (
            <form onSubmit={onSubmitRegister} className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="name"
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                    Lớp
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      name="class"
                      required
                      placeholder="11A2"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                    SĐT
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      name="phone"
                      placeholder="0912345678"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="example@email.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                  Mật khẩu (tối thiểu 8 ký tự)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    minLength={8}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase text-slate-500">
                  Ngày sinh
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
                className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 py-3 font-bold text-xs sm:text-sm text-white shadow-xs transition cursor-pointer mt-1"
              >
                TẠO TÀI KHOẢN MỚI
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
