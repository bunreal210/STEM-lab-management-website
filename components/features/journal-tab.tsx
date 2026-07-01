'use client'

import { useState, useMemo } from 'react'
import { NotebookPen, Calendar, Users2, Trash2, Search, Star, Building2, GraduationCap, UserCheck, ArrowUpDown, BookOpen } from 'lucide-react'
import type { JournalEntry, UserProfile } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

type JournalRole = 'hoc-sinh' | 'giao-vien' | 'quan-tri'

interface JournalTabProps {
  journal: JournalEntry[]
  isAdmin: boolean
  profile: UserProfile | null
  authUser: User | null
  setJournalModalOpen: (val: boolean) => void
  deleteJournal: (id: string) => void
  activeJournalTab: JournalRole
  setActiveJournalTab: (tab: JournalRole) => void
}

const SUB_TABS: { key: JournalRole; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'hoc-sinh', label: 'Nhật ký học sinh', icon: <GraduationCap className="w-4 h-4" />, desc: 'Ghi chép cá nhân sau buổi thực hành' },
  { key: 'giao-vien', label: 'Đánh giá giáo viên', icon: <UserCheck className="w-4 h-4" />, desc: 'Nhận xét và đánh giá buổi học' },
  { key: 'quan-tri', label: 'Tình trạng phòng', icon: <Building2 className="w-4 h-4" />, desc: 'Ghi nhận tình trạng thiết bị & phòng' },
]

const ROOM_BADGE: Record<string, string> = {
  'Tốt': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Bình thường': 'bg-amber-100 text-amber-700 border-amber-200',
  'Cần sửa chữa': 'bg-rose-100 text-rose-700 border-rose-200',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
      ))}
    </div>
  )
}

