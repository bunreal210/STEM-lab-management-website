'use client'

import { ArrowLeftRight, LogOut, Menu, Moon, Settings, Sun, TriangleAlert, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Tab, UserProfile } from '@/lib/types'

type HeaderProps = {
  tab: Tab
  authUser: User | null
  profile: UserProfile | null
  darkMode: boolean
  mobileOpen: boolean
  isAdmin: boolean
  onSwitchTab: (tab: Tab) => void
  onToggleDark: () => void
  onLogout: () => void
  onOpenAuth: (mode: 'login' | 'register') => void
  onToggleMobile: () => void
}

const MAIN_TABS: Array<[Tab, string]> = [
  ['trang-chu', 'Trang chủ'],
  ['co-so-vat-chat', 'Kho Thiết bị'],
  ['lich-hoc', 'Lịch hoạt động'],
  ['kho-tai-lieu', 'Thư viện số'],
  ['truyen-thong', 'Tin tức'],
  ['nhat-ky', 'Nhật ký Lab'],
]

const MOBILE_TABS: Array<[Tab, string]> = [
  ['trang-chu', 'Trang chủ'],
  ['co-so-vat-chat', 'Kho Thiết bị'],
  ['lich-hoc', 'Lịch hoạt động'],
  ['kho-tai-lieu', 'Thư viện số'],
  ['truyen-thong', 'Tin tức'],
  ['nhat-ky', 'Nhật ký Lab'],
]

export function AppHeader({
  tab,
  authUser,
  profile,
  darkMode,
  mobileOpen,
  isAdmin,
  onSwitchTab,
  onToggleDark,
  onLogout,
  onOpenAuth,
  onToggleMobile,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button className="flex cursor-pointer items-center gap-2 md:gap-5" onClick={() => onSwitchTab('trang-chu')}>
          <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2 md:gap-3 md:pr-5">
            <div className="h-9 w-9 rounded-xl border border-slate-100 bg-white p-0.5 shadow-sm md:h-12 md:w-12">
              <img src="/assets/images/logo-bdq.jpg" alt="BDQ" className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <div className="h-9 w-9 rounded-xl border border-slate-100 bg-white p-0.5 shadow-sm md:h-12 md:w-12">
              <img src="/assets/images/logo-pvn.png" alt="PVN" className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          </div>
          <div className="leading-tight text-left">
            <h1 className="text-sm font-black tracking-tight text-stemBlue-900 md:text-xl">STEM LAB</h1>
            <div className="text-[9px] font-bold uppercase tracking-wide text-slate-700 md:text-[11px]">THPT Bắc Đông Quan</div>
            <div className="hidden text-[9px] text-slate-500 lg:block md:text-xs">Innovation • Robotics • AI • Engineering</div>
          </div>
        </button>

        <nav className="hidden items-center gap-0.5 xl:flex 2xl:gap-1.5">
          {MAIN_TABS.map(([tabKey, label]) => (
            <button
              key={tabKey}
              onClick={() => onSwitchTab(tabKey)}
              className={`rounded-lg px-2.5 py-2 text-sm font-semibold transition-all 2xl:px-4 2xl:py-2.5 2xl:text-base ${
                tab === tabKey ? 'bg-stemBlue-50 text-stemBlue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-stemBlue-600'
              }`}
            >
              {label}
            </button>
          ))}
          {authUser && (
            <>
              <button
                onClick={() => onSwitchTab('muon-tra')}
                className={`rounded-lg border border-stemBlue-200 px-2.5 py-2 text-sm font-semibold transition-all 2xl:px-4 2xl:py-2.5 2xl:text-base ${
                  tab === 'muon-tra' ? 'bg-stemBlue-50 text-stemBlue-600' : 'bg-white text-stemBlue-600 hover:bg-stemBlue-50'
                }`}
              >
                Đăng ký Mượn
              </button>
              <button
                onClick={() => onSwitchTab('bao-hong')}
                className={`flex items-center gap-1.5 rounded-lg border border-amber-200 px-2.5 py-2 text-sm font-semibold transition-all 2xl:px-4 2xl:py-2.5 2xl:text-base ${
                  tab === 'bao-hong' ? 'bg-amber-50 text-amber-600' : 'bg-white text-amber-600 hover:bg-amber-50'
                }`}
              >
                <TriangleAlert className="h-3 w-3 2xl:h-3.5 2xl:w-3.5" /> Báo hỏng
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <button onClick={onToggleDark} className="rounded-xl p-2 text-slate-500 transition-all hover:bg-slate-100">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {isAdmin && (
            <button
              onClick={() => onSwitchTab('admin-panel')}
              className="flex items-center gap-1 rounded-lg bg-purple-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-purple-700 md:px-3.5 md:py-2 md:text-sm"
            >
              <Settings className="h-4 w-4" /> Quản trị
            </button>
          )}
          {!authUser ? (
            <div className="flex items-center gap-1 md:gap-2">
              <button onClick={() => onOpenAuth('login')} className="px-2 py-1 text-sm font-semibold text-slate-600 hover:text-stemBlue-600 md:px-3.5 md:py-2 md:text-base">
                Đăng nhập
              </button>
              <button onClick={() => onOpenAuth('register')} className="hidden rounded-lg bg-stemBlue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stemBlue-700 sm:inline-block md:text-base">
                Đăng ký
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pvn-500 text-xs font-bold text-white">
                  {profile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="max-w-[100px] truncate text-xs font-bold leading-tight text-slate-800">{profile?.name || 'User'}</p>
                  <span className="text-[10px] font-semibold uppercase text-slate-400">{profile?.role === 'admin' ? 'Quản trị viên' : 'Học sinh'}</span>
                </div>
              </div>
              <button onClick={onLogout} className="rounded-lg p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600" title="Đăng xuất">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
          <button onClick={onToggleMobile} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 xl:hidden">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="space-y-1 border-t border-slate-100 bg-white px-4 py-3 shadow-inner xl:hidden">
          {MOBILE_TABS.map(([tabKey, label]) => (
            <button
              key={tabKey}
              onClick={() => onSwitchTab(tabKey)}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              {label}
            </button>
          ))}
          {authUser && (
            <>
              <button onClick={() => onSwitchTab('muon-tra')} className="flex w-full items-center gap-2 rounded-lg border border-stemBlue-100 bg-stemBlue-50 px-4 py-2.5 text-left text-sm font-bold text-stemBlue-600">
                <ArrowLeftRight className="h-4 w-4" /> Đăng ký Mượn/Trả
              </button>
              <button onClick={() => onSwitchTab('bao-hong')} className="flex w-full items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-4 py-2.5 text-left text-sm font-bold text-amber-600">
                <TriangleAlert className="h-4 w-4" /> Báo hỏng Thiết bị
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
