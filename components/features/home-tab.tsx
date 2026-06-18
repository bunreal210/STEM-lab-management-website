'use client'

import { NotebookPen, TriangleAlert, ArrowLeftRight, Lock } from 'lucide-react'
import type { Tab } from '@/lib/types'

interface HomeTabProps {
  devicesCount: number
  schedulesCount: number
  materialsCount: number
  profilesCount: number
  switchTab: (t: Tab) => void
  authUser: any
  setAuthOpen: (val: boolean) => void
  setAuthMode: (val: 'login' | 'register') => void
}

export function HomeTab({
  devicesCount,
  schedulesCount,
  materialsCount,
  profilesCount,
  switchTab,
  authUser,
  setAuthOpen,
  setAuthMode,
}: HomeTabProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section with Glassmorphic Overlay */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl min-h-[500px] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1532094349884-543bc11b234d"
          alt="STEM Lab"
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-all duration-700 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-blue-900/40" />
        
        {/* Decorative ambient glowing lights */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-sky-500/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 px-6 py-16 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            STEM LAB
            <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-cyan-200 to-emerald-400 bg-clip-text text-transparent">
              THPT BẮC ĐÔNG QUAN
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Không gian sáng tạo và ươm mầm dành cho Robotics, AI, IoT, Lập trình và các đề tài Nghiên cứu khoa học kỹ thuật xuất sắc.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {['🤖 Robotics', '💻 AI & Coding', '🌐 IoT & Smart Home', '🖨️ 3D Printing'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              onClick={() => switchTab('co-so-vat-chat')}
              className="px-8 py-4 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-sky-500/20 hover:-translate-y-0.5 transition-all"
            >
              Khám phá thiết bị
            </button>
            <button
              onClick={() => switchTab('nhat-ky')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold hover:-translate-y-0.5 transition-all"
            >
              Xem Nhật ký Lab
            </button>
          </div>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { val: devicesCount, label: 'Thiết bị', color: 'text-sky-500 bg-sky-500/5' },
          { val: schedulesCount, label: 'Sự kiện', color: 'text-emerald-500 bg-emerald-500/5' },
          { val: materialsCount, label: 'Tài liệu', color: 'text-amber-500 bg-amber-500/5' },
          { val: 120 + profilesCount, label: 'Học sinh', color: 'text-purple-500 bg-purple-500/5' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white/70 border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-center backdrop-blur-sm relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className={`text-4xl font-black tracking-tight ${s.color.split(' ')[0]}`}>{s.val}</p>
            <p className="text-[11px] font-bold text-slate-500 mt-2 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Shortcut Card Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Nhật Ký Hoạt Động',
            desc: 'Ghi lại các buổi học, kiểm kê định kỳ, và sự kiện thực tế phòng Lab.',
            action: () => switchTab('nhat-ky'),
            bg: 'from-blue-600 to-indigo-700 shadow-blue-500/15',
            icon: <NotebookPen className="w-8 h-8 opacity-90" />,
          },
          {
            title: 'Báo Hỏng Thiết Bị',
            desc: 'Phát hiện sự cố kỹ thuật? Báo cáo trực tiếp để bảo hành và sửa chữa kịp thời.',
            action: () => (authUser ? switchTab('bao-hong') : (setAuthMode('login'), setAuthOpen(true))),
            bg: 'from-amber-500 to-orange-600 shadow-orange-500/15',
            icon: <TriangleAlert className="w-8 h-8 opacity-90" />,
          },
          {
            title: 'Đăng Ký Mượn Đồ',
            desc: 'Mượn thiết bị thực hành và linh kiện về lớp phục vụ đề tài nghiên cứu khoa học.',
            action: () => (authUser ? switchTab('muon-tra') : (setAuthMode('login'), setAuthOpen(true))),
            bg: 'from-emerald-600 to-teal-700 shadow-emerald-500/15',
            icon: <ArrowLeftRight className="w-8 h-8 opacity-90" />,
          },
        ].map((item) => (
          <div
            key={item.title}
            onClick={item.action}
            className={`bg-gradient-to-br ${item.bg} rounded-3xl p-6 text-white cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-48`}
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-extrabold text-lg leading-tight">{item.title}</h3>
              <p className="text-white/80 text-xs mt-2 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Guest Alert Card */}
      {!authUser && (
        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 backdrop-blur-sm">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Lock className="w-6 h-6" />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h4 className="font-bold text-amber-900 text-sm sm:text-base">Đăng nhập để sử dụng đầy đủ tính năng</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Tạo tài khoản học sinh để đăng ký mượn/trả thiết bị, gửi báo cáo hỏng và theo dõi toàn bộ lịch sử cá nhân của bạn.
            </p>
          </div>
          <button
            onClick={() => {
              setAuthMode('login')
              setAuthOpen(true)
            }}
            className="mt-2 sm:mt-0 shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-sm transition"
          >
            Đăng nhập ngay
          </button>
        </div>
      )}
    </div>
  )
}
