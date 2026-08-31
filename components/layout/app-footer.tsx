'use client'

import type { Tab } from '@/lib/types'

interface AppFooterProps {
  onSwitchTab: (tab: Tab) => void
}

const FOOTER_NAVIGATION_LINKS: Array<[Tab, string]> = [
  ['co-so-vat-chat', 'Kho Thiết bị'],
  ['lich-hoc', 'Lịch hoạt động'],
  ['nhat-ky', 'Nhật ký Lab'],
  ['kho-tai-lieu', 'Thư viện số'],
  ['muon-tra', 'Mượn thiết bị'],
  ['bao-hong', 'Báo lỗi'],
]

export function AppFooter({ onSwitchTab }: AppFooterProps) {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div className="space-y-3">
            <h2 className="font-extrabold text-base">
              BĐQ STEM LAB <span className="text-[10px] font-bold text-sky-400 ml-1">v5.0</span>
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Không gian học tập, sáng tạo và khám phá hàng đầu dành cho học sinh trường THPT Bắc Đông Quan.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">
              Danh mục chính
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              {FOOTER_NAVIGATION_LINKS.map(([tabKey, label]) => (
                <button
                  key={tabKey}
                  onClick={() => onSwitchTab(tabKey)}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">
              Thông tin liên hệ
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Phòng Thực Hành STEM - Trường THPT Bắc Đông Quan
            </p>
            <p className="text-xs text-slate-400 mt-1">Email: bdq.stemlab@gmail.com</p>
            <p className="text-xs text-slate-400">Điện thoại liên hệ: 0984552238 Mrs. Thanh</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800/80 mt-8 pt-6 text-center text-[11px] text-slate-500">
          © 2026 STEM Laboratory Management Website. Bản quyền thuộc về trường THPT Bắc Đông Quan. <br className="sm:hidden" />
          Thiết kế bởi{' '}
          <a
            href="https://www.facebook.com/bunreal210"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-200 transition-colors underline"
          >
            Phạm Công Vinh
          </a>
          .
        </div>
      </div>
    </footer>
  )
}
