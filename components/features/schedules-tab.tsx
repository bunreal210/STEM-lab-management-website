'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import {
  CalendarDays,
  Calendar as CalendarIcon,
  CalendarCheck2,
  Clock,
  ChevronLeft,
  ChevronRight,
  List,
  User,
  Users,
  X,
  Plus,
  Trash2,
  Search,
  Star,
  Share2,
  Download,
  Printer,
  Sparkles,
  Award,
  Cpu,
  Code,
  Layers,
  Check,
  ShieldAlert,
  ArrowRight,
  Filter,
  BookOpen,
} from 'lucide-react'
import type { Schedule } from '@/lib/types'

interface SchedulesTabProps {
  schedules: Schedule[]
  isAdmin: boolean
  setScheduleModalOpen: (val: boolean) => void
  deleteSchedule: (id: string) => void
}

export type ViewMode = 'day' | 'week' | 'month' | 'list'
export type TimeFilter = 'all' | 'today' | 'this_week' | 'this_month' | 'upcoming' | 'past' | 'bookmarked'
export type TopicCategory = 'all' | 'robotics' | 'ai_code' | 'science_khkt' | 'lab_experiment' | 'design_3d' | 'general'
export type ShiftCategory = 'all' | 'morning' | 'afternoon' | 'evening'

