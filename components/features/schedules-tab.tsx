'use client'

import { useState, useMemo } from 'react'
import {
  CalendarDays,
  ShieldAlert,
  Plus,
  Trash2,
  Search,
  CalendarCheck2,
  Clock,
  History,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  User,
  Users,
  Info,
  X,
  Sparkles,
} from 'lucide-react'
import type { Schedule } from '@/lib/types'

interface SchedulesTabProps {
  schedules: Schedule[]
  isAdmin: boolean
  setScheduleModalOpen: (val: boolean) => void
  deleteSchedule: (id: string) => void
}

type TimeFilter = 'all' | 'this_week' | 'this_month' | 'past'
type ViewMode = 'calendar' | 'list'

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
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}>
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
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [search, setSearch] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')

  // Calendar month/year navigation state
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0 - 11

  const enriched = useMemo(
    () => schedules.map((sc) => ({ ...sc, status: getStatus(sc.date) })),
    [schedules],
  )

  // Map schedules by date string YYYY-MM-DD
  const schedulesByDate = useMemo(() => {
    const map: Record<string, Schedule[]> = {}
    schedules.forEach((sc) => {
      if (!map[sc.date]) map[sc.date] = []
      map[sc.date].push(sc)
    })
    return map
  }, [schedules])

  // Compute days in current month grid
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    // Day of week for 1st day (0 = Sun, 1 = Mon... -> convert to Monday = 0)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1
    if (startDayOfWeek === -1) startDayOfWeek = 6

    const days: Array<{
      dateStr: string
      dayNumber: number
      isCurrentMonth: boolean
      isToday: boolean
      hasSchedule: boolean
      events: Schedule[]
    }> = []

    const todayStr = new Date().toISOString().split('T')[0]

    // Previous month padding days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i
      const d = new Date(currentYear, currentMonth - 1, dayNum)
      const dateStr = d.toISOString().split('T')[0]
      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        hasSchedule: Boolean(schedulesByDate[dateStr]?.length),
        events: schedulesByDate[dateStr] || [],
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0')
      const dayStr = String(i).padStart(2, '0')
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        hasSchedule: Boolean(schedulesByDate[dateStr]?.length),
        events: schedulesByDate[dateStr] || [],
      })
    }

    // Next month padding days to complete 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(currentYear, currentMonth + 1, i)
      const dateStr = d.toISOString().split('T')[0]
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        hasSchedule: Boolean(schedulesByDate[dateStr]?.length),
        events: schedulesByDate[dateStr] || [],
      })
    }

    return days
  }, [currentYear, currentMonth, schedulesByDate])

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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDateStr(today.toISOString().split('T')[0])
  }

  // Selected date events for modal / panel
  const selectedDayEvents = selectedDateStr ? schedulesByDate[selectedDateStr] || [] : []

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-sky-600" />
            Lịch Hoạt Động &amp; Thực Hành STEM
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi trực quan lịch mở cửa phòng Lab, các tiết học và sự kiện tập huấn KHKT.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Cuốn Lịch
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Danh sách
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold py-2 px-3.5 rounded-xl shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tạo Lịch
            </button>
          )}
        </div>
      </div>

      {/* ════════════ CALENDAR VIEW (CUỐN LỊCH) ════════════ */}
      {viewMode === 'calendar' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Calendar Month Header Controller */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  title="Tháng trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  title="Tháng sau"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 capitalize tracking-tight flex items-center gap-2">
                <span>Tháng {currentMonth + 1} / {currentYear}</span>
              </h3>
            </div>

            {/* Legend & Today button */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1 text-rose-600 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  Có lịch học (Đỏ)
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">Bấm vào ngày để xem</span>
              </div>

              <button
                onClick={handleToday}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Hôm nay
              </button>
            </div>
          </div>

          {/* Calendar Month Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Weekdays Header (T2 - CN) */}
            <div className="grid grid-cols-7 bg-slate-50/90 border-b border-slate-200 text-center text-xs font-bold text-slate-500 uppercase tracking-wider py-2.5">
              <span>Thứ 2</span>
              <span>Thứ 3</span>
              <span>Thứ 4</span>
              <span>Thứ 5</span>
              <span>Thứ 6</span>
              <span className="text-sky-600">Thứ 7</span>
              <span className="text-rose-600">Chủ Nhật</span>
            </div>

            {/* Days Grid Cells */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
              {calendarDays.map((d, idx) => {
                const isSelected = selectedDateStr === d.dateStr
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDateStr(d.dateStr)}
                    className={`min-h-[85px] sm:min-h-[105px] p-2 flex flex-col justify-between transition-all cursor-pointer select-none group relative ${
                      !d.isCurrentMonth
                        ? 'bg-slate-50/40 text-slate-300'
                        : d.hasSchedule
                        ? 'bg-rose-50/60 hover:bg-rose-100/70 border-rose-200'
                        : 'bg-white hover:bg-slate-50/80 text-slate-700'
                    } ${isSelected ? 'ring-2 ring-indigo-500 z-10' : ''}`}
                  >
                    {/* Day Number and Today badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs sm:text-sm font-black rounded-lg w-6 h-6 flex items-center justify-center ${
                          d.isToday
                            ? 'bg-sky-600 text-white shadow-xs'
                            : d.hasSchedule
                            ? 'text-rose-600 bg-rose-100/80'
                            : 'text-slate-700'
                        }`}
                      >
                        {d.dayNumber}
                      </span>

                      {d.hasSchedule && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                          {d.events.length}
                        </span>
                      )}
                    </div>

                    {/* Events Mini List inside day cell */}
                    <div className="space-y-1 my-1 flex-1 overflow-hidden">
                      {d.events.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white truncate shadow-2xs group-hover:scale-101 transition-transform"
                          title={`${ev.time_range ? `[${ev.time_range}] ` : ''}${ev.title}`}
                        >
                          {ev.time_range ? `${ev.time_range}: ` : ''}{ev.title}
                        </div>
                      ))}
                      {d.events.length > 2 && (
                        <div className="text-[9px] font-bold text-rose-600 italic">
                          +{d.events.length - 2} lịch khác...
                        </div>
                      )}
                    </div>

                    {/* Bottom hover hint */}
                    <div className="text-[9px] text-slate-400 group-hover:text-slate-600 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      Chi tiết &rarr;
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ════════════ SELECTED DATE DETAILS PANEL ════════════ */}
          {selectedDateStr && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">
                      Chi tiết lịch học ngày: <span className="text-rose-600">{selectedDateStr}</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      {selectedDayEvents.length > 0
                        ? `Có ${selectedDayEvents.length} hoạt động / tiết học diễn ra trong ngày này.`
                        : 'Không có lịch học nào được xếp vào ngày này.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs sm:text-sm space-y-1">
                  <p className="font-medium">Phòng Lab chưa có lịch vào ngày {selectedDateStr}.</p>
                  {isAdmin && (
                    <button
                      onClick={() => setScheduleModalOpen(true)}
                      className="mt-2 text-xs font-bold text-sky-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm lịch cho ngày này
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {selectedDayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-rose-50/50 border border-rose-200 p-4 rounded-xl space-y-2 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                          ⏰ {ev.time_range || 'Cả ngày'}
                        </span>
                        <StatusBadge status={getStatus(ev.date)} />
                      </div>

                      <h5 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {ev.title}
                      </h5>

                      <div className="text-xs text-slate-600 space-y-1">
                        <p className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Phụ trách: <span className="font-semibold text-slate-800">{ev.instructor || 'Chưa phân công'}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          Đối tượng: <span className="font-semibold text-slate-800">{ev.target_audience || 'Toàn trường'}</span>
                        </p>
                      </div>

                      {ev.description && (
                        <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-rose-100 leading-relaxed">
                          {ev.description}
                        </p>
                      )}

                      {isAdmin && (
                        <div className="pt-2 border-t border-rose-100 flex justify-end">
                          <button
                            onClick={() => deleteSchedule(ev.id)}
                            className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa lịch này
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* ════════════ LIST VIEW (DẠNG DANH SÁCH) ════════════ */}
      {viewMode === 'list' && (
        <div className="space-y-6 animate-fade-in">
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
              {[
                { key: 'all' as const, label: 'Tất cả' },
                { key: 'this_week' as const, label: 'Tuần này' },
                { key: 'this_month' as const, label: 'Tháng này' },
                { key: 'past' as const, label: 'Đã kết thúc' },
              ].map((btn) => (
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
        </div>
      )}
    </section>
  )
}
