'use client'

import { ArrowLeftRight, LogOut, Menu, TriangleAlert, X, Zap, Sparkles } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Tab, UserProfile } from '@/lib/types'

interface AppHeaderProps {
  tab: Tab
  authUser: User | null
  profile: UserProfile | null
  mobileOpen: boolean
  isAdmin: boolean
  onSwitchTab: (tab: Tab) => void
  onLogout: () => void
  onOpenAuth: (mode: 'login' | 'register') => void
  onToggleMobile: () => void
}

const MAIN_NAVIGATION_TABS: Array<[Tab, string]> = [
  ['trang-chu', 'Trang chủ'],
  ['co-so-vat-chat', 'Kho Thiết bị'],
  ['lich-hoc', 'Lịch hoạt động'],
  ['kho-tai-lieu', 'Thư viện số'],
  ['nhat-ky', 'Nhật ký Lab'],
]

export function AppHeader({
  tab,
  authUser,
  profile,
  mobileOpen,
  isAdmin,
  onSwitchTab,
  onLogout,
  onOpenAuth,
  onToggleMobile,
}: AppHeaderProps) {
  return (
    <>
      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white text-[11px] sm:text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-indigo-900/50">
        <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse shrink-0" />
        <span>Chương trình <b>STEM INNOVATION PETROVIETNAM</b> – THPT Bắc Đông Quan</span>
      </div>

      {/* ── STICKY MAIN HEADER ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs transition">
        <div className="w-full px-4 md:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-3">
          
          {/* Logo & Branding */}
          <div
            className="flex items-center gap-2.5 md:gap-3 cursor-pointer shrink-0"
            onClick={() => onSwitchTab('trang-chu')}
          >
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2.5">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-lg shadow-xs border border-slate-100 p-0.5">
                <img
                  src="/assets/images/logo-bdq.jpg"
                  alt="THPT Bắc Đông Quan"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-lg shadow-xs border border-slate-100 p-0.5">
                <img
                  src="/assets/images/logo-pvn.png"
                  alt="PetroVietnam"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            </div>
            <div>
              <h1 className="font-black text-xs md:text-sm text-slate-900 tracking-tight leading-tight">
                STEM LABORATORY
              </h1>
              <div className="text-[9px] md:text-[10px] font-bold text-sky-600 tracking-wide">
                THPT BẮC ĐÔNG QUAN
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 min-w-0">
            {MAIN_NAVIGATION_TABS.map(([tabKey, label]) => (
              <button
                key={tabKey}
                onClick={() => onSwitchTab(tabKey)}
                className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  tab === tabKey
                    ? 'text-sky-700 bg-sky-50 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}

            {authUser && !isAdmin && (
              <>
                <button
                  onClick={() => onSwitchTab('muon-tra')}
                  className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    tab === 'muon-tra'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Mượn thiết bị
                </button>
                <button
                  onClick={() => onSwitchTab('bao-hong')}
                  className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold border flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    tab === 'bao-hong'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <TriangleAlert className="w-3.5 h-3.5 text-amber-500" /> Báo lỗi
                </button>
              </>
            )}
          </nav>

          {/* User Actions / Auth Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {!authUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-slate-700 hover:text-sky-600 px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  Đăng ký
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSwitchTab('trang-ca-nhan')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    tab === 'trang-ca-nhan'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                  }`}
                  title="Trang cá nhân"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    {profile?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate">{profile?.name || 'Tài khoản'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={onToggleMobile}
              className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg animate-fade-in">
            {MAIN_NAVIGATION_TABS.map(([tabKey, label]) => (
              <button
                key={tabKey}
                onClick={() => onSwitchTab(tabKey)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${
                  tab === tabKey ? 'bg-sky-50 text-sky-700 font-black' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}

            {authUser && (
              <>
                <button
                  onClick={() => onSwitchTab('muon-tra')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-sky-600 bg-sky-50 border border-sky-100 flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Đăng ký Mượn/Trả
                </button>
                <button
                  onClick={() => onSwitchTab('bao-hong')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 flex items-center gap-2 cursor-pointer"
                >
                  <TriangleAlert className="w-3.5 h-3.5" /> Báo hỏng thiết bị
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  )
}
