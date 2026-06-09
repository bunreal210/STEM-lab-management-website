'use client'

import type { Tab } from '@/lib/types'

export function AppFooter({ onSwitchTab }: { onSwitchTab: (tab: Tab) => void }) {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h2 className="text-base font-extrabold">
              BĐQ STEM LAB <span className="ml-1 text-[10px] font-bold text-pvn-400">v3.0</span>
            </h2>
            <p className="text-xs leading-relaxed text-slate-400">
              Không gian ươm mầm tài năng sáng tạo công nghệ, lập trình, khoa học của trường THPT Bắc Đông Quan.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-200">Điều hướng</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              {(['nhat-ky', 'bao-hong', 'co-so-vat-chat', 'kho-tai-lieu'] as Tab[]).map((tab) => (
                <button key={tab} onClick={() => onSwitchTab(tab)} className="text-left transition-colors hover:text-white">
                  {tab.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-200">Liên hệ</h3>
            <p className="text-xs leading-relaxed text-slate-400">Phòng STEM Lab – THPT Bắc Đông Quan</p>
            <p className="mt-1 text-xs text-slate-400">Email: stemlab.bdq@gmail.com</p>
            <p className="text-xs text-slate-400">Điện thoại: 0936984893 – Mr.Vinh</p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-[11px] text-slate-500">
          © 2026 STEM LAB Bắc Đông Quan v3.0 — Thiết kế bởi: Phạm Công Vinh | Powered by Next.js + Supabase
        </div>
      </div>
    </footer>
  )
}
