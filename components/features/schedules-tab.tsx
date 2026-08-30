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
  X,
  MapPin,
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

// Safe local YYYY-MM-DD formatting (immune to UTC timezone shift)
function formatYMD(year: number, monthZeroIndexed: number, day: number): string {
  const m = String(monthZeroIndexed + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

function getTodayYMD(): string {
  const now = new Date()
  return formatYMD(now.getFullYear(), now.getMonth(), now.getDate())
}

function getStatus(dateStr: string): 'upcoming' | 'today' | 'past' {
  const todayStr = getTodayYMD()
  if (dateStr === todayStr) return 'today'
  if (dateStr > todayStr) return 'upcoming'
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
  const day = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - day)
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

  // Calendar month navigation state
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0 - 11

  const todayStr = getTodayYMD()

  const enriched = useMemo(
    () => schedules.map((sc) => ({ ...sc, status: getStatus(sc.date) })),
    [schedules],
  )

  // Map schedules by exact date YYYY-MM-DD
  const schedulesByDate = useMemo(() => {
    const map: Record<string, Schedule[]> = {}
    schedules.forEach((sc) => {
      if (!map[sc.date]) map[sc.date] = []
      map[sc.date].push(sc)
    })
    return map
  }, [schedules])

  // 100% Accurate Local Month Grid computation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    // Day of week for 1st day (0 = Sun, 1 = Mon ... -> Monday=0, Sunday=6)
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7

    const days: Array<{
      dateStr: string
      dayNumber: number
      isCurrentMonth: boolean
      isToday: boolean
      hasSchedule: boolean
      events: Schedule[]
    }> = []

    // Previous month padding days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i
      const dateStr =
        currentMonth === 0
          ? formatYMD(currentYear - 1, 11, dayNum)
          : formatYMD(currentYear, currentMonth - 1, dayNum)

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
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateStr = formatYMD(currentYear, currentMonth, dayNum)
      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        hasSchedule: Boolean(schedulesByDate[dateStr]?.length),
        events: schedulesByDate[dateStr] || [],
      })
    }

    // Next month padding days to complete row of 7
    const remaining = (7 - (days.length % 7)) % 7
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const dateStr =
        currentMonth === 11
          ? formatYMD(currentYear + 1, 0, dayNum)
          : formatYMD(currentYear, currentMonth + 1, dayNum)

      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        hasSchedule: Boolean(schedulesByDate[dateStr]?.length),
        events: schedulesByDate[dateStr] || [],
      })
    }

    return days
  }, [currentYear, currentMonth, schedulesByDate, todayStr])

  // List view filtering
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
      const wsStr = formatYMD(ws.getFullYear(), ws.getMonth(), ws.getDate())
      const weStr = formatYMD(we.getFullYear(), we.getMonth(), we.getDate())
      list = list.filter((sc) => sc.date >= wsStr && sc.date <= weStr)
    } else if (timeFilter === 'this_month') {
      const prefix = `${currentYear}-${String(now.getMonth() + 1).padStart(2, '0')}`
      list = list.filter((sc) => sc.date.startsWith(prefix))
    } else if (timeFilter === 'past') {
      list = list.filter((sc) => sc.date < todayStr)
    }

    return list
  }, [enriched, search, timeFilter, currentYear, todayStr])

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
    setSelectedDateStr(todayStr)
  }

  const selectedDayEvents = selectedDateStr ? schedulesByDate[selectedDateStr] || [] : []

  return (
    <section className="space-y-5 animate-fade-in">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-sky-600" />
            Lịch Hoạt Động &amp; Thực Hành STEM
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Lịch phòng Lab, các tiết học STEM thực hành và lịch tập huấn KHKT.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200/80">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-sky-700 shadow-xs'
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
                  ? 'bg-white text-sky-700 shadow-xs'
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
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold py-1.5 px-3.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tạo Lịch
            </button>
          )}
        </div>
      </div>

      {/* ════════════ CALENDAR VIEW (CUỐN LỊCH) ════════════ */}
      {viewMode === 'calendar' && (
        <div className="space-y-4 animate-fade-in">
          {/* Month Navigator Toolbar */}
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title="Tháng trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title="Tháng sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Tháng {currentMonth + 1} / {currentYear}
              </h3>
            </div>

            {/* Legend & Quick Today */}
            <div className="flex items-center gap-2.5 text-xs">
              <div className="flex items-center gap-3 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Có lịch học (Đỏ)
                </span>
                <span className="flex items-center gap-1.5 text-sky-600 font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Hôm nay
                </span>
              </div>

              <button
                onClick={handleToday}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Hôm nay
              </button>
            </div>
          </div>

          {/* Monthly Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Days of Week Header: Thứ 2 -> Chủ Nhật */}
            <div className="grid grid-cols-7 bg-slate-50/90 border-b border-slate-200 text-center text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider py-2">
              <span>Thứ 2</span>
              <span>Thứ 3</span>
              <span>Thứ 4</span>
              <span>Thứ 5</span>
              <span>Thứ 6</span>
              <span className="text-sky-600">Thứ 7</span>
              <span className="text-rose-600">Chủ Nhật</span>
            </div>

            {/* Grid Cells (64-76px high - compact & readable) */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
              {calendarDays.map((d, idx) => {
                const isSelected = selectedDateStr === d.dateStr
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDateStr(d.dateStr)}
                    className={`min-h-[60px] sm:min-h-[74px] p-1.5 sm:p-2 flex flex-col justify-between transition-all cursor-pointer select-none group relative ${
                      !d.isCurrentMonth
                        ? 'bg-slate-50/30 text-slate-300'
                        : d.hasSchedule
                        ? 'bg-rose-50/70 hover:bg-rose-100/80 border-rose-200/90'
                        : 'bg-white hover:bg-slate-50/80 text-slate-700'
                    } ${isSelected ? 'ring-2 ring-sky-500 z-10' : ''}`}
                  >
                    {/* Top Row: Day number & Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black rounded-md w-5 h-5 flex items-center justify-center ${
                          d.isToday
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : d.hasSchedule
                            ? 'text-rose-700 bg-rose-100'
                            : d.isCurrentMonth
                            ? 'text-slate-700'
                            : 'text-slate-300'
                        }`}
                      >
                        {d.dayNumber}
                      </span>

                      {d.hasSchedule && (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold text-rose-600 bg-rose-100/90 px-1.5 py-0.2 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                          {d.events.length}
                        </span>
                      )}
                    </div>

                    {/* Events mini snippet */}
                    <div className="space-y-0.5 my-0.5 overflow-hidden">
                      {d.events.slice(0, 1).map((ev) => (
                        <div
                          key={ev.id}
                          className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white truncate shadow-2xs"
                          title={`${ev.time_range ? `[${ev.time_range}] ` : ''}${ev.title}`}
                        >
                          {ev.time_range ? `${ev.time_range} ` : ''}{ev.title}
                        </div>
                      ))}
                      {d.events.length > 1 && (
                        <div className="text-[8px] sm:text-[9px] font-bold text-rose-600 leading-tight">
                          +{d.events.length - 1} sự kiện
                        </div>
                      )}
                    </div>

                    {/* Subtle hover detail indicator */}
                    <div className="text-[8px] sm:text-[9px] text-slate-400 group-hover:text-sky-600 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem &rarr;
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ════════════ SELECTED DATE DETAILS PANEL ════════════ */}
          {selectedDateStr && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      Lịch học ngày: <span className="text-rose-600 font-black">{selectedDateStr}</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      {selectedDayEvents.length > 0
                        ? `Có ${selectedDayEvents.length} hoạt động / tiết học trong ngày.`
                        : 'Chưa có lịch học nào được xếp vào ngày này.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title="Đóng chi tiết"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs sm:text-sm space-y-1 bg-slate-50/60 rounded-xl border border-slate-100">
                  <p className="font-medium">Phòng Lab không có lịch hoạt động vào ngày {selectedDateStr}.</p>
                  {isAdmin && (
                    <button
                      onClick={() => setScheduleModalOpen(true)}
                      className="mt-1.5 text-xs font-bold text-sky-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tạo lịch cho ngày này
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedDayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-rose-50/60 border border-rose-200/90 p-3.5 sm:p-4 rounded-xl space-y-2 relative"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          ⏰ {ev.time_range || 'Cả ngày'}
                        </span>
                        <StatusBadge status={getStatus(ev.date)} />
                      </div>

                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        {ev.title}
                      </h5>

                      <div className="text-xs text-slate-600 space-y-0.5">
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
                        <p className="text-xs text-slate-700 bg-white/90 p-2.5 rounded-lg border border-rose-100 leading-relaxed">
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
        <div className="space-y-5 animate-fade-in">
          {/* Mini Dashboard */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Tổng số</span>
              </div>
              <p className="text-xl font-black text-slate-900">{totalCount}</p>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-0.5">
                <CalendarCheck2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Sắp diễn ra</span>
              </div>
              <p className="text-xl font-black text-emerald-700">{upcomingCount}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <History className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Đã qua</span>
              </div>
              <p className="text-xl font-black text-slate-600">{pastCount}</p>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm theo tiêu đề lịch hoặc giáo viên phụ trách..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
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
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    timeFilter === btn.key
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-12 bg-slate-50/60 rounded-2xl border border-slate-200/80 text-slate-400 font-medium text-sm">
                  Không tìm thấy lịch hoạt động phù hợp.
                </div>
              ) : (
                filtered.map((sc) => (
                  <div
                    key={sc.id}
                    className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs hover:shadow-sm hover:border-sky-300 transition-all space-y-2"
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
                      <p className="text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl leading-relaxed border border-slate-100">
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
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 sticky top-24">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <ShieldAlert className="text-amber-500 w-4 h-4" />
                  Nội quy Phòng STEM Lab
                </h3>
                <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-4 leading-relaxed font-medium">
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