// ── SAFE LOCAL DATE FORMATTING ──
function formatYMD(year: number, monthZeroIndexed: number, day: number): string {
  const m = String(monthZeroIndexed + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

function getTodayYMD(): string {
  const now = new Date()
  return formatYMD(now.getFullYear(), now.getMonth(), now.getDate())
}

function parseYMD(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfWeek(date: Date): Date {
  const s = startOfWeek(date)
  const e = new Date(s)
  e.setDate(s.getDate() + 6)
  e.setHours(23, 59, 59, 999)
  return e
}

function getWeekDays(date: Date): Date[] {
  const s = startOfWeek(date)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(s)
    d.setDate(s.getDate() + i)
    days.push(d)
  }
  return days
}

const VI_DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const VI_DAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function formatVietnameseDate(ymd: string): string {
  if (!ymd) return ''
  const d = parseYMD(ymd)
  const dayOfWeek = VI_DAYS[d.getDay()]
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${dayOfWeek}, ngày ${day}/${month}/${year}`
}

// ── TOPIC RECOGNITION & COLOR STYLES ──
interface TopicInfo {
  key: TopicCategory
  label: string
  icon: typeof Cpu
  badgeClass: string
  cardBorder: string
  gradientHeader: string
  bgSoft: string
  dotColor: string
}

function detectTopic(title: string = '', desc: string = ''): TopicInfo {
  const text = (title + ' ' + desc).toLowerCase()
  if (text.includes('robot') || text.includes('vẽ mạch') || text.includes('arduino') || text.includes('iot') || text.includes('cảm biến') || text.includes('tự động')) {
    return {
      key: 'robotics',
      label: 'Robotics & Tự Động Hóa',
      icon: Cpu,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      cardBorder: 'border-amber-200 hover:border-amber-400',
      gradientHeader: 'from-amber-500 to-orange-500',
      bgSoft: 'bg-amber-50/50',
      dotColor: 'bg-amber-500',
    }
  }
  if (text.includes('code') || text.includes('lập trình') || text.includes('python') || text.includes('ai') || text.includes('trí tuệ nhân tạo') || text.includes('scratch') || text.includes('c++') || text.includes('thuật toán')) {
    return {
      key: 'ai_code',
      label: 'Lập Trình & AI',
      icon: Code,
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      cardBorder: 'border-blue-200 hover:border-blue-400',
      gradientHeader: 'from-blue-600 to-indigo-600',
      bgSoft: 'bg-blue-50/50',
      dotColor: 'bg-blue-600',
    }
  }
  if (text.includes('khkt') || text.includes('nghiên cứu') || text.includes('sáng chế') || text.includes('dự án') || text.includes('tập huấn') || text.includes('khoa học kỹ thuật')) {
    return {
      key: 'science_khkt',
      label: 'Nghiên Cứu KHKT',
      icon: Award,
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      cardBorder: 'border-purple-200 hover:border-purple-400',
      gradientHeader: 'from-purple-600 to-pink-600',
      bgSoft: 'bg-purple-50/50',
      dotColor: 'bg-purple-600',
    }
  }
  if (text.includes('hóa') || text.includes('sinh') || text.includes('lý') || text.includes('thí nghiệm') || text.includes('thực nghiệm') || text.includes('môi trường')) {
    return {
      key: 'lab_experiment',
      label: 'Thí Nghiệm Khoa Học',
      icon: Sparkles,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cardBorder: 'border-emerald-200 hover:border-emerald-400',
      gradientHeader: 'from-emerald-500 to-teal-600',
      bgSoft: 'bg-emerald-50/50',
      dotColor: 'bg-emerald-500',
    }
  }
  if (text.includes('3d') || text.includes('in 3d') || text.includes('laser') || text.includes('mô hình') || text.includes('thiết kế')) {
    return {
      key: 'design_3d',
      label: 'Thiết Kế & In 3D',
      icon: Layers,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      cardBorder: 'border-rose-200 hover:border-rose-400',
      gradientHeader: 'from-rose-500 to-pink-600',
      bgSoft: 'bg-rose-50/50',
      dotColor: 'bg-rose-500',
    }
  }
  return {
    key: 'general',
    label: 'Thực Hành STEM',
    icon: BookOpen,
    badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
    cardBorder: 'border-sky-200 hover:border-sky-400',
    gradientHeader: 'from-sky-600 to-cyan-600',
    bgSoft: 'bg-sky-50/40',
    dotColor: 'bg-sky-500',
  }
}

// Detect Shift (Sáng / Chiều / Tối)
function detectShift(timeRange: string | null): 'morning' | 'afternoon' | 'evening' | 'other' {
  if (!timeRange) return 'other'
  const match = timeRange.match(/(\d{1,2})[:h]/)
  if (match) {
    const hour = parseInt(match[1], 10)
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    return 'evening'
  }
  return 'other'
}

// Check if an event is happening RIGHT NOW
function isOngoingNow(dateStr: string, timeRange: string | null): boolean {
  const todayStr = getTodayYMD()
  if (dateStr !== todayStr || !timeRange) return false

  const times = timeRange.split(/[-–~]/).map((s) => s.trim())
  if (times.length < 2) return false

  const parseToMinutes = (tStr: string) => {
    const m = tStr.match(/(\d{1,2})[:h](\d{2})?/)
    if (!m) return null
    const h = parseInt(m[1], 10)
    const min = m[2] ? parseInt(m[2], 10) : 0
    return h * 60 + min
  }

  const startMin = parseToMinutes(times[0])
  const endMin = parseToMinutes(times[1])

  if (startMin === null || endMin === null) return false

  const now = new Date()
  const currentMin = now.getHours() * 60 + now.getMinutes()

  return currentMin >= startMin && currentMin <= endMin
}

function getStatus(dateStr: string, timeRange: string | null): 'ongoing' | 'today' | 'upcoming' | 'past' {
  if (isOngoingNow(dateStr, timeRange)) return 'ongoing'
  const todayStr = getTodayYMD()
  if (dateStr === todayStr) return 'today'
  if (dateStr > todayStr) return 'upcoming'
  return 'past'
}

function StatusBadge({ status }: { status: 'ongoing' | 'today' | 'upcoming' | 'past' }) {
  if (status === 'ongoing') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-500 text-white shadow-xs animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        Đang diễn ra
      </span>
    )
  }
  if (status === 'today') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Hôm nay
      </span>
    )
  }
  if (status === 'upcoming') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Sắp tới
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
      Đã kết thúc
    </span>
  )
}

// Generate .ics calendar download file
function exportToICS(schedules: Schedule[], filename = 'Lich_Hoc_STEM_Lab.ics') {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//STEM Lab Management//Lich Hoc//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Lịch Thực Hành STEM Lab',
    'X-WR-TIMEZONE:Asia/Ho_Chi_Minh',
  ]

  schedules.forEach((sc) => {
    const ymd = sc.date.replace(/-/g, '')
    let dtStart = `${ymd}T080000`
    let dtEnd = `${ymd}T100000`

    if (sc.time_range) {
      const parts = sc.time_range.split(/[-–~]/).map((s) => s.trim())
      if (parts[0]) {
        const m = parts[0].match(/(\d{1,2})[:h](\d{2})?/)
        if (m) {
          const h = m[1].padStart(2, '0')
          const min = (m[2] || '00').padStart(2, '0')
          dtStart = `${ymd}T${h}${min}00`
        }
      }
      if (parts[1]) {
        const m = parts[1].match(/(\d{1,2})[:h](\d{2})?/)
        if (m) {
          const h = m[1].padStart(2, '0')
          const min = (m[2] || '00').padStart(2, '0')
          dtEnd = `${ymd}T${h}${min}00`
        }
      }
    }

    const description = `Giáo viên phụ trách: ${sc.instructor || 'Chưa rõ'}\\nĐối tượng: ${sc.target_audience || 'Toàn trường'}\\nNội dung: ${sc.description || 'Không có mô tả chi tiết'}`

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:stem-schedule-${sc.id}@stemlab.edu.vn`,
      `DTSTAMP:${ymd}T000000Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${sc.title}`,
      `DESCRIPTION:${description}`,
      'LOCATION:Phòng Thực Hành STEM Lab',
      'STATUS:CONFIRMED',
      'END:VEVENT',
    )
  })

  icsContent.push('END:VCALENDAR')

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function SchedulesTab({
  schedules,
  isAdmin,
  setScheduleModalOpen,
  deleteSchedule,
}: SchedulesTabProps) {
  // ── CORE STATE ──
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [topicFilter, setTopicFilter] = useState<TopicCategory>('all')
  const [shiftFilter, setShiftFilter] = useState<ShiftCategory>('all')
  const [search, setSearch] = useState('')

  // Selected date for day view and detail popup
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date())
  const [selectedEventModal, setSelectedEventModal] = useState<Schedule | null>(null)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [copyFeedbackId, setCopyFeedbackId] = useState<string | null>(null)
  const [, setCurrentTime] = useState<Date>(() => new Date())

  const printRef = useRef<HTMLDivElement>(null)

  // Live timer tick every 30s
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  // Load bookmarks from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stem_saved_schedules')
      if (saved) setBookmarkedIds(JSON.parse(saved))
    } catch {
      // ignore
    }
  }, [])

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      try {
        localStorage.setItem('stem_saved_schedules', JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const copyShareText = (sc: Schedule) => {
    const text = `🗓️ LỊCH HOẠT ĐỘNG STEM LAB\n📌 Sự kiện: ${sc.title}\n📅 Ngày: ${formatVietnameseDate(sc.date)}\n⏰ Khung giờ: ${sc.time_range || 'Cả ngày'}\n👨‍🏫 Phụ trách: ${sc.instructor || 'Chưa phân công'}\n👥 Đối tượng: ${sc.target_audience || 'Toàn trường'}\n📍 Địa điểm: Phòng Thực Hành STEM Lab\n📝 Ghi chú: ${sc.description || 'Không có'}`
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedbackId(sc.id)
      setTimeout(() => setCopyFeedbackId(null), 2500)
    })
  }

  const todayStr = getTodayYMD()
  const currentSelectedYMD = formatYMD(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

  // Enrich schedules with topic, shift & live status
  const enrichedSchedules = useMemo(() => {
    return schedules.map((sc) => {
      const topic = detectTopic(sc.title, sc.description || '')
      const shift = detectShift(sc.time_range)
      const status = getStatus(sc.date, sc.time_range)
      const isBookmarked = bookmarkedIds.includes(sc.id)
      return {
        ...sc,
        topic,
        shift,
        status,
        isBookmarked,
      }
    })
  }, [schedules, bookmarkedIds])

  // Map schedules by exact date YYYY-MM-DD
  const schedulesByDate = useMemo(() => {
    const map: Record<string, typeof enrichedSchedules> = {}
    enrichedSchedules.forEach((sc) => {
      if (!map[sc.date]) map[sc.date] = []
      map[sc.date].push(sc)
    })
    return map
  }, [enrichedSchedules])

  // Current ongoing event in lab
  const currentOngoingEvent = useMemo(() => {
    return enrichedSchedules.find((s) => s.status === 'ongoing')
  }, [enrichedSchedules])

  // Next upcoming event for countdown
  const nextUpcomingEvent = useMemo(() => {
    const upcoming = enrichedSchedules
      .filter((s) => s.status === 'upcoming' || (s.status === 'today' && !isOngoingNow(s.date, s.time_range)))
      .sort((a, b) => a.date.localeCompare(b.date))
    return upcoming[0] || null
  }, [enrichedSchedules])

  // Stats calculation
  const totalCount = enrichedSchedules.length
  const todayCount = enrichedSchedules.filter((s) => s.date === todayStr).length

  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])

  const weekStartStr = formatYMD(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
  const weekEndStr = formatYMD(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate())

  const weekCount = enrichedSchedules.filter((s) => s.date >= weekStartStr && s.date <= weekEndStr).length

  // Filtered schedules for List View & Search
  const filteredList = useMemo(() => {
    let list = enrichedSchedules

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (sc) =>
          sc.title.toLowerCase().includes(q) ||
          (sc.instructor && sc.instructor.toLowerCase().includes(q)) ||
          (sc.target_audience && sc.target_audience.toLowerCase().includes(q)) ||
          (sc.description && sc.description.toLowerCase().includes(q)),
      )
    }

    // Time filter
    if (timeFilter === 'today') {
      list = list.filter((sc) => sc.date === todayStr)
    } else if (timeFilter === 'this_week') {
      const now = new Date()
      const ws = startOfWeek(now)
      const we = endOfWeek(now)
      const wsStr = formatYMD(ws.getFullYear(), ws.getMonth(), ws.getDate())
      const weStr = formatYMD(we.getFullYear(), we.getMonth(), we.getDate())
      list = list.filter((sc) => sc.date >= wsStr && sc.date <= weStr)
    } else if (timeFilter === 'this_month') {
      const now = new Date()
      const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      list = list.filter((sc) => sc.date.startsWith(prefix))
    } else if (timeFilter === 'upcoming') {
      list = list.filter((sc) => sc.date >= todayStr)
    } else if (timeFilter === 'past') {
      list = list.filter((sc) => sc.date < todayStr)
    } else if (timeFilter === 'bookmarked') {
      list = list.filter((sc) => sc.isBookmarked)
    }

    // Topic filter
    if (topicFilter !== 'all') {
      list = list.filter((sc) => sc.topic.key === topicFilter)
    }

    // Shift filter
    if (shiftFilter !== 'all') {
      list = list.filter((sc) => sc.shift === shiftFilter)
    }

    // Sort by date ascending
    return list.sort((a, b) => a.date.localeCompare(b.date))
  }, [enrichedSchedules, search, timeFilter, topicFilter, shiftFilter, todayStr])

  // Navigation handlers
  const handlePrevDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 1)
    setCurrentDate(d)
  }

  const handleNextDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 1)
    setCurrentDate(d)
  }

  const handlePrevWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }

  const handleNextWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }

  const handlePrevMonth = () => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    setCurrentDate(d)
  }

  const handleNextMonth = () => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    setCurrentDate(d)
  }

  const handleGoToday = () => {
    setCurrentDate(new Date())
  }

  // Monthly Calendar Grid
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7 // Monday = 0

    const days: Array<{
      dateStr: string
      dayNumber: number
      isCurrentMonth: boolean
      isToday: boolean
      hasSchedule: boolean
      events: typeof enrichedSchedules
    }> = []

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i
      const dateStr =
        month === 0 ? formatYMD(year - 1, 11, dayNum) : formatYMD(year, month - 1, dayNum)
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
      const dateStr = formatYMD(year, month, dayNum)
      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        hasSchedule: Boolean(schedulesByDate[dateStr]?.length),
        events: schedulesByDate[dateStr] || [],
      })
    }

    // Next month padding
    const remaining = (7 - (days.length % 7)) % 7
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const dateStr = month === 11 ? formatYMD(year + 1, 0, dayNum) : formatYMD(year, month + 1, dayNum)
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
  }, [currentDate, schedulesByDate, todayStr])

  // Events for the selected day in Day View
  const selectedDayEvents = schedulesByDate[currentSelectedYMD] || []

  // Group events for the selected day by shifts
  const selectedDayMorning = selectedDayEvents.filter((e) => e.shift === 'morning' || e.shift === 'other')
  const selectedDayAfternoon = selectedDayEvents.filter((e) => e.shift === 'afternoon')
  const selectedDayEvening = selectedDayEvents.filter((e) => e.shift === 'evening')

  // Print timetable handler
  const handlePrint = () => {
    window.print()
  }

  return (
    <section className="space-y-6 animate-fade-in print:p-0 print:space-y-3">
      {/* ══════════════════════════════════════════════════════════════
          HERO LIVE BANNER & REALTIME ROOM STATUS
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 p-5 sm:p-7 text-white shadow-xl border border-sky-900/40 print:hidden">
        {/* Background glow & decoration */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title & Info */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
              Hệ thống Quản lý Thời Khóa Biểu Phòng STEM Lab
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <CalendarDays className="w-8 h-8 text-sky-400 shrink-0" />
              Lịch Hoạt Động &amp; Thực Hành STEM
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Theo dõi lịch phòng thí nghiệm, lịch câu lạc bộ Robotics, các tiết học STEM trải nghiệm và kế hoạch tập huấn KHKT.
            </p>

            {/* LIVE ROOM STATUS BADGE */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {currentOngoingEvent ? (
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-bold backdrop-blur-md">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                  </span>
                  <span>
                    🔴 Đang có lớp: <strong className="text-white underline">{currentOngoingEvent.title}</strong> ({currentOngoingEvent.time_range})
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-bold backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>🟢 Phòng Lab hiện đang sẵn sàng tiếp nhận hoạt động</span>
                </div>
              )}

              {nextUpcomingEvent && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>
                    Tiết học tiếp theo: <strong className="text-sky-300">{nextUpcomingEvent.title}</strong> ({formatVietnameseDate(nextUpcomingEvent.date)})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Counter Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 text-center min-w-[90px]">
              <div className="text-[11px] font-bold text-sky-200 uppercase tracking-wider">Hôm nay</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300">{todayCount}</div>
              <div className="text-[10px] text-slate-300 font-medium">tiết học</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 text-center min-w-[90px]">
              <div className="text-[11px] font-bold text-sky-200 uppercase tracking-wider">Tuần này</div>
              <div className="text-2xl sm:text-3xl font-black text-sky-300">{weekCount}</div>
              <div className="text-[10px] text-slate-300 font-medium">hoạt động</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 text-center min-w-[90px]">
              <div className="text-[11px] font-bold text-sky-200 uppercase tracking-wider">Tổng cộng</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300">{totalCount}</div>
              <div className="text-[10px] text-slate-300 font-medium">sự kiện</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN CONTROLS: 4 VIEW MODES & QUICK ACTIONS
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5 print:hidden">
        {/* View Mode Switcher (4 Modes) */}
        <div className="inline-flex bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 gap-1 overflow-x-auto">
          <button
            onClick={() => setViewMode('day')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'day'
                ? 'bg-white text-sky-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-600" />
            Theo Ngày
          </button>

          <button
            onClick={() => setViewMode('week')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'week'
                ? 'bg-white text-sky-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4 text-sky-600" />
            Theo Tuần
          </button>

          <button
            onClick={() => setViewMode('month')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'month'
                ? 'bg-white text-sky-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-sky-600" />
            Theo Tháng
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'list'
                ? 'bg-white text-sky-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <List className="w-4 h-4 text-sky-600" />
            Danh Sách
          </button>
        </div>

        {/* Action Buttons: Export, Print, Add Schedule */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => exportToICS(schedules)}
            title="Tải file .ics để thêm vào Google Calendar hoặc Apple Calendar"
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Xuất</span> Google Cal
          </button>

          <button
            onClick={handlePrint}
            title="In thời khóa biểu hoặc lưu thành file PDF"
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">In Thời Khóa Biểu</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setScheduleModalOpen(true)}
              className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-xl shadow-md shadow-sky-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tạo Lịch Mới
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MULTI-DIMENSIONAL FILTER TOOLBAR
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 print:hidden">
        {/* Top filter row: Search & Quick Time Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm môn học, giáo viên phụ trách, lớp học, từ khóa..."
              className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Time Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { key: 'all' as const, label: 'Tất cả' },
              { key: 'today' as const, label: 'Hôm nay' },
              { key: 'this_week' as const, label: 'Tuần này' },
              { key: 'this_month' as const, label: 'Tháng này' },
              { key: 'upcoming' as const, label: 'Sắp tới' },
              { key: 'bookmarked' as const, label: 'Đã lưu ⭐' },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setTimeFilter(btn.key)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0 ${
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

        {/* Bottom filter row: Topic Category Chips & Shift filter */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          {/* Topic Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Chủ đề:
            </span>
            {[
              { key: 'all' as const, label: 'Tất cả chủ đề' },
              { key: 'robotics' as const, label: '🤖 Robotics & IoT' },
              { key: 'ai_code' as const, label: '💻 Lập trình & AI' },
              { key: 'science_khkt' as const, label: '🔬 Nghiên cứu KHKT' },
              { key: 'lab_experiment' as const, label: '🧪 Thí nghiệm Lý-Hóa-Sinh' },
              { key: 'design_3d' as const, label: '🖨️ In & Thiết kế 3D' },
            ].map((topic) => (
              <button
                key={topic.key}
                onClick={() => setTopicFilter(topic.key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  topicFilter === topic.key
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Shift Filter (Sáng / Chiều / Tối) */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold mr-1">Ca:</span>
            {[
              { key: 'all' as const, label: 'Tất cả ca' },
              { key: 'morning' as const, label: 'Sáng' },
              { key: 'afternoon' as const, label: 'Chiều' },
              { key: 'evening' as const, label: 'Tối' },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setShiftFilter(s.key)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  shiftFilter === s.key
                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          1. CHẾ ĐỘ XEM THEO NGÀY (DAY VIEW / TIMELINE)
      ══════════════════════════════════════════════════════════════ */}
      {viewMode === 'day' && (
        <div className="space-y-4 animate-fade-in">
          {/* Day Navigator Bar */}
          <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={handlePrevDay}
                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition cursor-pointer"
                  title="Ngày trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextDay}
                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition cursor-pointer"
                  title="Ngày sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {formatVietnameseDate(currentSelectedYMD)}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {currentSelectedYMD === todayStr ? '☀️ Hôm nay' : `Ngày: ${currentSelectedYMD}`}
                </p>
              </div>
            </div>

            {/* Quick date jump & Today button */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={currentSelectedYMD}
                onChange={(e) => {
                  if (e.target.value) setCurrentDate(parseYMD(e.target.value))
                }}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              <button
                onClick={handleGoToday}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Hôm nay
              </button>
            </div>
          </div>

          {/* Day Timeline by Shifts */}
          <div className="space-y-4">
            {selectedDayEvents.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <CalendarCheck2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-800">
                  Không có lịch học nào vào ngày {formatVietnameseDate(currentSelectedYMD)}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Phòng Lab đang rảnh trong ngày này. Giáo viên có thể đăng ký mượn phòng hoặc xếp lịch thực hành mới.
                </p>
                {isAdmin && (
                  <button
                    onClick={() => setScheduleModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Tạo lịch cho ngày này
                  </button>
                )}
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-4">
                {/* ── CA SÁNG ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-200/60 px-4 py-2.5 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      🌅 Ca Sáng (07:00 - 11:30)
                    </span>
                    <span className="text-[11px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                      {selectedDayMorning.length} tiết
                    </span>
                  </div>

                  <div className="p-3 space-y-3 flex-1">
                    {selectedDayMorning.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-6">Không có lịch học buổi sáng</p>
                    ) : (
                      selectedDayMorning.map((ev) => (
                        <ScheduleCard
                          key={ev.id}
                          event={ev}
                          isAdmin={isAdmin}
                          onDelete={() => deleteSchedule(ev.id)}
                          onSelect={() => setSelectedEventModal(ev)}
                          onBookmark={() => toggleBookmark(ev.id)}
                          onCopy={() => copyShareText(ev)}
                          copyFeedback={copyFeedbackId === ev.id}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* ── CA CHIỀU ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 border-b border-sky-200/60 px-4 py-2.5 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                      ☀️ Ca Chiều (13:00 - 17:30)
                    </span>
                    <span className="text-[11px] font-bold bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded-full">
                      {selectedDayAfternoon.length} tiết
                    </span>
                  </div>

                  <div className="p-3 space-y-3 flex-1">
                    {selectedDayAfternoon.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-6">Không có lịch học buổi chiều</p>
                    ) : (
                      selectedDayAfternoon.map((ev) => (
                        <ScheduleCard
                          key={ev.id}
                          event={ev}
                          isAdmin={isAdmin}
                          onDelete={() => deleteSchedule(ev.id)}
                          onSelect={() => setSelectedEventModal(ev)}
                          onBookmark={() => toggleBookmark(ev.id)}
                          onCopy={() => copyShareText(ev)}
                          copyFeedback={copyFeedbackId === ev.id}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* ── CA TỐI / TẬP HUẤN ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-b border-purple-200/60 px-4 py-2.5 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                      🌙 Ca Tối / CLB (18:00 - 21:00)
                    </span>
                    <span className="text-[11px] font-bold bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full">
                      {selectedDayEvening.length} tiết
                    </span>
                  </div>

                  <div className="p-3 space-y-3 flex-1">
                    {selectedDayEvening.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-6">Không có lịch học buổi tối</p>
                    ) : (
                      selectedDayEvening.map((ev) => (
                        <ScheduleCard
                          key={ev.id}
                          event={ev}
                          isAdmin={isAdmin}
                          onDelete={() => deleteSchedule(ev.id)}
                          onSelect={() => setSelectedEventModal(ev)}
                          onBookmark={() => toggleBookmark(ev.id)}
                          onCopy={() => copyShareText(ev)}
                          copyFeedback={copyFeedbackId === ev.id}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          2. CHẾ ĐỘ XEM THEO TUẦN (WEEK VIEW / TIMETABLE MATRIX)
      ══════════════════════════════════════════════════════════════ */}
      {viewMode === 'week' && (
        <div className="space-y-4 animate-fade-in" ref={printRef}>
          {/* Week Navigator Bar */}
          <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 print:border-none print:shadow-none print:p-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl print:hidden">
                <button
                  onClick={handlePrevWeek}
                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition cursor-pointer"
                  title="Tuần trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextWeek}
                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition cursor-pointer"
                  title="Tuần sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Thời khóa biểu Tuần: {weekStart.getDate()}/{weekStart.getMonth() + 1} &rarr; {weekEnd.getDate()}/{weekEnd.getMonth() + 1}/{weekEnd.getFullYear()}
                </h3>
                <p className="text-xs text-slate-500 font-medium print:hidden">
                  Tuần có tổng cộng <strong>{weekCount}</strong> hoạt động được xếp lịch.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handleGoToday}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Tuần này
              </button>
            </div>
          </div>

          {/* 7-Day Week Columns Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const dayYMD = formatYMD(day.getFullYear(), day.getMonth(), day.getDate())
              const isToday = dayYMD === todayStr
              const dayEvents = schedulesByDate[dayYMD] || []
              const dayName = VI_DAYS[day.getDay()]
              const dayNameShort = VI_DAYS_SHORT[day.getDay()]

              return (
                <div
                  key={dayYMD}
                  className={`rounded-2xl border transition-all flex flex-col overflow-hidden ${
                    isToday
                      ? 'bg-sky-50/40 border-sky-400 shadow-md ring-2 ring-sky-400/20'
                      : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {/* Column Header */}
                  <div
                    className={`px-3 py-2.5 border-b text-center cursor-pointer transition ${
                      isToday
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-600'
                        : 'bg-slate-50/80 text-slate-800 border-slate-100 hover:bg-slate-100'
                    }`}
                    onClick={() => {
                      setCurrentDate(day)
                      setViewMode('day')
                    }}
                    title="Bấm để xem chi tiết ngày này"
                  >
                    <div className="flex items-center justify-between md:flex-col md:gap-0.5">
                      <span className="text-xs font-black uppercase tracking-wider">
                        {dayNameShort} <span className="hidden md:inline">({dayName})</span>
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          isToday ? 'text-amber-200' : 'text-slate-900'
                        }`}
                      >
                        {day.getDate()}/{day.getMonth() + 1}
                      </span>
                      {dayEvents.length > 0 && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                            isToday ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {dayEvents.length} lịch
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Column Event Cards */}
                  <div className="p-2 space-y-2 flex-1 min-h-[140px] md:min-h-[220px]">
                    {dayEvents.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center p-3 text-slate-300 text-[11px] font-medium">
                        Trống
                      </div>
                    ) : (
                      dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEventModal(ev)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] relative group ${ev.topic.bgSoft} ${ev.topic.cardBorder} shadow-2xs`}
                        >
                          {/* Time & Topic Badge */}
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5 text-slate-500" />
                              {ev.time_range || 'Cả ngày'}
                            </span>
                            {ev.status === 'ongoing' && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            )}
                          </div>

                          <h5 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight">
                            {ev.title}
                          </h5>

                          <div className="text-[10px] text-slate-600 mt-1 flex items-center gap-1 truncate">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{ev.instructor || 'GV Phụ trách'}</span>
                          </div>

                          <div className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                            <Users className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{ev.target_audience || 'Toàn trường'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          3. CHẾ ĐỘ XEM THEO THÁNG (MONTH CALENDAR GRID)
      ══════════════════════════════════════════════════════════════ */}
      {viewMode === 'month' && (
        <div className="space-y-4 animate-fade-in">
          {/* Month Navigator Toolbar */}
          <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition cursor-pointer"
                  title="Tháng trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition cursor-pointer"
                  title="Tháng sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Tháng {currentDate.getMonth() + 1} / {currentDate.getFullYear()}
              </h3>
            </div>

            {/* Legend & Quick Today */}
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Robotics
                </span>
                <span className="flex items-center gap-1 text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> AI/Code
                </span>
                <span className="flex items-center gap-1 text-purple-700">
                  <span className="w-2 h-2 rounded-full bg-purple-600" /> KHKT
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Thí nghiệm
                </span>
              </div>

              <button
                onClick={handleGoToday}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Hôm nay
              </button>
            </div>
          </div>

          {/* Monthly Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-bold text-slate-600 uppercase tracking-wider py-2.5">
              <span>Thứ 2</span>
              <span>Thứ 3</span>
              <span>Thứ 4</span>
              <span>Thứ 5</span>
              <span>Thứ 6</span>
              <span className="text-sky-600">Thứ 7</span>
              <span className="text-rose-600">Chủ Nhật</span>
            </div>

            {/* Grid Cells */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
              {calendarDays.map((d, idx) => {
                const isSelected = currentSelectedYMD === d.dateStr
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentDate(parseYMD(d.dateStr))
                    }}
                    className={`min-h-[75px] sm:min-h-[95px] p-2 flex flex-col justify-between transition-all cursor-pointer select-none group relative ${
                      !d.isCurrentMonth
                        ? 'bg-slate-50/40 text-slate-300'
                        : d.hasSchedule
                        ? 'bg-sky-50/30 hover:bg-sky-50/70'
                        : 'bg-white hover:bg-slate-50/80 text-slate-700'
                    } ${isSelected ? 'ring-2 ring-sky-500 bg-sky-50/80 z-10' : ''}`}
                  >
                    {/* Day number & Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black rounded-lg w-6 h-6 flex items-center justify-center ${
                          d.isToday
                            ? 'bg-sky-600 text-white shadow-xs'
                            : d.hasSchedule
                            ? 'text-sky-900 bg-sky-100 font-black'
                            : d.isCurrentMonth
                            ? 'text-slate-800'
                            : 'text-slate-300'
                        }`}
                      >
                        {d.dayNumber}
                      </span>

                      {d.hasSchedule && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded-full">
                          {d.events.length}
                        </span>
                      )}
                    </div>

                    {/* Events mini preview snippet */}
                    <div className="space-y-1 my-1 overflow-hidden">
                      {d.events.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEventModal(ev)
                          }}
                          className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded truncate border ${ev.topic.badgeClass}`}
                          title={`${ev.time_range ? `[${ev.time_range}] ` : ''}${ev.title}`}
                        >
                          {ev.time_range ? `${ev.time_range} ` : ''}{ev.title}
                        </div>
                      ))}
                      {d.events.length > 2 && (
                        <div className="text-[9px] font-bold text-sky-600 pl-1">
                          +{d.events.length - 2} sự kiện khác
                        </div>
                      )}
                    </div>

                    <div className="text-[9px] text-slate-400 group-hover:text-sky-600 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      Chi tiết &rarr;
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Date Details Panel underneath month grid */}
          {selectedDayEvents.length > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sky-50 text-sky-600 border border-sky-100 rounded-xl">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                      Lịch học ngày: <span className="text-sky-700">{formatVietnameseDate(currentSelectedYMD)}</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Có {selectedDayEvents.length} hoạt động trong ngày này.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewMode('day')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100 transition flex items-center gap-1 cursor-pointer"
                >
                  Mở chế độ Ngày <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedDayEvents.map((ev) => (
                  <ScheduleCard
                    key={ev.id}
                    event={ev}
                    isAdmin={isAdmin}
                    onDelete={() => deleteSchedule(ev.id)}
                    onSelect={() => setSelectedEventModal(ev)}
                    onBookmark={() => toggleBookmark(ev.id)}
                    onCopy={() => copyShareText(ev)}
                    copyFeedback={copyFeedbackId === ev.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          4. CHẾ ĐỘ XEM DANH SÁCH (LIST / AGENDA VIEW)
      ══════════════════════════════════════════════════════════════ */}
      {viewMode === 'list' && (
        <div className="grid lg:grid-cols-3 gap-5 animate-fade-in">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-3">
            {filteredList.length === 0 ? (
              <div className="text-center py-14 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400 font-medium text-sm space-y-2">
                <CalendarCheck2 className="w-8 h-8 mx-auto text-slate-300" />
                <p>Không tìm thấy lịch hoạt động nào phù hợp với bộ lọc.</p>
                <button
                  onClick={() => {
                    setTimeFilter('all')
                    setTopicFilter('all')
                    setShiftFilter('all')
                    setSearch('')
                  }}
                  className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  Xóa bộ lọc để xem toàn bộ lịch
                </button>
              </div>
            ) : (
              filteredList.map((sc) => (
                <div
                  key={sc.id}
                  className={`bg-white border p-4 sm:p-5 rounded-2xl shadow-xs hover:shadow-md transition-all space-y-3 relative group ${sc.topic.cardBorder}`}
                >
                  {/* Top Bar: Date, Time & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-sky-50 text-sky-800 border border-sky-200 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                        📅 {formatVietnameseDate(sc.date)}
                      </span>
                      {sc.time_range && (
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-slate-500" /> {sc.time_range}
                        </span>
                      )}
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${sc.topic.badgeClass}`}>
                        {sc.topic.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={sc.status} />
                      <button
                        onClick={() => toggleBookmark(sc.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          sc.isBookmarked
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
                        }`}
                        title={sc.isBookmarked ? 'Bỏ lưu' : 'Lưu vào lịch của tôi'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h4
                    onClick={() => setSelectedEventModal(sc)}
                    className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug hover:text-sky-600 transition cursor-pointer"
                  >
                    {sc.title}
                  </h4>

                  {/* Details row */}
                  <div className="grid sm:grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-sky-600 shrink-0" />
                      Phụ trách: <span className="font-bold text-slate-800">{sc.instructor || 'Chưa phân công'}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-600 shrink-0" />
                      Đối tượng: <span className="font-bold text-slate-800">{sc.target_audience || 'Toàn trường'}</span>
                    </p>
                  </div>

                  {/* Description snippet */}
                  {sc.description && (
                    <p className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl leading-relaxed border border-slate-100 line-clamp-2">
                      {sc.description}
                    </p>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyShareText(sc)}
                        className="text-xs font-bold text-slate-500 hover:text-sky-600 flex items-center gap-1 transition cursor-pointer"
                      >
                        {copyFeedbackId === sc.id ? (
                          <span className="text-emerald-600 flex items-center gap-1 font-black">
                            <Check className="w-3.5 h-3.5" /> Đã sao chép!
                          </span>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" /> Chia sẻ
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => exportToICS([sc], `${sc.title}.ics`)}
                        className="text-xs font-bold text-slate-500 hover:text-sky-600 flex items-center gap-1 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Thêm vào Cal
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedEventModal(sc)}
                        className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                      >
                        Xem chi tiết &rarr;
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => deleteSchedule(sc.id)}
                          className="text-rose-500 text-xs font-bold flex items-center gap-1 hover:text-rose-700 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar: Rules & Quick Guide */}
          <div className="space-y-4">
            {/* Lab Rules Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 sticky top-24">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <ShieldAlert className="text-amber-500 w-4 h-4" />
                Nội quy Phòng Thực Hành STEM
              </h3>
              <ol className="text-xs text-slate-600 space-y-2.5 list-decimal pl-4 leading-relaxed font-medium">
                <li>Chỉ vào phòng khi có giáo viên phụ trách hoặc người giám sát.</li>
                <li>Đăng ký và bàn giao thiết bị đầy đủ trước và sau giờ học.</li>
                <li>Tuân thủ tuyệt đối an toàn điện, hóa chất và máy in 3D / laser.</li>
                <li>Không mang đồ ăn, nước ngọt vào khu vực máy tính và linh kiện.</li>
                <li>Dọn vệ sinh, tắt toàn bộ nguồn điện thiết bị trước khi rời phòng.</li>
              </ol>

              {/* Bookmark hint */}
              <div className="mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1 text-amber-800">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Mẹo lưu lịch học
                </div>
                <p className="text-[11px] text-amber-700">
                  Nhấn icon ngôi sao ⭐ trên từng tiết học để lưu lại danh sách lịch học bạn quan tâm và lọc nhanh bất cứ lúc nào!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EVENT DETAIL MODAL POPUP
      ══════════════════════════════════════════════════════════════ */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scale-in">
            {/* Modal Header */}
            <div className={`p-5 text-white bg-gradient-to-r ${selectedEventModal.topic?.gradientHeader || 'from-sky-600 to-blue-600'} flex items-start justify-between gap-3`}>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white">
                  {selectedEventModal.topic?.label || 'Hoạt động STEM'}
                </span>
                <h3 className="font-black text-lg sm:text-xl leading-snug">
                  {selectedEventModal.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedEventModal(null)}
                className="text-white/80 hover:text-white p-1 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Ngày diễn ra</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    📅 {formatVietnameseDate(selectedEventModal.date)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Khung giờ</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    ⏰ {selectedEventModal.time_range || 'Cả ngày'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Giáo viên phụ trách</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    👨‍🏫 {selectedEventModal.instructor || 'Chưa phân công'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Đối tượng tham gia</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    👥 {selectedEventModal.target_audience || 'Toàn trường'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Nội dung chi tiết</span>
                <p className="text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 leading-relaxed">
                  {selectedEventModal.description || 'Không có mô tả chi tiết cho hoạt động này.'}
                </p>
              </div>

              {/* Action Buttons inside modal */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyShareText(selectedEventModal)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copyFeedbackId === selectedEventModal.id ? 'Đã sao chép!' : 'Sao chép'}
                  </button>

                  <button
                    onClick={() => exportToICS([selectedEventModal], `${selectedEventModal.title}.ics`)}
                    className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Lưu lịch (.ics)
                  </button>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      deleteSchedule(selectedEventModal.id)
                      setSelectedEventModal(null)
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa lịch
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

// ── REUSABLE SCHEDULE CARD COMPONENT ──
interface ScheduleCardProps {
  event: Schedule & {
    topic: TopicInfo
    shift: string
    status: 'ongoing' | 'today' | 'upcoming' | 'past'
    isBookmarked: boolean
  }
  isAdmin: boolean
  onDelete: () => void
  onSelect: () => void
  onBookmark: () => void
  onCopy: () => void
  copyFeedback: boolean
}

function ScheduleCard({
  event,
  isAdmin,
  onDelete,
  onSelect,
  onBookmark,
  onCopy,
  copyFeedback,
}: ScheduleCardProps) {
  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all hover:shadow-md space-y-2 relative group ${event.topic.bgSoft} ${event.topic.cardBorder}`}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-extrabold text-slate-800 bg-white/95 px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {event.time_range || 'Cả ngày'}
          </span>
          <StatusBadge status={event.status} />
        </div>

        <button
          onClick={onBookmark}
          className={`p-1 rounded-lg transition cursor-pointer ${
            event.isBookmarked ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
          }`}
          title={event.isBookmarked ? 'Bỏ lưu' : 'Lưu lịch'}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      <h5
        onClick={onSelect}
        className="font-bold text-xs sm:text-sm text-slate-900 leading-snug cursor-pointer hover:text-sky-600 transition"
      >
        {event.title}
      </h5>

      <div className="text-[11px] text-slate-600 space-y-0.5">
        <p className="flex items-center gap-1 truncate">
          <User className="w-3 h-3 text-slate-400 shrink-0" />
          Phụ trách: <strong className="text-slate-800 font-semibold">{event.instructor || 'Chưa rõ'}</strong>
        </p>
        <p className="flex items-center gap-1 truncate">
          <Users className="w-3 h-3 text-slate-400 shrink-0" />
          Đối tượng: <strong className="text-slate-800 font-semibold">{event.target_audience || 'Toàn trường'}</strong>
        </p>
      </div>

      {event.description && (
        <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-100/80 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      )}

      {/* Card footer */}
      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            className="text-[11px] font-bold text-slate-500 hover:text-sky-600 flex items-center gap-1 transition cursor-pointer"
          >
            {copyFeedback ? (
              <span className="text-emerald-600 flex items-center gap-0.5 font-bold">
                <Check className="w-3 h-3" /> Đã chép
              </span>
            ) : (
              <>
                <Share2 className="w-3 h-3" /> Chia sẻ
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSelect}
            className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
          >
            Chi tiết &rarr;
          </button>

          {isAdmin && (
            <button
              onClick={onDelete}
              className="text-rose-500 hover:text-rose-700 text-[11px] font-bold transition cursor-pointer"
              title="Xóa lịch"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
