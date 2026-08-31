'use client'

import { Search, PlusCircle, MapPin, Lock, Edit, Trash, ArrowLeftRight, Cpu, PackageCheck, FolderCog } from 'lucide-react'
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
  categories: string[]
  setCategoryManagerOpen: (val: boolean) => void
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
  categories,
  setCategoryManagerOpen,
}: DevicesTabProps) {
  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-sky-600" />
            Kho Thiết Bị & Linh Kiện STEM
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Tra cứu số lượng trong kho và đăng ký mượn thiết bị phòng Lab.</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setCategoryManagerOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              <FolderCog className="w-4 h-4 text-slate-600" /> Quản lý danh mục
            </button>
            <button
              onClick={() => {
                setEditDevice(null)
                setDeviceModalOpen(true)
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Thêm Linh Kiện
            </button>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white/80 p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 backdrop-blur-sm">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên thiết bị, mã dụng cụ..."
            value={deviceSearch}
            onChange={(e) => setDeviceSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
        </div>
        <select
          value={deviceCat}
          onChange={(e) => setDeviceCat(e.target.value)}
          className="w-full md:w-60 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition cursor-pointer text-slate-700"
        >
          <option value="all">📁 Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              📦 {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Device Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium text-sm">Đang tải dữ liệu thiết bị...</div>
      ) : filteredDevices.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/60 rounded-2xl border border-slate-200/80 text-slate-500 space-y-2">
          <PackageCheck className="w-10 h-10 mx-auto text-slate-300" />
          <p className="font-semibold text-sm">Không tìm thấy thiết bị nào khớp với từ khóa.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredDevices.map((dev) => (
            <div
              key={dev.id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all relative flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative border-b border-slate-100 bg-slate-50/40 overflow-hidden">
                {dev.image_url ? (
                  <img
                    src={dev.image_url}
                    alt={dev.name}
                    className="w-full h-36 object-cover bg-white p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-36 bg-slate-100/60 flex items-center justify-center text-slate-300">
                    <Cpu className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5 shadow-sm">
                  <StatusBadge status={dev.status} />
                </div>
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-white/95 backdrop-blur-sm text-slate-700 shadow-sm px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border border-slate-100">
                    {dev.category}
                  </span>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-sky-600 transition-colors line-clamp-2 min-h-[38px]">
                      {dev.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Mã: {dev.code}</p>
                  </div>
                  
                  {/* Stock count badge */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tổng số</p>
                      <p className="text-sm font-black text-slate-800">{dev.total}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-sky-600 font-bold uppercase tracking-wider">Sẵn sàng</p>
                      <p className="text-sm font-black text-sky-600">{dev.available}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {dev.description || 'Vị trí trong kho phòng máy'}
                  </p>
                </div>

                {/* Card Actions */}
                {!authUser ? (
                  <button
                    onClick={() => {
                      setAuthMode('login')
                      setAuthOpen(true)
                    }}
                    className="w-full mt-2 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs py-2 rounded-xl transition border border-slate-200 border-dashed flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" /> Đăng nhập để mượn
                  </button>
                ) : isAdmin ? (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditDevice(dev)
                        setDeviceModalOpen(true)
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Sửa
                    </button>
                    <button
                      onClick={() => deleteDevice(dev.id)}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Trash className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => switchTab('muon-tra')}
                    className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" /> Đăng ký mượn
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
