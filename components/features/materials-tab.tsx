'use client'

import { Upload, FileText, Box, ArrowRight, Trash2 } from 'lucide-react'
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
      <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
        <Box className="w-5 h-5" />
      </div>
    )
  }
  if (type === 'pdf') {
    return (
      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5" />
      </div>
    )
  }
  return (
    <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shrink-0">
      <Box className="w-5 h-5" />
    </div>
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Thư Viện Kiến Thức Số</h2>
          <p className="text-sm text-slate-500 mt-1">Slide bài giảng, code mẫu điều khiển và hướng dẫn kỹ thuật phòng Lab.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setMaterialModalOpen(true)}
            className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Tải lên Tài liệu
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <div className="bg-white/80 p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 backdrop-blur-sm sticky top-24">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Phân loại tài liệu</h3>
            {[
              ['all', 'Tất cả tài liệu'],
              ['video', 'Video bài giảng'],
              ['pdf', 'Sách & Giáo trình PDF'],
              ['guide', 'Source Code & Hướng dẫn'],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setMatFilter(v)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition ${
                  matFilter === v ? 'text-stemBlue-700 bg-stemBlue-50' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-9">
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredMaterials.length === 0 ? (
              <div className="col-span-2 text-center py-20 text-slate-400 font-medium">Không tìm thấy tài liệu nào.</div>
            ) : (
              filteredMaterials.map((m) => (
                <div
                  key={m.id}
                  className="bg-white/70 p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition backdrop-blur-sm flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <MatIcon type={m.type} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
                        {m.title}
                      </h4>
                      <p className="text-xs text-stemBlue-600 font-bold mt-1.5">{m.author}</p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">{m.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                    <a
                      href={m.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      Xem tài liệu <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    {isAdmin && (
                      <button
                        onClick={() => deleteMaterial(m.id)}
                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
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
