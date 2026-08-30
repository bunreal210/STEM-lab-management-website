'use client'

import { NotebookPen, TriangleAlert, ArrowLeftRight, Lock, Sparkles, Cpu, CalendarDays, FileText, Users, ArrowRight, Globe, ExternalLink } from 'lucide-react'
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
      {/* Hero Section with Modern Glassmorphic Look */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl min-h-[420px] sm:min-h-[460px] flex items-center justify-center border border-slate-800/40">
        <img
          src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80"
          alt="STEM Lab"
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-1000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-blue-950/60" />

        {/* Subtle Ambient Glowing Lights */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-5 sm:px-8 py-12 max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sky-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            Không gian Sáng tạo & Nghiên cứu Khoa học
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            STEM LAB
            <span className="block text-2xl sm:text-4xl lg:text-5xl font-black py-1 bg-gradient-to-r from-sky-400 via-cyan-200 to-emerald-400 bg-clip-text text-transparent">
              THPT BẮC ĐÔNG QUAN
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Ươm mầm đam mê Robotics, AI, IoT, Lập trình và hỗ trợ toàn diện các đề tài Nghiên cứu khoa học kỹ thuật dành cho học sinh & giáo viên.
          </p>

          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {[
              '🤖 Robotics',
              '💻 AI & Coding',
              '🌐 IoT & Smart Lab',
              '🖨️ In 3D & Chế tạo',
            ].map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 text-xs font-semibold hover:bg-white/20 transition-all cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
            <button
              onClick={() => switchTab('co-so-vat-chat')}
              className="px-5 py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4" /> Khám phá thiết bị
            </button>
            <a
              href="https://www.fablabs.io/labs/bdqstemlab"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4" /> FabLab BDQ Quốc Tế <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => switchTab('nhat-ky')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl text-xs sm:text-sm font-bold hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <NotebookPen className="w-4 h-4" /> Nhật ký Lab
            </button>
          </div>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            val: devicesCount,
            label: 'Thiết bị & Linh kiện',
            icon: Cpu,
            color: 'text-sky-600',
            bg: 'bg-sky-50/70 border-sky-100',
          },
          {
            val: schedulesCount,
            label: 'Lịch hoạt động',
            icon: CalendarDays,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/70 border-emerald-100',
          },
          {
            val: materialsCount,
            label: 'Tài liệu & Giáo trình',
            icon: FileText,
            color: 'text-amber-600',
            bg: 'bg-amber-50/70 border-amber-100',
          },
          {
            val: 120 + profilesCount,
            label: 'Thành viên tham gia',
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-50/70 border-purple-100',
          },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className={`border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center backdrop-blur-sm relative group overflow-hidden ${s.bg}`}
            >
              <div className="flex items-center justify-center mb-1.5 opacity-80 group-hover:scale-110 transition-transform">
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className={`text-2xl sm:text-3xl font-black tracking-tight ${s.color}`}>
                {s.val}
              </p>
              <p className="text-[11px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Quick Action Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            title: 'Nhật Ký Hoạt Động',
            desc: 'Ghi lại các buổi học, kiểm kê định kỳ và báo cáo thực hành của từng lớp.',
            action: () => switchTab('nhat-ky'),
            bg: 'from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600',
            icon: NotebookPen,
          },
          {
            title: 'Báo Hỏng & Sự Cố',
            desc: 'Phát hiện linh kiện lỗi? Gửi báo cáo để Admin kiểm tra và thay thế kịp thời.',
            action: () =>
              authUser
                ? switchTab('bao-hong')
                : (setAuthMode('login'), setAuthOpen(true)),
            bg: 'from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500',
            icon: TriangleAlert,
          },
          {
            title: 'Đăng Ký Mượn Đồ',
            desc: 'Mượn thiết bị và linh kiện phục vụ đề tài nghiên cứu khoa học kỹ thuật.',
            action: () =>
              authUser
                ? switchTab('muon-tra')
                : (setAuthMode('login'), setAuthOpen(true)),
            bg: 'from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600',
            icon: ArrowLeftRight,
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              onClick={item.action}
              className={`bg-gradient-to-br ${item.bg} rounded-2xl p-5 text-white cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-extrabold text-base leading-snug">
                  {item.title}
                </h3>
                <p className="text-white/85 text-xs mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-1 text-[11px] font-bold text-white/90 group-hover:translate-x-1 transition-transform">
                Truy cập ngay <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Guest Alert Card */}
      {!authUser && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-center sm:items-start gap-3 text-center sm:text-left">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                Đăng nhập để sử dụng đầy đủ tính năng
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
                Tạo tài khoản học sinh để đăng ký mượn/trả thiết bị, gửi báo cáo hỏng và theo dõi toàn bộ lịch sử cá nhân của bạn.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setAuthMode('login')
              setAuthOpen(true)
            }}
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            Đăng nhập ngay
          </button>
        </div>
      )}
    </div>
  )
}
