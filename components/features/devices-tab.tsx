'use client'

import { Search, PlusCircle, MapPin, Lock, Edit, Trash, ArrowLeftRight, Cpu } from 'lucide-react'
import { StatusBadge } from '@/components/ui/badges'
import type { Device, Tab } from '@/lib/types'

interface DevicesTabProps {
  filteredDevices: Device[]
  deviceSearch: string
  setDeviceSearch: (val: string) => void
  deviceCat: string
  setDeviceCat: (val: string) => void
  loading: boolean
  isAdmin: boolean
  authUser: any
  setAuthOpen: (val: boolean) => void
  setAuthMode: (val: 'login' | 'register') => void
  setDeviceModalOpen: (val: boolean) => void
  setEditDevice: (d: Device | null) => void
  deleteDevice: (id: string) => void
  switchTab: (t: Tab) => void
}

export function DevicesTab({
  filteredDevices,
  deviceSearch,
  setDeviceSearch,
  deviceCat,
  setDeviceCat,
  loading,
  isAdmin,
  authUser,
  setAuthOpen,
  setAuthMode,
  setDeviceModalOpen,
  setEditDevice,
  deleteDevice,
  switchTab,
}: DevicesTabProps) {
  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kho Thiết Bị & Linh Kiện STEM</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Tra cứu số lượng và đăng ký mượn thiết bị phòng Lab.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditDevice(null)
              setDeviceModalOpen(true)
            }}
            className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-stemBlue-500/10 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Thêm Linh Kiện
          </button>
        )}
      </div>

      <div className="bg-white/80 p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 backdrop-blur-sm">
        <div className="relative w-full md:flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tên thiết bị, mã dụng cụ..."
            value={deviceSearch}
            onChange={(e) => setDeviceSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition"
          />
        </div>
        <select
          value={deviceCat}
          onChange={(e) => setDeviceCat(e.target.value)}
          className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition cursor-pointer"
        >
          <option value="all">Tất cả danh mục</option>
          <option value="Robotics">Khung gầm & Cơ khí</option>
          <option value="Vi điều khiển">Mạch & Cảm biến</option>
          <option value="In 3D">Thiết bị In 3D</option>
          <option value="Đo lường">Dụng cụ Đo lường</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map((dev) => (
            <div
              key={dev.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-lg hover:border-stemBlue-200 transition-all relative flex flex-col group"
            >
              <div className="relative border-b border-slate-100/80 bg-slate-50/20 overflow-hidden">
                {dev.image_url ? (
                  <img
                    src={dev.image_url}
                    alt={dev.name}
                    className="w-full h-40 object-cover bg-white p-2 group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-40 bg-slate-100/50 flex items-center justify-center text-slate-300">
                    <Cpu className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3 shadow-sm">
                  <StatusBadge status={dev.status} />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">
                    {dev.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-stemBlue-600 transition-colors line-clamp-2 min-h-[40px]">
                      {dev.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-1 font-semibold">Mã: {dev.code}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Trong kho</p>
                      <p className="text-base font-black text-slate-800 mt-0.5">{dev.total}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-stemBlue-600 font-bold uppercase tracking-wider">Khả dụng</p>
                      <p className="text-base font-black text-stemBlue-600 mt-0.5">{dev.available}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {dev.description || 'Chưa cập nhật vị trí'}
                  </p>
                </div>

                {/* Actions */}
                {!authUser ? (
                  <button
                    onClick={() => {
                      setAuthMode('login')
                      setAuthOpen(true)
                    }}
                    className="w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs py-2.5 rounded-lg transition-all border border-slate-200 border-dashed flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Đăng nhập để mượn
                  </button>
                ) : isAdmin ? (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditDevice(dev)
                        setDeviceModalOpen(true)
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition"
                    >
                      <Edit className="w-3.5 h-3.5" /> Sửa
                    </button>
                    <button
                      onClick={() => deleteDevice(dev.id)}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition"
                    >
                      <Trash className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => switchTab('muon-tra')}
                    className="w-full mt-4 bg-stemBlue-600 hover:bg-stemBlue-700 text-white shadow-md font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" /> Đăng ký mượn ngay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
