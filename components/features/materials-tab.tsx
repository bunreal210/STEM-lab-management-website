'use client'

import { Upload, FileText, Video, Code, ArrowRight, Trash2, BookOpen, ExternalLink } from 'lucide-react'
import type { Material } from '@/lib/types'

interface MaterialsTabProps {
  filteredMaterials: Material[]
  matFilter: string
  setMatFilter: (val: string) => void
  isAdmin: boolean
  setMaterialModalOpen: (val: boolean) => void
  deleteMaterial: (id: string) => void
}

function MatIcon({ type }: { type: string }) {
  if (type === 'video') {
    return (
      <div className="w-10 h-10 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl flex items-center justify-center shrink-0">
        <Video className="w-5 h-5" />
      </div>
    )
  }
  if (type === 'pdf') {
    return (
      <div className="w-10 h-10 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5" />
      </div>
    )
  }
  return (
    <div className="w-10 h-10 bg-sky-50 text-sky-600 border border-sky-100 rounded-xl flex items-center justify-center shrink-0">
      <Code className="w-5 h-5" />
    </div>
  )
}

function MatBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    video: { label: 'Video bài giảng', cls: 'bg-rose-50 text-rose-700 border-rose-100' },
    pdf: { label: 'Tài liệu PDF', cls: 'bg-amber-50 text-amber-700 border-amber-100' },
    guide: { label: 'Source Code & Hướng dẫn', cls: 'bg-sky-50 text-sky-700 border-sky-100' },
  }
  const cur = map[type] || { label: 'Tài liệu', cls: 'bg-slate-50 text-slate-700 border-slate-200' }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${cur.cls}`}>
      {cur.label}
    </span>
  )
}

export function MaterialsTab({
  filteredMaterials,
  matFilter,
  setMatFilter,
  isAdmin,
  setMaterialModalOpen,
  deleteMaterial,
}: MaterialsTabProps) {
  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-600" />
            Thư Viện Kiến Thức &amp; Tài Liệu STEM
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Slide bài giảng, code mẫu điều khiển mạch và hướng dẫn kỹ thuật phòng Lab.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setMaterialModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Tải lên Tài liệu
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <div className="md:col-span-3">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 sticky top-24">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 mb-1">Danh mục tài liệu</h3>
            {[
              ['all', '📚 Tất cả tài liệu'],
              ['video', '🎥 Video bài giảng'],
              ['pdf', '📄 Giáo trình & PDF'],
              ['guide', '💻 Code & Hướng dẫn'],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setMatFilter(v)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  matFilter === v ? 'text-sky-700 bg-sky-50 font-extrabold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Right Cards Grid */}
        <div className="md:col-span-9">
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredMaterials.length === 0 ? (
              <div className="col-span-2 text-center py-16 bg-slate-50/60 rounded-2xl border border-slate-200/80 text-slate-400 font-medium text-sm">
                Không tìm thấy tài liệu nào trong danh mục này.
              </div>
            ) : (
              filteredMaterials.map((m) => (
                <div
                  key={m.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <MatIcon type={m.type} />
                      <MatBadge type={m.type} />
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">Tác giả: <span className="font-semibold text-slate-700">{m.author || 'STEM Lab'}</span></p>
                    </div>

                    {m.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {m.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={m.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 transition"
                    >
                      Mở tài liệu <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {isAdmin && (
                      <button
                        onClick={() => deleteMaterial(m.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 transition cursor-pointer"
                        title="Xóa tài liệu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