export function JournalTab({
  journal,
  isAdmin,
  profile,
  authUser,
  setJournalModalOpen,
  deleteJournal,
  activeJournalTab,
  setActiveJournalTab,
}: JournalTabProps) {
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortAsc, setSortAsc] = useState(false)

  // Filter by role sub-tab
  const roleFiltered = useMemo(() =>
    journal.filter(e => (e.journal_role || 'quan-tri') === activeJournalTab),
    [journal, activeJournalTab]
  )

  // Apply search + date filters
  const filtered = useMemo(() => {
    let result = roleFiltered

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.content || '').toLowerCase().includes(q) ||
        (e.author || '').toLowerCase().includes(q)
      )
    }

    if (dateFrom) result = result.filter(e => e.date >= dateFrom)
    if (dateTo) result = result.filter(e => e.date <= dateTo)

    result.sort((a, b) => sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date))
    return result
  }, [roleFiltered, search, dateFrom, dateTo, sortAsc])

  // Stats for mini dashboard
  const thisMonth = new Date().toISOString().slice(0, 7)
  const totalThisMonth = roleFiltered.filter(e => e.date.startsWith(thisMonth)).length
  const totalParticipants = roleFiltered.reduce((s, e) => s + (e.participants || 0), 0)

  // Permission check for "Ghi nhật ký" button
  const canWrite = (() => {
    if (!authUser || !profile) return false
    if (activeJournalTab === 'hoc-sinh') return true // all authenticated users
    if (activeJournalTab === 'giao-vien') return profile.role === 'teacher' || profile.role === 'admin'
    if (activeJournalTab === 'quan-tri') return profile.role === 'admin'
    return false
  })()

  const canDelete = (entry: JournalEntry) =>
    isAdmin || (authUser && entry.author_id === authUser.id)

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <NotebookPen className="w-7 h-7 text-stemBlue-600" />
            Nhật Ký Hoạt Động Phòng Lab
          </h2>
          <p className="text-sm text-slate-500 mt-1">Ghi chép, đánh giá và theo dõi tình trạng phòng Lab theo từng buổi học.</p>
        </div>
        {canWrite && (
          <button
            onClick={() => setJournalModalOpen(true)}
            className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
          >
            <NotebookPen className="w-4 h-4" />
            {activeJournalTab === 'hoc-sinh' ? 'Ghi nhật ký' : activeJournalTab === 'giao-vien' ? 'Viết đánh giá' : 'Ghi tình trạng'}
          </button>
        )}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUB_TABS.map(st => (
          <button
            key={st.key}
            onClick={() => setActiveJournalTab(st.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
              activeJournalTab === st.key
                ? 'bg-stemBlue-600 text-white border-stemBlue-600 shadow-md'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st.icon} {st.label}
          </button>
        ))}
      </div>

      {/* Active sub-tab description */}
      <p className="text-xs text-slate-400 font-medium -mt-2">
        {SUB_TABS.find(t => t.key === activeJournalTab)?.desc}
      </p>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4 text-center backdrop-blur-sm">
          <p className="text-2xl font-black text-blue-700">{roleFiltered.length}</p>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Tổng bản ghi</p>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 text-center backdrop-blur-sm">
          <p className="text-2xl font-black text-emerald-700">{totalThisMonth}</p>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Tháng này</p>
        </div>
        <div className="bg-purple-50/50 border border-purple-100/80 rounded-2xl p-4 text-center backdrop-blur-sm">
          <p className="text-2xl font-black text-purple-700">{totalParticipants}</p>
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mt-1">Lượt tham gia</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white/80 border border-slate-200 rounded-2xl p-4 backdrop-blur-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, nội dung, tác giả..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
            />
          </div>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition shrink-0"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortAsc ? 'Cũ nhất' : 'Mới nhất'}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-500">Từ ngày:</span>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
          />
          <span className="text-xs font-bold text-slate-500">Đến ngày:</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
          />
          {(search || dateFrom || dateTo) && (
            <button
              onClick={() => { setSearch(''); setDateFrom(''); setDateTo('') }}
              className="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition"
            >
              ✕ Xóa bộ lọc
            </button>
          )}
          <span className="ml-auto text-[11px] text-slate-400 font-medium">
            Hiển thị {filtered.length} / {roleFiltered.length} bản ghi
          </span>
        </div>
      </div>

      {/* Entries list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-medium">
            <NotebookPen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p>Chưa có nhật ký nào trong mục này.</p>
          </div>
        ) : (
          filtered.map(entry => (
            <div
              key={entry.id}
              className="bg-white/80 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition backdrop-blur-sm overflow-hidden"
            >
              <div className="flex items-start gap-4 p-5">
                {/* Icon based on tab */}
                <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                  activeJournalTab === 'hoc-sinh' ? 'text-blue-600 bg-blue-50 border-blue-200'
                  : activeJournalTab === 'giao-vien' ? 'text-purple-600 bg-purple-50 border-purple-200'
                  : 'text-teal-600 bg-teal-50 border-teal-200'
                }`}>
                  {activeJournalTab === 'hoc-sinh' ? <BookOpen className="w-5 h-5" />
                   : activeJournalTab === 'giao-vien' ? <UserCheck className="w-5 h-5" />
                   : <Building2 className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {/* Subject badge (student & teacher) */}
                        {entry.subject && (
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-lg text-[9px] font-bold border border-indigo-200">
                            {entry.subject}
                          </span>
                        )}
                        {/* Target class (teacher) */}
                        {activeJournalTab === 'giao-vien' && entry.target_class && (
                          <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-lg text-[9px] font-bold border border-sky-200">
                            Lớp {entry.target_class}
                          </span>
                        )}
                        {/* Room condition (admin) */}
                        {activeJournalTab === 'quan-tri' && entry.room_condition && (
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${ROOM_BADGE[entry.room_condition] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {entry.room_condition}
                          </span>
                        )}
                        {/* Rating stars (teacher) */}
                        {activeJournalTab === 'giao-vien' && entry.rating && (
                          <StarRating rating={entry.rating} />
                        )}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                        {entry.title}
                      </h4>
                    </div>
                    {canDelete(entry) && (
                      <button
                        onClick={() => deleteJournal(entry.id)}
                        className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {entry.content}
                  </p>

                  {/* Equipment notes (admin) */}
                  {activeJournalTab === 'quan-tri' && entry.equipment_notes && (
                    <div className="mt-2 bg-amber-50/50 border border-amber-100 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Ghi chú thiết bị</p>
                      <p className="text-xs text-amber-800 leading-relaxed">{entry.equipment_notes}</p>
                    </div>
                  )}

                  {/* Footer info */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      {entry.date} {entry.time_of_day ? `· ${entry.time_of_day}` : ''}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                      <Users2 className="w-3.5 h-3.5" />
                      {entry.author || 'Ẩn danh'}
                    </span>
                    {entry.participants > 0 && (
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {entry.participants} người
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
