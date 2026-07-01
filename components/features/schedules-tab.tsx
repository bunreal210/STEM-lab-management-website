'use client'

import { useState, useMemo } from 'react'
import { CalendarDays, ShieldAlert, Plus, Trash2, Search, CalendarCheck2, Clock, History } from 'lucide-react'
import type { Schedule } from '@/lib/types'

interface SchedulesTabProps {
  schedules: Schedule[]
  isAdmin: boolean
  setScheduleModalOpen: (val: boolean) => void
  deleteSchedule: (id: string) => void
}

type TimeFilter = 'all' | 'this_week' | 'this_month' | 'past'

function getStatus(dateStr: string): 'upcoming' | 'today' | 'past' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr + 'T00:00:00')
  if (d.getTime() === today.getTime()) return 'today'
  if (d > today) return 'upcoming'
  return 'past'
}

function StatusBadge({ status }: { status: 'upcoming' | 'today' | 'past' }) {
  const map = {
    upcoming: { label: '🟢 Sắp tới', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    today: { label: '🟡 Hôm nay', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    past: { label: '⏳ Đã qua', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  }
  const { label, cls } = map[status]
  return (
    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfWeek(date: Date) {
  const s = startOfWeek(date)
  s.setDate(s.getDate() + 6)
  s.setHours(23, 59, 59, 999)
  return s
}

export function SchedulesTab({
  schedules,
  isAdmin,
  setScheduleModalOpen,
  deleteSchedule,
}: SchedulesTabProps) {
  const [search, setSearch] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')

  const enriched = useMemo(
    () => schedules.map((sc) => ({ ...sc, status: getStatus(sc.date) })),
    [schedules],
  )

  const filtered = useMemo(() => {
    let list = enriched

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (sc) =>
          sc.title.toLowerCase().includes(q) ||
          (sc.instructor && sc.instructor.toLowerCase().includes(q)),
      )
    }

    // Time filter
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    if (timeFilter === 'this_week') {
      const ws = startOfWeek(now)
      const we = endOfWeek(now)
      list = list.filter((sc) => {
        const d = new Date(sc.date + 'T00:00:00')
        return d >= ws && d <= we
      })
    } else if (timeFilter === 'this_month') {
      const ms = new Date(now.getFullYear(), now.getMonth(), 1)
      const me = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      list = list.filter((sc) => {
        const d = new Date(sc.date + 'T00:00:00')
        return d >= ms && d <= me
      })
    } else if (timeFilter === 'past') {
      list = list.filter((sc) => sc.status === 'past')
    }

    return list
  }, [enriched, search, timeFilter])

  // Dashboard counts
  const totalCount = schedules.length
  const upcomingCount = enriched.filter((s) => s.status === 'upcoming').length
  const pastCount = enriched.filter((s) => s.status === 'past').length

  const filterButtons: { key: TimeFilter; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'this_week', label: 'Tuần này' },
    { key: 'this_month', label: 'Tháng này' },
    { key: 'past', label: 'Đã qua' },
  ]

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lịch Học &amp; Hoạt Động CLB</h2>
          <p className="text-sm text-slate-500 mt-1">Lịch tập huấn KHKT, sinh hoạt nội bộ và lịch mở cửa phòng Lab.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setScheduleModalOpen(true)}
            className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tạo Lịch Mới
          </button>
        )}
      </div>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/70 border border-slate-200/60 rounded-2xl p-4 backdrop-blur-sm text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
            <CalendarDays className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Tổng</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalCount}</p>
        </div>
        <div className="bg-white/70 border border-emerald-200/60 rounded-2xl p-4 backdrop-blur-sm text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 text-emerald-500 mb-1">
            <CalendarCheck2 className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Sắp tới</span>
          </div>
          <p className="text-2xl font-black text-emerald-600">{upcomingCount}</p>
        </div>
        <div className="bg-white/70 border border-slate-200/60 rounded-2xl p-4 backdrop-blur-sm text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
            <History className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Đã qua</span>
          </div>
          <p className="text-2xl font-black text-slate-500">{pastCount}</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white/70 border border-slate-200/60 rounded-2xl p-4 backdrop-blur-sm shadow-sm space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề hoặc phụ trách..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-stemBlue-500/40 focus:border-stemBlue-400 transition"
          />
        </div>

        {/* Time filter buttons */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setTimeFilter(btn.key)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                timeFilter === btn.key
                  ? 'bg-stemBlue-600 text-white shadow-md shadow-stemBlue-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500">
          Hiển thị {filtered.length} / {totalCount} lịch
        </span>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="text-stemBlue-600 w-5 h-5" />
            Sự kiện sắp tới
          </h3>
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium">Không tìm thấy lịch hoạt động phù hợp.</div>
            ) : (
              filtered.map((sc) => (
                <div
                  key={sc.id}
                  className="bg-white/70 border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-stemBlue-100 text-stemBlue-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                      {sc.date}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{sc.time_range}</span>
                    <StatusBadge status={sc.status} />
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">{sc.title}</h4>
                  <div className="mt-2 text-xs font-semibold text-slate-500 space-y-0.5">
                    <p>Phụ trách: <span className="text-slate-800">{sc.instructor}</span></p>
                    <p>Đối tượng: <span className="text-slate-800">{sc.target_audience}</span></p>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-3 rounded-xl leading-relaxed border border-slate-100/50">
                    {sc.description}
                  </p>
                  {isAdmin && (
                    <button
                      onClick={() => deleteSchedule(sc.id)}
                      className="text-rose-500 text-xs font-bold mt-3 flex items-center gap-1 hover:text-rose-700 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa lịch sự kiện
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inner Rules Column */}
        <div>
          <div className="bg-white/80 p-6 rounded-3xl border border-slate-200 shadow-md backdrop-blur-sm space-y-4 sticky top-24">
            <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldAlert className="text-amber-500 w-5 h-5 animate-pulse" />
              Nội quy Phòng STEM Lab
            </h3>
            <ol className="text-xs sm:text-sm text-slate-600 space-y-3 list-decimal pl-4 leading-relaxed font-medium">
              <li>Chỉ vào phòng khi có sự hướng dẫn và giám sát của giáo viên phụ trách.</li>
              <li>Đăng ký mượn thiết bị và linh kiện trực tuyến qua hệ thống web trước.</li>
              <li>Bảo quản linh kiện cẩn thận, dùng đúng quy cách kỹ thuật.</li>
              <li>Tuyệt đối không mang linh kiện ra khỏi phòng Lab khi chưa được duyệt.</li>
              <li>Thu dọn vệ sinh, tắt toàn bộ nguồn điện thiết bị trước khi rời khỏi Lab.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
