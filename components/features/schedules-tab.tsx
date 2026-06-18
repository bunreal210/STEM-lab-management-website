'use client'

import { CalendarDays, ShieldAlert, Plus, Trash2 } from 'lucide-react'
import type { Schedule } from '@/lib/types'

interface SchedulesTabProps {
  schedules: Schedule[]
  isAdmin: boolean
  setScheduleModalOpen: (val: boolean) => void
  deleteSchedule: (id: string) => void
}

export function SchedulesTab({
  schedules,
  isAdmin,
  setScheduleModalOpen,
  deleteSchedule,
}: SchedulesTabProps) {
  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lịch Học & Hoạt Động CLB</h2>
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

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="text-stemBlue-600 w-5 h-5" />
            Sự kiện sắp tới
          </h3>
          <div className="space-y-4">
            {schedules.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-medium">Chưa có lịch hoạt động nào.</div>
            ) : (
              schedules.map((sc) => (
                <div
                  key={sc.id}
                  className="bg-white/70 border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-stemBlue-100 text-stemBlue-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                      {sc.date}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{sc.time_range}</span>
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
