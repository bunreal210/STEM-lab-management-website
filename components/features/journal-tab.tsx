'use client'

import { useState, useMemo } from 'react'
import { NotebookPen, Calendar, Users2, Trash2, Search, Star, Building2, GraduationCap, UserCheck, ArrowUpDown, BookOpen, Plus } from 'lucide-react'
import type { JournalEntry, UserProfile } from '@/lib/types'
import type { User } from '@supabase/supabase-js'
import { format24hTime } from '@/lib/utils/export'

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

const SUB_TABS: { key: JournalRole; label: string; icon: any; desc: string }[] = [
  { key: 'hoc-sinh', label: 'Nhật ký học sinh', icon: GraduationCap, desc: 'Ghi chép và báo cáo kết quả sau giờ thực hành' },
  { key: 'giao-vien', label: 'Đánh giá giáo viên', icon: UserCheck, desc: 'Nhận xét, đánh giá chất lượng và xếp sao giờ học' },
  { key: 'quan-tri', label: 'Tình trạng phòng máy', icon: Building2, desc: 'Ghi nhận kiểm kê tình trạng thiết bị & phòng Lab' },
]

const ROOM_BADGE: Record<string, string> = {
  'Tốt': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Bình thường': 'bg-amber-50 text-amber-700 border-amber-200',
  'Cần sửa chữa': 'bg-rose-50 text-rose-700 border-rose-200',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
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

  // Stats
  const thisMonth = new Date().toISOString().slice(0, 7)
  const totalThisMonth = roleFiltered.filter(e => e.date.startsWith(thisMonth)).length
  const totalParticipants = roleFiltered.reduce((s, e) => s + (e.participants || 0), 0)

  // Permission check
  const canWrite = (() => {
    if (!authUser || !profile) return false
    if (activeJournalTab === 'hoc-sinh') return true
    if (activeJournalTab === 'giao-vien') return profile.role === 'teacher' || profile.role === 'admin'
    if (activeJournalTab === 'quan-tri') return profile.role === 'admin'
    return false
  })()

  const canDelete = (entry: JournalEntry) =>
    isAdmin || (authUser && entry.author_id === authUser.id)

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <NotebookPen className="w-6 h-6 text-sky-600" />
            Nhật Ký Phòng Thực Hành STEM
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Sổ nhật ký điện tử theo dõi từng giờ học, đánh giá giáo viên và kiểm kê thiết bị.</p>
        </div>
        {canWrite && (
          <button
            onClick={() => setJournalModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Ghi Nhật Ký
          </button>
        )}
      </div>

      {/* Sub-tabs Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SUB_TABS.map(st => {
          const Icon = st.icon
          const isActive = activeJournalTab === st.key
          return (
            <button
              key={st.key}
              onClick={() => setActiveJournalTab(st.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap border cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" /> {st.label}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-slate-500 -mt-3 italic">
        {SUB_TABS.find(t => t.key === activeJournalTab)?.desc}
      </p>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-black text-sky-800">{roleFiltered.length}</p>
          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">Tổng bản ghi</p>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-black text-emerald-800">{totalThisMonth}</p>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Tháng này</p>
        </div>
        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-black text-purple-800">{totalParticipants}</p>
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mt-0.5">Lượt tham gia</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, nội dung, người ghi..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
            />
          </div>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition shrink-0 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortAsc ? 'Cũ nhất trước' : 'Mới nhất trước'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500">Từ:</span>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
          <span className="font-bold text-slate-500">Đến:</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
          {(search || dateFrom || dateTo) && (
            <button
              onClick={() => { setSearch(''); setDateFrom(''); setDateTo('') }}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 transition ml-1 cursor-pointer"
            >
              ✕ Xóa lọc
            </button>
          )}
          <span className="ml-auto text-[11px] text-slate-400 font-medium">
            Hiển thị {filtered.length} / {roleFiltered.length} bản ghi
          </span>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/60 rounded-2xl border border-slate-200/80 text-slate-400 font-medium text-sm space-y-2">
            <NotebookPen className="w-8 h-8 mx-auto text-slate-300" />
            <p>Chưa có nhật ký nào trong mục này.</p>
          </div>
        ) : (
          filtered.map(entry => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-sky-300 transition-all p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                    activeJournalTab === 'hoc-sinh' ? 'text-blue-600 bg-blue-50 border-blue-100'
                    : activeJournalTab === 'giao-vien' ? 'text-purple-600 bg-purple-50 border-purple-100'
                    : 'text-teal-600 bg-teal-50 border-teal-100'
                  }`}>
                    {activeJournalTab === 'hoc-sinh' ? <BookOpen className="w-4 h-4" />
                     : activeJournalTab === 'giao-vien' ? <UserCheck className="w-4 h-4" />
                     : <Building2 className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {entry.subject && (
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-indigo-100">
                          {entry.subject}
                        </span>
                      )}
                      {activeJournalTab === 'giao-vien' && entry.target_class && (
                        <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md text-[10px] font-bold border border-sky-100">
                          Lớp {entry.target_class}
                        </span>
                      )}
                      {activeJournalTab === 'quan-tri' && entry.room_condition && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${ROOM_BADGE[entry.room_condition] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {entry.room_condition}
                        </span>
                      )}
                      {activeJournalTab === 'giao-vien' && entry.rating && (
                        <StarRating rating={entry.rating} />
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {entry.title}
                    </h4>
                  </div>
                </div>

                {canDelete(entry) && (
                  <button
                    onClick={() => deleteJournal(entry.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Xóa nhật ký"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                {entry.content}
              </p>

              {activeJournalTab === 'quan-tri' && entry.equipment_notes && (
                <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-xs text-amber-900">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-0.5">Ghi chú thiết bị:</p>
                  <p className="leading-relaxed">{entry.equipment_notes}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-400 font-medium border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {entry.date} {entry.time_of_day ? `· ${format24hTime(entry.time_of_day)}` : ''}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <Users2 className="w-3.5 h-3.5 text-slate-400" />
                  {entry.author || 'Thành viên Lab'}
                </span>
                {entry.participants > 0 && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {entry.participants} người tham gia
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
