'use client'

import { NotebookPen, Calendar, Users2, Trash2, BookOpen, ClipboardList, Wrench, Star, FileText } from 'lucide-react'
import type { JournalEntry } from '@/lib/types'

interface JournalTabProps {
  journal: JournalEntry[]
  filteredJournal: JournalEntry[]
  jnThisMonth: number
  jnParticipants: number
  jnFilter: string
  setJnFilter: (val: string) => void
  isAdmin: boolean
  setJournalModalOpen: (val: boolean) => void
  deleteJournal: (id: string) => void
}

const JOURNAL_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  'Buổi học': { icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  'Kiểm kê': { icon: <ClipboardList className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  'Bảo trì': { icon: <Wrench className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  'Sự kiện': { icon: <Star className="w-5 h-5" />, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  'Khác': { icon: <FileText className="w-5 h-5" />, color: 'text-slate-600 bg-slate-50 border-slate-200' },
}

export function JournalTab({
  journal,
  filteredJournal,
  jnThisMonth,
  jnParticipants,
  jnFilter,
  setJnFilter,
  isAdmin,
  setJournalModalOpen,
  deleteJournal,
}: JournalTabProps) {
  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <NotebookPen className="w-7 h-7 text-stemBlue-600" />
            Nhật Ký Hoạt Động Phòng Lab
          </h2>
          <p className="text-sm text-slate-500 mt-1">Lịch sử ghi lại hoạt động kiểm kê, thiết bị, buổi học thực nghiệm phòng Lab.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setJournalModalOpen(true)}
            className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
          >
            Ghi Nhật Ký Mới
          </button>
        )}
      </div>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4 text-center backdrop-blur-sm">
          <p className="text-2xl font-black text-blue-700">{journal.length}</p>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">Tổng bản ghi</p>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 text-center backdrop-blur-sm">
          <p className="text-2xl font-black text-emerald-700">{jnThisMonth}</p>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Tháng này</p>
        </div>
        <div className="bg-purple-50/50 border border-purple-100/80 rounded-2xl p-4 text-center backdrop-blur-sm">
          <p className="text-2xl font-black text-purple-700">{jnParticipants}</p>
          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mt-1">Lượt tham gia</p>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Buổi học', 'Kiểm kê', 'Bảo trì', 'Sự kiện', 'Khác'].map((f) => (
          <button
            key={f}
            onClick={() => setJnFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              jnFilter === f
                ? 'bg-stemBlue-600 text-white shadow-md border border-transparent'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'Tất cả' : f}
          </button>
        ))}
      </div>

      {/* Logs timeline list */}
      <div className="space-y-4">
        {filteredJournal.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">Chưa có hoạt động nào được ghi lại.</div>
        ) : (
          filteredJournal.map((entry) => {
            const ts = JOURNAL_ICONS[entry.type] || JOURNAL_ICONS['Khác']
            return (
              <div
                key={entry.id}
                className="bg-white/80 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition backdrop-blur-sm overflow-hidden"
              >
                <div className="flex items-start gap-4 p-5">
                  <div className={`p-2.5 rounded-xl border ${ts.color} shrink-0 mt-0.5`}>{ts.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {entry.type}
                          </span>
                          {entry.status === 'Hoàn thành' ? (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-[9px] font-bold">
                              ✓ Hoàn thành
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[9px] font-bold">
                              ⏳ Đang diễn ra
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                          {entry.title}
                        </h4>
                      </div>
                      {isAdmin && (
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
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {entry.date} &nbsp;·&nbsp; {entry.time_of_day}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                        <Users2 className="w-3.5 h-3.5" />
                        {entry.author}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                        <Users2 className="w-3.5 h-3.5" />
                        {entry.participants} người tham gia
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
