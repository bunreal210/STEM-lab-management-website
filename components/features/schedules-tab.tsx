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
    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${cls}`}>
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

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (sc) =>
          sc.title.toLowerCase().includes(q) ||
          (sc.instructor && sc.instructor.toLowerCase().includes(q)),
      )
    }

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
      list = list.filter((sc) => {
        const d = new Date(sc.date + 'T00:00:00')
        return d < now
      })
    }

    return list
  }, [enriched, search, timeFilter])

  const totalCount = enriched.length
  const upcomingCount = enriched.filter((s) => s.status !== 'past').length
  const pastCount = enriched.filter((s) => s.status === 'past').length

  const filterButtons: { key: TimeFilter; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'this_week', label: 'Tuần này' },
    { key: 'this_month', label: 'Tháng này' },
    { key: 'past', label: 'Đã kết thúc' },
  ]

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-sky-600" />
            Lịch Học &amp; Hoạt Động STEM
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Theo dõi lịch tập huấn KHKT, sinh hoạt CLB và lịch thực hành phòng Lab.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setScheduleModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tạo Lịch Mới
          </button>
        )}
      </div>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
            <CalendarDays className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Tổng số</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{totalCount}</p>
        </div>
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 sm:p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
            <CalendarCheck2 className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Sắp diễn ra</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700">{upcomingCount}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
            <History className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Đã qua</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-600">{pastCount}</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề lịch hoặc giáo viên phụ trách..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setTimeFilter(btn.key)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                timeFilter === btn.key
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/60 rounded-2xl border border-slate-200/80 text-slate-400 font-medium text-sm">
              Không tìm thấy lịch hoạt động phù hợp.
            </div>
          ) : (
            filtered.map((sc) => (
              <div
                key={sc.id}
                className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-sky-300 transition-all space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-50 text-sky-700 border border-sky-100 text-xs font-bold px-2.5 py-1 rounded-lg">
                      📅 {sc.date}
                    </span>
                    {sc.time_range && (
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {sc.time_range}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={sc.status} />
                </div>

                <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">{sc.title}</h4>

                <div className="text-xs font-medium text-slate-600 space-y-0.5">
                  <p>Phụ trách: <span className="font-semibold text-slate-800">{sc.instructor || 'Chưa phân công'}</span></p>
                  <p>Đối tượng: <span className="font-semibold text-slate-800">{sc.target_audience || 'Toàn trường'}</span></p>
                </div>

                {sc.description && (
                  <p className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl leading-relaxed border border-slate-100">
                    {sc.description}
                  </p>
                )}

                {isAdmin && (
                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => deleteSchedule(sc.id)}
                      className="text-rose-500 text-xs font-bold flex items-center gap-1 hover:text-rose-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa lịch
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Rules Box */}
        <div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <ShieldAlert className="text-amber-500 w-4 h-4" />
              Nội quy Phòng STEM Lab
            </h3>
            <ol className="text-xs text-slate-600 space-y-2.5 list-decimal pl-4 leading-relaxed font-medium">
              <li>Chỉ vào phòng khi có sự hướng dẫn và giám sát của giáo viên phụ trách.</li>
              <li>Đăng ký mượn thiết bị trực tuyến trước khi nhận bàn giao.</li>
              <li>Bảo quản linh kiện cẩn thận, sử dụng đúng tài liệu hướng dẫn kỹ thuật.</li>
              <li>Tuyệt đối không tự ý mang linh kiện ra khỏi phòng khi chưa duyệt.</li>
              <li>Thu dọn vệ sinh, tắt toàn bộ nguồn điện thiết bị trước khi rời khỏi Lab.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
