'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Device, Schedule, Material, Post, Loan, JournalEntry, DeviceReport, UserProfile, Tab } from '@/lib/types'
import { formatDate } from '@/lib/utils/date'
import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'
import { Dialog as UiDialog } from '@/components/ui/dialog'
import { LoanBadge as UiLoanBadge, ReportStatusBadge as UiReportStatusBadge, SeverityBadge as UiSeverityBadge, StatusBadge as UiStatusBadge } from '@/components/ui/badges'
import {
  createJournalEntry,
  createLoan,
  createMaterial,
  createPost,
  createReport,
  createSchedule,
  deleteRow,
  loadAdminData as fetchAdminData,
  loadPublicData as fetchPublicData,
  loadUserData as fetchUserData,
  loginUser,
  logoutUser,
  registerStudent,
  resolveReport as resolveDeviceReport,
  sendTelegramMessage,
  updateDeviceAvailability,
  updateLoanStatus,
  upsertDevice,
} from '@/lib/services/stem-lab'
import {
  Zap, Moon, Sun, Menu, X, Home, Box, Calendar, FolderOpen, Newspaper,
  NotebookPen, ArrowLeftRight, TriangleAlert, Settings, LogOut, Lock,
  Search, PlusCircle, Send, Info, ClipboardEdit, History, Shield, Bell,
  PackageMinus, Users2, MapPin, Edit, Trash, Trash2, BookOpen,
  ClipboardList, Wrench, Star, FileText, ArrowRight, RefreshCw, Key,
  CalendarDays, ShieldAlert, Upload, PenTool, CheckCircle, AlertCircle,
  Facebook, Cpu, Plus
} from 'lucide-react'

// ─── helpers ──────────────────────────────────────────────────────────────────
function fmtDate(s: string | null) {
  if (!s) return ''
  const d = new Date(s)
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Tốt')
    return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Hoạt động</span>
  if (status === 'Hỏng nhẹ')
    return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Bảo trì</span>
  return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Hỏng</span>
}

function LoanBadge({ status }: { status: string }) {
  if (status === 'Chờ duyệt') return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold text-[10px]">Chờ duyệt</span>
  if (status === 'Đang mượn') return <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold text-[10px]">Đang mượn</span>
  return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold text-[10px]">Đã trả</span>
}

function SeverityBadge({ s }: { s: string }) {
  const cls = s === 'Nặng' ? 'bg-rose-100 text-rose-700' : s === 'Vừa' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
  return <span className={`${cls} px-2 py-0.5 rounded text-[10px] font-bold`}>{s}</span>
}

function ReportStatusBadge({ status }: { status: string }) {
  if (status === 'Đã xử lý') return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">✓ Đã xử lý</span>
  return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">⏳ Chờ xử lý</span>
}

const JOURNAL_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  'Buổi học': { icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  'Kiểm kê':  { icon: <ClipboardList className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  'Bảo trì':  { icon: <Wrench className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  'Sự kiện':  { icon: <Star className="w-5 h-5" />, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  'Khác':     { icon: <FileText className="w-5 h-5" />, color: 'text-slate-600 bg-slate-50 border-slate-200' },
}

// ─── Dialog component ─────────────────────────────────────────────────────────
function Dialog({ title, msg, ok, onClose }: { title: string; msg: string; ok: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100" onClick={e => e.stopPropagation()}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${ok ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {ok ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
        </div>
        <h3 className="text-center font-extrabold text-slate-900 text-lg">{title}</h3>
        <p className="text-center text-sm text-slate-500 whitespace-pre-line">{msg}</p>
        <button onClick={onClose} className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-2.5 rounded-xl transition">Đóng</button>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Auth state
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // ── Data state
  const [devices, setDevices]         = useState<Device[]>([])
  const [schedules, setSchedules]     = useState<Schedule[]>([])
  const [materials, setMaterials]     = useState<Material[]>([])
  const [posts, setPosts]             = useState<Post[]>([])
  const [loans, setLoans]             = useState<Loan[]>([])
  const [journal, setJournal]         = useState<JournalEntry[]>([])
  const [reports, setReports]         = useState<DeviceReport[]>([])
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([])

  // ── UI state
  const [tab, setTab]                 = useState<Tab>('trang-chu')
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [darkMode, setDarkMode]       = useState(false)
  const [dialog, setDialog]           = useState<{ title: string; msg: string; ok: boolean } | null>(null)
  const [loading, setLoading]         = useState(true)

  // ── Filter state
  const [deviceSearch, setDeviceSearch] = useState('')
  const [deviceCat, setDeviceCat]       = useState('all')
  const [matFilter, setMatFilter]       = useState('all')
  const [jnFilter, setJnFilter]         = useState('all')

  // ── Modal state
  const [authMode, setAuthMode]         = useState<'login' | 'register'>('login')
  const [authOpen, setAuthOpen]         = useState(false)
  const [deviceModalOpen, setDeviceModalOpen] = useState(false)
  const [editDevice, setEditDevice]     = useState<Device | null>(null)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [materialModalOpen, setMaterialModalOpen] = useState(false)
  const [postModalOpen, setPostModalOpen]           = useState(false)
  const [journalModalOpen, setJournalModalOpen]     = useState(false)
  const [reportModalOpen, setReportModalOpen]       = useState(false)
  const [fullPost, setFullPost]         = useState<Post | null>(null)
  const [resetPwUser, setResetPwUser]   = useState<UserProfile | null>(null)
  const [tgModalOpen, setTgModalOpen]   = useState(false)

  // ── Telegram config (localStorage)
  const [tgToken, setTgToken] = useState('')
  const [tgChatId, setTgChatId] = useState('')
  const [tgEnabled, setTgEnabled] = useState(false)

  // ─── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
    setTgToken(localStorage.getItem('tg_bot_token') || '')
    setTgChatId(localStorage.getItem('tg_chat_id') || '')
    setTgEnabled(localStorage.getItem('tg_enabled') === 'true')

    loadPublicData()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null)
      if (session?.user) loadUserData(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthUser(session?.user ?? null)
      if (session?.user) loadUserData(session.user.id)
      else { setProfile(null); setLoans([]); setReports([]) }
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadPublicData = async () => {
    setLoading(true)
    const [devRes, scRes, matRes, postRes, jnRes] = await Promise.all([
      supabase.from('devices').select('*').order('created_at'),
      supabase.from('schedules').select('*').order('date'),
      supabase.from('materials').select('*').order('created_at'),
      supabase.from('posts').select('*').order('published_at', { ascending: false }),
      supabase.from('journal_entries').select('*').order('date', { ascending: false }),
    ])
    if (devRes.data)  setDevices(devRes.data)
    if (scRes.data)   setSchedules(scRes.data)
    if (matRes.data)  setMaterials(matRes.data)
    if (postRes.data) setPosts(postRes.data)
    if (jnRes.data)   setJournal(jnRes.data)
    setLoading(false)
  }

  const loadUserData = async (uid: string) => {
    const [profRes, loansRes, repRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', uid).single(),
      supabase.from('loans').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('device_reports').select('*').eq('reporter_id', uid).order('created_at', { ascending: false }),
    ])
    if (profRes.data) setProfile(profRes.data)
    if (loansRes.data) setLoans(loansRes.data)
    if (repRes.data) setReports(repRes.data)
  }

  const loadAdminData = useCallback(async () => {
    const [loansRes, repRes, profRes] = await Promise.all([
      supabase.from('loans').select('*').order('created_at', { ascending: false }),
      supabase.from('device_reports').select('*').order('created_at', { ascending: false }),
      supabase.from('user_profiles').select('*').order('created_at'),
    ])
    if (loansRes.data) setLoans(loansRes.data)
    if (repRes.data)   setReports(repRes.data)
    if (profRes.data)  setAllProfiles(profRes.data)
  }, [])

  const isAdmin = profile?.role === 'admin'

  function showDialog(title: string, msg: string, ok = true) {
    setDialog({ title, msg, ok })
  }

  function switchTab(t: Tab) {
    setTab(t)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (t === 'admin-panel' && isAdmin) loadAdminData()
  }

  // ── Dark mode ────────────────────────────────────────────────────────────────
  function toggleDark() {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('darkMode', String(next))
  }

  // ── Telegram ─────────────────────────────────────────────────────────────────
  async function sendTelegram(text: string) {
    const tok = localStorage.getItem('tg_bot_token')
    const cid = localStorage.getItem('tg_chat_id')
    const en  = localStorage.getItem('tg_enabled') === 'true'
    if (!en || !tok || !cid) return
    try {
      await fetch(`https://api.telegram.org/bot${tok}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: cid, text, parse_mode: 'HTML' }),
      })
    } catch {}
  }

  // ─── AUTH ────────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: fd.get('email') as string,
      password: fd.get('password') as string,
    })
    if (error) { showDialog('Đăng nhập thất bại', error.message, false); return }
    if (data.user) {
      setAuthOpen(false)
      showDialog('Đăng nhập thành công!', `Chào mừng trở lại! 🎉`)
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = fd.get('email') as string
    const password = fd.get('password') as string
    const name = fd.get('name') as string
    const className = (fd.get('class') as string).toUpperCase()
    const dob = fd.get('dob') as string
    const phone = fd.get('phone') as string

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { showDialog('Đăng ký thất bại', error.message, false); return }
    if (data.user) {
      await supabase.from('user_profiles').insert({
        id: data.user.id, name, class_name: className, dob: dob || null, role: 'student', phone
      })
      setAuthOpen(false)
      showDialog('Đăng ký thành công!', `Tài khoản ${name} đã được tạo. Kiểm tra email để xác nhận.`)
      loadUserData(data.user.id)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setProfile(null); setLoans([]); setReports([])
    switchTab('trang-chu')
    showDialog('Đã đăng xuất', 'Tài khoản đã được đăng xuất an toàn.')
  }

  // ─── DEVICES CRUD ────────────────────────────────────────────────────────────
  async function handleDeviceSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      name: fd.get('name') as string,
      category: fd.get('category') as string,
      code: fd.get('code') as string,
      total: parseInt(fd.get('total') as string),
      available: parseInt(fd.get('available') as string),
      status: fd.get('status') as string,
      description: fd.get('description') as string,
      image_url: (fd.get('image_url') as string) || null,
    }
    if (editDevice) {
      const { error } = await supabase.from('devices').update(data).eq('id', editDevice.id)
      if (error) { showDialog('Lỗi', error.message, false); return }
      showDialog('Cập nhật thành công', 'Thông tin thiết bị đã được thay đổi.')
    } else {
      const { error } = await supabase.from('devices').insert(data)
      if (error) { showDialog('Lỗi', error.message, false); return }
      showDialog('Thêm thành công', 'Thiết bị mới đã được đưa vào kho hệ thống.')
    }
    setDeviceModalOpen(false); setEditDevice(null)
    loadPublicData()
  }

  async function deleteDevice(id: string) {
    if (!confirm('Xóa thiết bị này?')) return
    await supabase.from('devices').delete().eq('id', id)
    setDevices(d => d.filter(x => x.id !== id))
    showDialog('Đã xóa', 'Thiết bị đã bị xóa khỏi kho.')
  }

  // ─── SCHEDULES ───────────────────────────────────────────────────────────────
  async function handleScheduleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.from('schedules').insert({
      title: fd.get('title'), date: fd.get('date'),
      time_range: fd.get('time_range'), instructor: fd.get('instructor'),
      target_audience: fd.get('target'), description: fd.get('description'),
    })
    if (error) { showDialog('Lỗi', error.message, false); return }
    setScheduleModalOpen(false)
    showDialog('Xong', 'Đã thêm lịch hoạt động mới.')
    loadPublicData()
  }

  async function deleteSchedule(id: string) {
    if (!confirm('Xóa lịch này?')) return
    await supabase.from('schedules').delete().eq('id', id)
    setSchedules(s => s.filter(x => x.id !== id))
    showDialog('Đã xóa', 'Lịch hoạt động đã được xóa.')
  }

  // ─── MATERIALS ───────────────────────────────────────────────────────────────
  async function handleMaterialSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.from('materials').insert({
      title: fd.get('title'), type: fd.get('type'),
      author: fd.get('author'), description: fd.get('description'), url: fd.get('url') || '#',
    })
    if (error) { showDialog('Lỗi', error.message, false); return }
    setMaterialModalOpen(false)
    showDialog('Thành công', 'Tài liệu đã được tải lên.')
    loadPublicData()
  }

  async function deleteMaterial(id: string) {
    if (!confirm('Xóa tài liệu này?')) return
    await supabase.from('materials').delete().eq('id', id)
    setMaterials(m => m.filter(x => x.id !== id))
  }

  // ─── POSTS ───────────────────────────────────────────────────────────────────
  async function handlePostSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const { error } = await supabase.from('posts').insert({
      title: fd.get('title'), category: fd.get('category'),
      content: fd.get('content'), image_url: (fd.get('image_url') as string) || null,
      author: profile?.name || 'Admin',
    })
    if (error) { showDialog('Lỗi', error.message, false); return }
    setPostModalOpen(false)
    showDialog('Thành công', 'Đã đăng bài viết mới.')
    loadPublicData()
  }

  async function deletePost(id: string) {
    if (!confirm('Xóa bài viết này?')) return
    await supabase.from('posts').delete().eq('id', id)
    setPosts(p => p.filter(x => x.id !== id))
    showDialog('Đã xóa', 'Bài viết đã được gỡ xuống.')
  }

  // ─── BORROW / LOANS ──────────────────────────────────────────────────────────
  async function handleBorrowSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!authUser || !profile) { showDialog('Chưa đăng nhập', 'Vui lòng đăng nhập để mượn thiết bị.', false); return }
    const fd = new FormData(e.currentTarget)
    const devId = fd.get('device_id') as string
    const qty   = parseInt(fd.get('quantity') as string)
    const dev   = devices.find(d => d.id === devId)
    if (!dev) { showDialog('Lỗi', 'Không tìm thấy thiết bị.', false); return }
    if (qty > dev.available) { showDialog('Lỗi', `Chỉ còn ${dev.available} thiết bị sẵn sàng.`, false); return }

    const loan = {
      user_id: authUser.id, user_name: profile.name || '', class_name: profile.class_name,
      phone: profile.phone, device_id: devId, device_name: dev.name,
      quantity: qty, return_date: fd.get('return_date') as string,
      purpose: fd.get('purpose') as string, status: 'Chờ duyệt',
    }
    const { error } = await supabase.from('loans').insert(loan)
    if (error) { showDialog('Lỗi', error.message, false); return }

    showDialog('Đăng ký thành công', 'Phiếu mượn đã gửi cho Admin. Vui lòng chờ phê duyệt.')
    sendTelegram(`📦 <b>Yêu cầu mượn thiết bị mới!</b>\n👤 ${profile.name} (${profile.class_name})\n🔧 ${dev.name} x${qty}\n📅 Trả: ${loan.return_date}\n📝 ${loan.purpose}`)
    loadUserData(authUser.id)
    ;(e.target as HTMLFormElement).reset()
  }

  async function approveLoan(id: string) {
    const ln = loans.find(l => l.id === id)
    const dev = devices.find(d => d.id === ln?.device_id)
    if (!ln || !dev) return
    if (dev.available < ln.quantity) { showDialog('Lỗi', 'Số lượng trong kho không đủ.', false); return }
    await supabase.from('loans').update({ status: 'Đang mượn' }).eq('id', id)
    await supabase.from('devices').update({ available: dev.available - ln.quantity }).eq('id', dev.id)
    showDialog('Đã duyệt', 'Xuất kho thành công.')
    sendTelegram(`✅ <b>Đã duyệt phiếu mượn</b>\n👤 ${ln.user_name}\n🔧 ${ln.device_name} x${ln.quantity}`)
    loadAdminData(); loadPublicData()
  }

  async function rejectLoan(id: string) {
    if (!confirm('Từ chối phiếu mượn này?')) return
    await supabase.from('loans').delete().eq('id', id)
    showDialog('Đã từ chối', 'Phiếu mượn đã bị hủy.')
    loadAdminData()
  }

  async function returnLoan(id: string) {
    const ln = loans.find(l => l.id === id)
    const dev = devices.find(d => d.id === ln?.device_id)
    if (!ln || !dev) return
    await supabase.from('loans').update({ status: 'Đã trả' }).eq('id', id)
    await supabase.from('devices').update({ available: dev.available + ln.quantity }).eq('id', dev.id)
    showDialog('Thành công', 'Đã thu hồi thiết bị về kho.')
    loadAdminData(); loadPublicData()
  }

  // ─── JOURNAL ─────────────────────────────────────────────────────────────────
  async function handleJournalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const entry = {
      date: fd.get('date') as string, time_of_day: fd.get('time') as string,
      type: fd.get('type') as string, title: fd.get('title') as string,
      content: fd.get('content') as string, author: profile?.name || 'Admin',
      participants: parseInt(fd.get('participants') as string) || 0,
      status: fd.get('status') as string,
    }
    const { error } = await supabase.from('journal_entries').insert(entry)
    if (error) { showDialog('Lỗi', error.message, false); return }
    setJournalModalOpen(false)
    showDialog('Đã ghi nhật ký', 'Nhật ký hoạt động đã được lưu thành công.')
    sendTelegram(`📓 <b>Nhật ký Lab mới</b>\n📅 ${entry.date} ${entry.time_of_day}\n🏷️ ${entry.type}: ${entry.title}\n👥 ${entry.participants} người tham gia`)
    loadPublicData()
  }

  async function deleteJournal(id: string) {
    if (!confirm('Xóa mục nhật ký này?')) return
    await supabase.from('journal_entries').delete().eq('id', id)
    setJournal(j => j.filter(x => x.id !== id))
    showDialog('Đã xóa', 'Mục nhật ký đã được xóa.')
  }

  // ─── DEVICE REPORTS ──────────────────────────────────────────────────────────
  async function handleReportSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!authUser || !profile) return
    const fd = new FormData(e.currentTarget)
    const devId = fd.get('device_id') as string
    const dev = devices.find(d => d.id === devId)
    const rpt = {
      device_id: devId, device_name: dev?.name || '',
      reporter_id: authUser.id, reporter_name: profile.name, class_name: profile.class_name,
      severity: fd.get('severity') as string, description: fd.get('description') as string,
      status: 'Chờ xử lý', admin_note: '',
    }
    const { error } = await supabase.from('device_reports').insert(rpt)
    if (error) { showDialog('Lỗi', error.message, false); return }
    setReportModalOpen(false)
    showDialog('Báo cáo đã gửi', 'Cảm ơn! Admin đã được thông báo và sẽ kiểm tra sớm nhất.')
    sendTelegram(`🚨 <b>Báo hỏng thiết bị!</b>\n👤 ${profile.name} (${profile.class_name})\n🔧 ${dev?.name}\n⚠️ Mức độ: ${rpt.severity}\n📝 ${rpt.description}`)
    if (authUser) loadUserData(authUser.id)
  }

  async function resolveReport(id: string) {
    const note = prompt('Ghi chú xử lý (bỏ trống nếu không cần):')
    if (note === null) return
    await supabase.from('device_reports').update({ status: 'Đã xử lý', admin_note: note || 'Đã kiểm tra và xử lý.' }).eq('id', id)
    showDialog('Đã xử lý', 'Báo cáo đã được đánh dấu hoàn tất.')
    loadAdminData()
  }

  // ─── ADMIN: Reset password ────────────────────────────────────────────────────
  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const newPw = fd.get('newpw') as string
    const confirmPw = fd.get('confirmpw') as string
    if (newPw.length < 6) { showDialog('Lỗi', 'Mật khẩu tối thiểu 6 ký tự.', false); return }
    if (newPw !== confirmPw) { showDialog('Lỗi', 'Mật khẩu xác nhận không khớp.', false); return }
    // Note: Admin cannot change other users' passwords via anon key - this requires service role
    showDialog('Không thể thực hiện', 'Để đổi mật khẩu của học sinh, vui lòng dùng Supabase Dashboard → Authentication → Users.', false)
    setResetPwUser(null)
  }

  // ─── Stats ────────────────────────────────────────────────────────────────────
  const pendingLoans  = loans.filter(l => l.status === 'Chờ duyệt').length
  const activeLoans   = loans.filter(l => l.status === 'Đang mượn').length
  const pendingReports = reports.filter(r => r.status !== 'Đã xử lý').length
  const jnThisMonth   = journal.filter(e => e.date.startsWith(new Date().toISOString().slice(0,7))).length
  const jnParticipants = journal.reduce((s, e) => s + (e.participants || 0), 0)

  const filteredDevices = devices.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(deviceSearch.toLowerCase()) || d.code.toLowerCase().includes(deviceSearch.toLowerCase())
    const matchCat = deviceCat === 'all' || d.category === deviceCat
    return matchSearch && matchCat
  })
  const filteredMaterials = matFilter === 'all' ? materials : materials.filter(m => m.type === matFilter)
  const filteredJournal   = jnFilter  === 'all' ? journal   : journal.filter(e => e.type === jnFilter)
  const myLoans   = loans.filter(l => l.user_id === authUser?.id)
  const myReports = reports.filter(r => r.reporter_id === authUser?.id)

  // ─── Material icon ────────────────────────────────────────────────────────────
  function MatIcon({ type }: { type: string }) {
    if (type === 'video') return <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center"><Box className="w-5 h-5" /></div>
    if (type === 'pdf')   return <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center"><FileText className="w-5 h-5" /></div>
    return <div className="w-10 h-10 bg-stemBlue-100 text-stemBlue-600 rounded-2xl flex items-center justify-center"><Box className="w-5 h-5" /></div>
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* ── Dialog ── */}
      {dialog && <UiDialog title={dialog.title} msg={dialog.msg} ok={dialog.ok} onClose={() => setDialog(null)} />}

      {/* ── TOP BAR ── */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-xs py-2 px-4 text-center font-semibold flex items-center justify-center gap-2">
        <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
        Chương trình STEM INNOVATION PETROVIETNAM được tài trợ bởi Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam
      </div>

      {/* ── HEADER ── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-5 cursor-pointer" onClick={() => switchTab('trang-chu')}>
            <div className="flex items-center gap-1.5 md:gap-3 border-r border-slate-200 pr-2 md:pr-5">
              <div className="w-9 h-9 md:w-12 md:h-12 bg-white rounded-xl shadow-sm border border-slate-100 p-0.5">
                <img src="/assets/images/logo-bdq.jpg" alt="BDQ" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
              </div>
              <div className="w-9 h-9 md:w-12 md:h-12 bg-white rounded-xl shadow-sm border border-slate-100 p-0.5">
                <img src="/assets/images/logo-pvn.png" alt="PVN" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
              </div>
            </div>
            <div className="leading-tight">
              <h1 className="font-black text-sm md:text-xl text-stemBlue-900 tracking-tight">STEM LABORATORY</h1>
              <div className="text-[8px] md:text-[10px] font-semibold text-slate-700 uppercase tracking-[0.12em]">THPT Bắc Đông Quan</div>
              <div className="hidden lg:block text-[9px] md:text-xs text-slate-500">Innovation • Creativity • Pioneering</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1.5">
            {([
              ['trang-chu','Trang chủ'],['co-so-vat-chat','Kho Thiết bị'],
              ['lich-hoc','Lịch hoạt động'],['kho-tai-lieu','Thư viện số'],
              ['truyen-thong','Tin tức'],['nhat-ky','Nhật ký Lab'],
            ] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => switchTab(t)}
                className={`px-2.5 py-2 2xl:px-4 2xl:py-2.5 rounded-lg text-sm 2xl:text-base font-semibold transition-all ${tab===t ? 'text-stemBlue-600 bg-stemBlue-50' : 'text-slate-600 hover:text-stemBlue-600 hover:bg-slate-50'}`}>
                {label}
              </button>
            ))}
            {authUser && <>
              <button onClick={() => switchTab('muon-tra')}
                className={`px-2.5 py-2 2xl:px-4 2xl:py-2.5 rounded-lg text-sm 2xl:text-base font-semibold border border-stemBlue-200 transition-all ${tab==='muon-tra' ? 'bg-stemBlue-50 text-stemBlue-600' : 'bg-white text-stemBlue-600 hover:bg-stemBlue-50'}`}>
                Đăng ký Mượn
              </button>
              <button onClick={() => switchTab('bao-hong')}
                className={`px-2.5 py-2 2xl:px-4 2xl:py-2.5 rounded-lg text-sm 2xl:text-base font-semibold border border-amber-200 flex items-center gap-1.5 transition-all ${tab==='bao-hong' ? 'bg-amber-50 text-amber-600' : 'bg-white text-amber-600 hover:bg-amber-50'}`}>
                <TriangleAlert className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" /> Báo hỏng
              </button>
            </>}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={toggleDark} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-all">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAdmin && (
              <button onClick={() => switchTab('admin-panel')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1 md:gap-1.5">
                <Settings className="w-4 h-4" /> Quản trị
              </button>
            )}
            {!authUser ? (
              <div className="flex items-center gap-1 md:gap-2">
                <button onClick={() => { setAuthMode('login'); setAuthOpen(true) }}
                  className="text-slate-600 hover:text-stemBlue-600 px-2 py-1 md:px-3.5 md:py-2 text-sm md:text-base font-semibold">Đăng nhập</button>
                <button onClick={() => { setAuthMode('register'); setAuthOpen(true) }}
                  className="hidden sm:inline-block bg-stemBlue-600 hover:bg-stemBlue-700 text-white px-3.5 py-2 rounded-lg text-sm md:text-base font-semibold shadow-sm">Đăng ký</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1 px-3 rounded-full">
                  <div className="w-7 h-7 rounded-full bg-pvn-500 text-white font-bold flex items-center justify-center text-xs">
                    {profile?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">{profile?.name || 'User'}</p>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{profile?.role === 'admin' ? 'Quản trị viên' : 'Học sinh'}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all" title="Đăng xuất">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-inner">
            {([['trang-chu','Trang chủ','home'],['co-so-vat-chat','Kho Thiết bị','box'],['lich-hoc','Lịch hoạt động','calendar'],['kho-tai-lieu','Thư viện số','folder-open'],['truyen-thong','Tin tức','newspaper'],['nhat-ky','Nhật ký Lab','notebook-pen']] as [Tab,string,string][]).map(([t,label]) => (
              <button key={t} onClick={() => switchTab(t)}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                {label}
              </button>
            ))}
            {authUser && <>
              <button onClick={() => switchTab('muon-tra')} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-stemBlue-600 bg-stemBlue-50 border border-stemBlue-100 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" /> Đăng ký Mượn/Trả
              </button>
              <button onClick={() => switchTab('bao-hong')} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 flex items-center gap-2">
                <TriangleAlert className="w-4 h-4" /> Báo hỏng Thiết bị
              </button>
            </>}
          </div>
        )}
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

        {/* ══ TAB: TRANG CHỦ ══ */}
        {tab === 'trang-chu' && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl min-h-[560px]">
              <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d" alt="STEM Lab" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/85 to-slate-900/80" />
              <div className="relative z-10 px-8 py-20 max-w-6xl mx-auto text-center">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">STEM LAB
                  <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">THPT BẮC ĐÔNG QUAN</span>
                </h1>
                <p className="mt-4 md:mt-6 text-sm md:text-lg text-slate-200 max-w-2xl mx-auto">Không gian sáng tạo dành cho Robotics, AI, IoT, Lập trình và Nghiên cứu khoa học kỹ thuật.</p>
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {['🤖 Robotics','💻 AI & Coding','🌐 IoT','🖨️ 3D Printing'].map(t => (
                    <span key={t} className="px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm">{t}</span>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
                  <button onClick={() => switchTab('co-so-vat-chat')} className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl shadow-xl transition">Khám phá thiết bị</button>
                  <button onClick={() => switchTab('nhat-ky')} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20 rounded-2xl font-bold transition">Xem Nhật ký Lab</button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { val: devices.length, label: 'Thiết bị', color: 'text-stemBlue-600' },
                { val: schedules.length, label: 'Sự kiện', color: 'text-emerald-600' },
                { val: materials.length, label: 'Tài liệu', color: 'text-amber-600' },
                { val: 120 + (allProfiles.length || 0), label: 'Học sinh', color: 'text-purple-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center">
                  <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Shortcut cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition" onClick={() => switchTab('nhat-ky')}>
                <NotebookPen className="w-7 h-7 mb-3 opacity-80" />
                <h3 className="font-extrabold text-base">Nhật Ký Hoạt Động</h3>
                <p className="text-blue-100 text-xs mt-1">Ghi lại các buổi học, kiểm kê, sự kiện phòng Lab.</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition" onClick={() => authUser ? switchTab('bao-hong') : setAuthOpen(true)}>
                <TriangleAlert className="w-7 h-7 mb-3 opacity-80" />
                <h3 className="font-extrabold text-base">Báo Hỏng Thiết Bị</h3>
                <p className="text-amber-100 text-xs mt-1">Phát hiện lỗi? Báo ngay để Admin xử lý.</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition" onClick={() => authUser ? switchTab('muon-tra') : setAuthOpen(true)}>
                <ArrowLeftRight className="w-7 h-7 mb-3 opacity-80" />
                <h3 className="font-extrabold text-base">Đăng Ký Mượn Đồ</h3>
                <p className="text-emerald-100 text-xs mt-1">Mượn thiết bị về lớp thực hiện đề tài KHKT.</p>
              </div>
            </div>

            {/* Alert */}
            {!authUser && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl shrink-0"><Lock className="w-5 h-5" /></div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-900 text-sm">Đăng nhập để sử dụng đầy đủ tính năng</h4>
                  <p className="text-xs text-amber-700 mt-1">Tạo tài khoản hoặc đăng nhập để mượn thiết bị, báo hỏng và xem lịch sử của bạn.</p>
                </div>
                <button onClick={() => { setAuthMode('login'); setAuthOpen(true) }}
                  className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm">Đăng nhập</button>
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: KHO THIẾT BỊ ══ */}
        {tab === 'co-so-vat-chat' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div><h2 className="text-2xl font-extrabold text-slate-900">Kho Thiết Bị & Linh Kiện STEM</h2><p className="text-sm text-slate-500 mt-1">Tra cứu số lượng và đăng ký mượn thiết bị.</p></div>
              {isAdmin && <button onClick={() => { setEditDevice(null); setDeviceModalOpen(true) }}
                className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" /> Thêm Linh Kiện
              </button>}
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Tìm tên thiết bị, mã dụng cụ..." value={deviceSearch}
                  onChange={e => setDeviceSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500" />
              </div>
              <select value={deviceCat} onChange={e => setDeviceCat(e.target.value)}
                className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500">
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
                {filteredDevices.map(dev => (
                  <div key={dev.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-lg hover:border-stemBlue-200 transition-all relative flex flex-col group">
                    <div className="relative border-b border-slate-100">
                      {dev.image_url
                        ? <img src={dev.image_url} alt={dev.name} className="w-full h-40 object-cover bg-white p-2" />
                        : <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-300"><Cpu className="w-12 h-12" /></div>
                      }
                      <div className="absolute top-3 right-3"><UiStatusBadge status={dev.status} /></div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">{dev.category}</span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-stemBlue-600 transition-colors line-clamp-2">{dev.name}</h3>
                          <p className="text-[11px] text-slate-400 font-mono mt-1 font-semibold">Mã: {dev.code}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Trong kho</p><p className="text-base font-black text-slate-800 mt-0.5">{dev.total}</p></div>
                          <div><p className="text-[9px] text-stemBlue-600 font-bold uppercase tracking-wider">Khả dụng</p><p className="text-base font-black text-stemBlue-600 mt-0.5">{dev.available}</p></div>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{dev.description || 'Chưa cập nhật vị trí'}</p>
                      </div>
                      {/* Action button */}
                      {!authUser ? (
                        <button onClick={() => { setAuthMode('login'); setAuthOpen(true) }}
                          className="w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs py-2.5 rounded-lg transition-all border border-slate-200 border-dashed flex items-center justify-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" /> Đăng nhập để mượn
                        </button>
                      ) : isAdmin ? (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                          <button onClick={() => { setEditDevice(dev); setDeviceModalOpen(true) }}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1">
                            <Edit className="w-3.5 h-3.5" /> Chỉnh sửa
                          </button>
                          <button onClick={() => deleteDevice(dev.id)}
                            className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1">
                            <Trash className="w-3.5 h-3.5" /> Xóa bỏ
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => { switchTab('muon-tra') }}
                          className="w-full mt-4 bg-stemBlue-600 hover:bg-stemBlue-700 text-white shadow-sm font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5">
                          <ArrowLeftRight className="w-3.5 h-3.5" /> Đăng ký mượn ngay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ══ TAB: LỊCH HỌC ══ */}
        {tab === 'lich-hoc' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div><h2 className="text-2xl font-extrabold text-slate-900">Lịch Học & Hoạt Động CLB</h2><p className="text-sm text-slate-500 mt-1">Lịch tập huấn KHKT, sinh hoạt nội bộ và mở cửa Lab.</p></div>
              {isAdmin && <button onClick={() => setScheduleModalOpen(true)} className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm flex items-center gap-1.5"><Plus className="w-4 h-4" /> Tạo Lịch Mới</button>}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><CalendarDays className="text-stemBlue-600 w-5 h-5" />Sự kiện sắp tới</h3>
                <div className="space-y-4">
                  {schedules.length === 0 ? <div className="text-center py-12 text-slate-400 font-medium">Chưa có lịch hoạt động nào.</div> :
                    schedules.map(sc => (
                      <div key={sc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-stemBlue-100 text-stemBlue-700 text-xs font-bold px-2 py-1 rounded">{sc.date}</span>
                          <span className="text-xs font-bold text-slate-500">{sc.time_range}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{sc.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">Phụ trách: {sc.instructor}</p>
                        <p className="text-xs text-slate-500">Đối tượng: {sc.target_audience}</p>
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded leading-relaxed">{sc.description}</p>
                        {isAdmin && <button onClick={() => deleteSchedule(sc.id)} className="text-rose-500 text-xs font-bold mt-2 flex items-center gap-1 hover:text-rose-700"><Trash2 className="w-3.5 h-3.5" /> Xóa lịch</button>}
                      </div>
                    ))
                  }
                </div>
              </div>
              <div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 mb-4"><ShieldAlert className="text-amber-500 w-5 h-5" />Nội quy Phòng STEM Lab</h3>
                  <ol className="text-sm text-slate-600 space-y-2 list-decimal pl-4 leading-relaxed">
                    <li>Chỉ vào phòng khi có sự hướng dẫn của giáo viên phụ trách.</li>
                    <li>Đăng ký thiết bị mượn trên hệ thống web trước.</li>
                    <li>Bảo quản linh kiện cẩn thận, dùng đúng quy cách.</li>
                    <li>Không mang linh kiện ra ngoài Lab khi chưa báo cáo.</li>
                    <li>Thu dọn, vệ sinh bàn làm việc và để lại các thiết bị đúng vị trí sau buổi học.</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ TAB: THƯ VIỆN ══ */}
        {tab === 'kho-tai-lieu' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div><h2 className="text-2xl font-extrabold text-slate-900">Thư Viện Kiến Thức Số</h2><p className="text-sm text-slate-500 mt-1">Slide bài giảng, code mẫu và hướng dẫn lắp ráp.</p></div>
              {isAdmin && <button onClick={() => setMaterialModalOpen(true)} className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm flex items-center gap-1.5"><Upload className="w-4 h-4" /> Tải lên Tài liệu</button>}
            </div>
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-3">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Phân loại</h3>
                  {[['all','Tất cả tài liệu'],['video','Video Bài giảng'],['pdf','Sách & Giáo trình PDF'],['guide','Source Code & Hướng dẫn']].map(([v,l]) => (
                    <button key={v} onClick={() => setMatFilter(v)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${matFilter===v ? 'text-stemBlue-700 bg-stemBlue-50' : 'text-slate-600 hover:bg-slate-50'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-9">
                <div className="grid sm:grid-cols-2 gap-6">
                  {filteredMaterials.map(m => (
                    <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start gap-4">
                        <MatIcon type={m.type} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{m.title}</h4>
                          <p className="text-xs text-stemBlue-600 font-bold mt-1">{m.author}</p>
                          <p className="text-xs text-slate-500 mt-2 leading-relaxed">{m.description}</p>
                          <div className="flex items-center gap-2 mt-4">
                            <a href={m.url || '#'} className="flex items-center gap-1.5 bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition">
                              <ArrowRight className="w-3.5 h-3.5" /> Xem tài liệu
                            </a>
                            {isAdmin && <button onClick={() => deleteMaterial(m.id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ TAB: TIN TỨC ══ */}
        {tab === 'truyen-thong' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div><h2 className="text-2xl font-extrabold text-slate-900">Tin tức & Hoạt động CLB</h2><p className="text-sm text-slate-500 mt-1">Cập nhật hình ảnh dự án và bản tin KHKT.</p></div>
              {isAdmin && <button onClick={() => setPostModalOpen(true)} className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm flex items-center gap-1.5"><PenTool className="w-4 h-4" /> Đăng bản tin</button>}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {posts.length === 0 ? <div className="text-center py-12 text-slate-400 font-medium">Chưa có bài viết nào.</div> :
                  posts.map(post => (
                    <article key={post.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col group relative">
                      <div className="absolute top-8 left-8 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">{post.category}</span>
                      </div>
                      {post.image_url && <div className="w-full h-48 md:h-56 overflow-hidden rounded-xl shrink-0 border border-slate-100">
                        <img src={post.image_url} alt="Bìa" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold tracking-wider">
                          <Calendar className="w-3.5 h-3.5" /> {formatDate(post.published_at)} <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                          <span>{post.author}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug group-hover:text-stemBlue-600 transition-colors cursor-pointer"
                          onClick={() => setFullPost(post)}>{post.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{post.content}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                        <button onClick={() => setFullPost(post)} className="text-stemBlue-600 font-bold text-xs flex items-center gap-1.5 hover:underline uppercase tracking-wider">
                          Đọc bài viết <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && <button onClick={() => deletePost(post.id)} className="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1 transition-colors"><Trash2 className="w-3.5 h-3.5" /> Xóa bài</button>}
                      </div>
                    </article>
                  ))
                }
              </div>
              <div>
                <div className="bg-gradient-to-br from-indigo-900 to-stemBlue-900 text-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-bold mb-3">Tìm kiếm nhân tài!</h3>
                  <p className="text-indigo-200 text-xs leading-relaxed mb-4">CLB KHKT thường xuyên tuyển thành viên đam mê Lập trình, Chế tạo và Thiết kế 3D.</p>
                  <a href="#" className="inline-flex items-center gap-2 bg-white text-indigo-900 font-bold text-xs px-4 py-2 rounded-lg shadow">
                    <Facebook className="w-4 h-4" /> Fanpage CLB
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ TAB: NHẬT KÝ ══ */}
        {tab === 'nhat-ky' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2"><NotebookPen className="w-7 h-7 text-stemBlue-600" /> Nhật Ký Hoạt Động Phòng Lab</h2>
                <p className="text-sm text-slate-500 mt-1">Lịch sử các buổi học, kiểm kê định kỳ, bảo trì và sự kiện.</p>
              </div>
              {isAdmin && <button onClick={() => setJournalModalOpen(true)} className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm flex items-center gap-1.5"><Plus className="w-4 h-4" /> Ghi Nhật Ký Mới</button>}
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center"><p className="text-2xl font-black text-blue-700">{journal.length}</p><p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mt-1">Tổng bản ghi</p></div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center"><p className="text-2xl font-black text-emerald-700">{jnThisMonth}</p><p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">Tháng này</p></div>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center"><p className="text-2xl font-black text-purple-700">{jnParticipants}</p><p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mt-1">Lượt tham gia</p></div>
            </div>
            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              {['all','Buổi học','Kiểm kê','Bảo trì','Sự kiện','Khác'].map(f => (
                <button key={f} onClick={() => setJnFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${jnFilter===f ? 'bg-stemBlue-600 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                  {f === 'all' ? 'Tất cả' : f}
                </button>
              ))}
            </div>
            {/* List */}
            <div className="space-y-4">
              {filteredJournal.map(entry => {
                const ts = JOURNAL_ICONS[entry.type] || JOURNAL_ICONS['Khác']
                return (
                  <div key={entry.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <div className="flex items-start gap-4 p-5">
                      <div className={`p-2.5 rounded-xl border ${ts.color} shrink-0 mt-0.5`}>{ts.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{entry.type}</span>
                              {entry.status === 'Hoàn thành'
                                ? <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">✓ Hoàn thành</span>
                                : <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">⏳ Đang diễn ra</span>
                              }
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{entry.title}</h4>
                          </div>
                          {isAdmin && <button onClick={() => deleteJournal(entry.id)} className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></button>}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{entry.content}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                          <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold"><Calendar className="w-3.5 h-3.5" />{entry.date} — {entry.time_of_day}</span>
                          <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold"><Users2 className="w-3.5 h-3.5" />{entry.author}</span>
                          <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold"><Users2 className="w-3.5 h-3.5" />{entry.participants} người tham gia</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ══ TAB: BÁO HỎNG ══ */}
        {tab === 'bao-hong' && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div><h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2"><TriangleAlert className="w-7 h-7 text-amber-500" /> Báo Hỏng / Lỗi Thiết Bị</h2></div>
              <button onClick={() => authUser ? setReportModalOpen(true) : setAuthOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-sm flex items-center gap-1.5">
                <Send className="w-4 h-4" /> Gửi Báo Cáo Hỏng
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0"><Info className="w-5 h-5" /></div>
              <div><h4 className="font-bold text-amber-900 text-sm">Cách hoạt động</h4><p className="text-xs text-amber-700 mt-1 leading-relaxed">Sau khi bạn gửi báo cáo, Admin sẽ nhận thông báo qua Telegram ngay lập tức và tiến hành kiểm tra.</p></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2"><ClipboardEdit className="w-5 h-5 text-amber-500" />Gửi Phiếu Báo Hỏng</h3>
                <p className="text-sm text-slate-500">Nhấn nút bên dưới để mở form báo cáo. Vui lòng mô tả chi tiết triệu chứng lỗi.</p>
                <button onClick={() => authUser ? setReportModalOpen(true) : setAuthOpen(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                  <TriangleAlert className="w-4 h-4" /> Mở Form Báo Hỏng
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 font-bold text-slate-900 flex items-center gap-2"><History className="w-5 h-5 text-slate-400" /> Báo cáo của tôi</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4 text-left">Thiết bị</th><th className="py-3 px-4 text-center">Mức độ</th><th className="py-3 px-4">Ngày</th><th className="py-3 px-4 text-center">Trạng thái</th>
                    </tr></thead>
                    <tbody>
                      {myReports.length === 0
                        ? <tr><td colSpan={4} className="py-8 text-center text-slate-400 font-medium">Bạn chưa gửi báo cáo nào.</td></tr>
                        : myReports.map(r => (
                          <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-slate-900 text-sm">{r.device_name}</td>
                            <td className="py-3 px-4 text-center"><UiSeverityBadge s={r.severity} /></td>
                            <td className="py-3 px-4 text-xs text-slate-500">{r.created_at?.split('T')[0]}</td>
                            <td className="py-3 px-4 text-center"><UiReportStatusBadge status={r.status} /></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ TAB: MƯỢN TRẢ ══ */}
        {tab === 'muon-tra' && (
          <section className="space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <h2 className="text-2xl font-extrabold text-slate-900">Phiếu Yêu Cầu Mượn Thiết Bị</h2>
              <p className="text-sm text-slate-500 mt-1">Học sinh đăng ký mượn thiết bị thực hiện đề tài khoa học.</p>
            </div>
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ClipboardEdit className="text-stemBlue-600 w-5 h-5" />Điền Phiếu Đăng Ký</h3>
                  <form onSubmit={handleBorrowSubmit} className="space-y-4">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Họ và tên</label>
                      <input readOnly value={profile?.name || ''} className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed font-medium" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Lớp</label>
                        <input readOnly value={profile?.class_name || ''} className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed" /></div>
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">SĐT</label>
                        <input readOnly value={profile?.phone || ''} className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed" /></div>
                    </div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chọn thiết bị</label>
                      <select name="device_id" required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500">
                        {devices.filter(d => d.available > 0).map(d => (
                          <option key={d.id} value={d.id}>{d.name} [Mã: {d.code}] (Còn: {d.available})</option>
                        ))}
                      </select></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Số lượng</label>
                        <input type="number" name="quantity" required min="1" defaultValue="1" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ngày trả</label>
                        <input type="date" name="return_date" required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                    </div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mục đích</label>
                      <textarea name="purpose" required rows={2} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                    <button type="submit" className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Gửi Yêu Cầu
                    </button>
                  </form>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><History className="text-stemBlue-600 w-5 h-5" />Lịch sử mượn đồ</h3>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto"><table className="w-full text-left text-sm">
                    <thead><tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold text-[11px] uppercase tracking-wider">
                      <th className="py-4 px-4">Thiết bị</th><th className="py-4 px-4 text-center">SL</th><th className="py-4 px-4">Hạn Trả</th><th className="py-4 px-4">Trạng thái</th>
                    </tr></thead>
                    <tbody>
                      {myLoans.length === 0
                        ? <tr><td colSpan={4} className="py-8 px-4 text-center text-slate-400 font-medium">Bạn chưa có phiếu mượn nào.</td></tr>
                        : myLoans.map(ln => (
                          <tr key={ln.id} className="border-b border-slate-100 text-slate-700 hover:bg-slate-50">
                            <td className="py-3 px-4 font-bold text-slate-900">{ln.device_name}</td>
                            <td className="py-3 px-4 font-semibold text-center">{ln.quantity}</td>
                            <td className="py-3 px-4 text-xs font-medium">{ln.return_date}</td>
                            <td className="py-3 px-4"><UiLoanBadge status={ln.status} /></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ TAB: ADMIN ══ */}
        {tab === 'admin-panel' && isAdmin && (
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl border border-purple-200"><Shield className="w-6 h-6" /></div>
                <div><h2 className="text-2xl font-extrabold text-slate-900">Khu Vực Quản Trị Hệ Thống</h2><p className="text-sm text-slate-500 mt-1">Xử lý phiếu mượn, báo hỏng, nhật ký và tài khoản học sinh.</p></div>
              </div>
              <button onClick={() => setTgModalOpen(true)} className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-bold text-sm px-4 py-2 rounded-xl transition">
                <Send className="w-4 h-4" /> Cài đặt Telegram
              </button>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { val: pendingLoans, label: 'Chờ duyệt mượn', bg: 'bg-purple-50', border: 'border-purple-200', textVal: 'text-purple-900', textLbl: 'text-purple-600', iconBg: 'bg-purple-100 text-purple-700', icon: <Bell className="w-5 h-5" /> },
                { val: activeLoans, label: 'Đang mượn', bg: 'bg-emerald-50', border: 'border-emerald-200', textVal: 'text-emerald-900', textLbl: 'text-emerald-600', iconBg: 'bg-emerald-100 text-emerald-700', icon: <PackageMinus className="w-5 h-5" /> },
                { val: pendingReports, label: 'Báo hỏng chờ xử lý', bg: 'bg-amber-50', border: 'border-amber-200', textVal: 'text-amber-900', textLbl: 'text-amber-600', iconBg: 'bg-amber-100 text-amber-700', icon: <TriangleAlert className="w-5 h-5" /> },
                { val: allProfiles.length, label: 'Tài khoản', bg: 'bg-blue-50', border: 'border-blue-200', textVal: 'text-blue-900', textLbl: 'text-blue-600', iconBg: 'bg-blue-100 text-blue-700', icon: <Users2 className="w-5 h-5" /> },
              ].map(s => (
                <div key={s.label} className={`${s.bg} border ${s.border} p-5 rounded-2xl flex items-center gap-3 shadow-sm`}>
                  <div className={`p-2.5 ${s.iconBg} rounded-xl`}>{s.icon}</div>
                  <div><p className={`text-2xl font-black ${s.textVal}`}>{s.val}</p><p className={`text-[10px] ${s.textLbl} font-bold uppercase tracking-wider`}>{s.label}</p></div>
                </div>
              ))}
            </div>

            {/* Loans table */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ClipboardList className="text-purple-600 w-5 h-5" />Xử lý Phiếu Mượn & Trả Đồ</h3>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto"><table className="w-full text-left text-sm">
                  <thead><tr className="bg-slate-50 text-slate-500 border-b font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-4 px-4">Học sinh</th><th className="py-4 px-4">Thiết bị</th><th className="py-4 px-4 text-center">SL</th><th className="py-4 px-4">Mục đích / Hạn trả</th><th className="py-4 px-4 text-center">Hành động</th>
                  </tr></thead>
                  <tbody>
                    {loans.filter(l => l.status !== 'Đã trả').length === 0
                      ? <tr><td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-medium">Không có yêu cầu nào cần xử lý.</td></tr>
                      : loans.filter(l => l.status !== 'Đã trả').map(ln => (
                        <tr key={ln.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4"><p className="font-bold text-xs text-slate-900">{ln.user_name}</p><p className="text-[10px] text-slate-400">Lớp: {ln.class_name} | SĐT: {ln.phone}</p></td>
                          <td className="py-3 px-4 font-bold text-xs text-slate-800">{ln.device_name}</td>
                          <td className="py-3 px-4 text-center text-xs font-bold">{ln.quantity}</td>
                          <td className="py-3 px-4"><p className="text-[11px] font-semibold">{ln.return_date}</p><p className="text-[9px] text-slate-400 italic">{ln.purpose}</p></td>
                          <td className="py-3 px-4 text-center">
                            {ln.status === 'Chờ duyệt'
                              ? <><button onClick={() => approveLoan(ln.id)} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold mr-1 hover:bg-emerald-200">Duyệt</button>
                                 <button onClick={() => rejectLoan(ln.id)} className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-bold hover:bg-rose-200">Từ chối</button></>
                              : <button onClick={() => returnLoan(ln.id)} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold hover:bg-indigo-200">Duyệt Trả</button>
                            }
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table></div>
              </div>
            </div>

            {/* Reports table */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><TriangleAlert className="text-amber-500 w-5 h-5" />Báo Hỏng Thiết Bị Chờ Xử Lý</h3>
              <div className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto"><table className="w-full text-left text-sm">
                  <thead><tr className="bg-amber-50 text-amber-700 border-b border-amber-200 font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-4 px-4">Học sinh</th><th className="py-4 px-4">Thiết bị</th><th className="py-4 px-4 text-center">Mức độ</th><th className="py-4 px-4">Mô tả lỗi</th><th className="py-4 px-4">Trạng thái</th><th className="py-4 px-4 text-center">Xử lý</th>
                  </tr></thead>
                  <tbody>
                    {reports.filter(r => r.status !== 'Đã xử lý').length === 0
                      ? <tr><td colSpan={6} className="py-8 text-center text-slate-400 font-medium">Không có báo cáo nào cần xử lý.</td></tr>
                      : reports.filter(r => r.status !== 'Đã xử lý').map(r => (
                        <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4"><p className="font-bold text-xs text-slate-900">{r.reporter_name}</p><p className="text-[10px] text-slate-400">Lớp: {r.class_name}</p></td>
                          <td className="py-3 px-4 font-bold text-sm text-slate-800">{r.device_name}</td>
                          <td className="py-3 px-4 text-center"><UiSeverityBadge s={r.severity} /></td>
                          <td className="py-3 px-4 text-xs text-slate-600 max-w-[160px]">{r.description}</td>
                          <td className="py-3 px-4"><UiReportStatusBadge status={r.status} /></td>
                          <td className="py-3 px-4 text-center"><button onClick={() => resolveReport(r.id)} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold">✓ Đã xử lý</button></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table></div>
              </div>
            </div>

            {/* Users table */}
            <div className="bg-white border-2 border-rose-100 rounded-2xl overflow-hidden shadow-sm p-6 relative space-y-4">
              <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Nhạy cảm</div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Users2 className="text-rose-600 w-5 h-5" />Quản Lý Tài Khoản</h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-sm">
                  <thead><tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Email</th><th className="py-3 px-4">Họ và Tên</th><th className="py-3 px-4">Lớp</th><th className="py-3 px-4">Ngày sinh</th><th className="py-3 px-4">Role</th>
                  </tr></thead>
                  <tbody>
                    {allProfiles.length === 0
                      ? <tr><td colSpan={5} className="py-6 text-center text-slate-400 font-medium">Chưa có học sinh nào đăng ký.</td></tr>
                      : allProfiles.map(u => (
                        <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono text-xs text-slate-700">{u.id.slice(0,8)}...</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                          <td className="py-3 px-4 text-xs font-semibold uppercase">{u.class_name || '-'}</td>
                          <td className="py-3 px-4 text-xs">{u.dob ? formatDate(u.dob) : 'Không rõ'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>{u.role}</span>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400">💡 Để quản lý tài khoản chi tiết, vào <strong>Supabase Dashboard → Authentication → Users</strong></p>
            </div>

            {/* Quick actions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 mb-4"><Zap className="w-5 h-5 text-amber-500" />Thao tác nhanh</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { switchTab('co-so-vat-chat'); setTimeout(() => { setEditDevice(null); setDeviceModalOpen(true) }, 100) }}
                  className="px-4 py-2 bg-stemBlue-50 hover:bg-stemBlue-100 text-stemBlue-700 rounded-xl text-sm font-bold border border-stemBlue-100 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4" /> Nhập linh kiện mới
                </button>
                <button onClick={() => { switchTab('lich-hoc'); setTimeout(() => setScheduleModalOpen(true), 100) }}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-sm font-bold border border-teal-100 flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" /> Đăng lịch hoạt động
                </button>
                <button onClick={() => { switchTab('nhat-ky'); setTimeout(() => setJournalModalOpen(true), 100) }}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 flex items-center gap-1.5">
                  <NotebookPen className="w-4 h-4" /> Ghi nhật ký Lab
                </button>
                <button onClick={() => { switchTab('truyen-thong'); setTimeout(() => setPostModalOpen(true), 100) }}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4" /> Viết bài truyền thông
                </button>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h2 className="font-extrabold text-base">BĐQ STEM LAB <span className="text-[10px] font-bold text-pvn-400 ml-1">v3.0</span></h2>
              <p className="text-slate-400 text-xs leading-relaxed">Không gian ươm mầm tài năng sáng tạo công nghệ, lập trình, khoa học của trường THPT Bắc Đông Quan.</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">Điều hướng</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                {(['nhat-ky','bao-hong','co-so-vat-chat','kho-tai-lieu'] as Tab[]).map(t => (
                  <button key={t} onClick={() => switchTab(t)} className="text-left hover:text-white transition-colors">{t.replace(/-/g,' ')}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">Liên hệ</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Phòng STEM Lab – THPT Bắc Đông Quan</p>
              <p className="text-xs text-slate-400 mt-1">Email: stemlab.bdq@gmail.com</p>
              <p className="text-xs text-slate-400">Điện thoại: 0936984893 – Mr.Vinh</p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-6 text-center text-[11px] text-slate-500">
            © 2026 STEM LAB Bắc Đông Quan v3.0 — Thiết kế bởi: Phạm Công Vinh | Powered by Next.js + Supabase
          </div>
        </div>
      </footer>

      {/* ════════════ MODALS ════════════ */}

      {/* ── Auth Modal ── */}
      {authOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm hidden-workaround flex items-center justify-center p-4" style={{display:'flex'}}>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-lg text-slate-900">{authMode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên Lab'}</h3>
              <button onClick={() => setAuthOpen(false)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex gap-1 bg-slate-100/50 p-1 rounded-xl mb-6">
                {(['login','register'] as const).map(m => (
                  <button key={m} onClick={() => setAuthMode(m)}
                    className={`flex-1 text-center py-2 text-sm font-bold rounded-lg transition-all ${authMode===m ? 'bg-white text-stemBlue-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}>
                    {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                  </button>
                ))}
              </div>
              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email</label>
                    <input name="email" type="email" required placeholder="example@email.com" className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mật khẩu</label>
                    <input name="password" type="password" required className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500" /></div>
                  <button type="submit" className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl shadow-md">ĐĂNG NHẬP</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Họ và tên</label>
                    <input name="name" required placeholder="Nguyễn Văn A" className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stemBlue-500" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Lớp</label>
                      <input name="class" required placeholder="11A2" className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">SĐT</label>
                      <input name="phone" placeholder="0912345678" className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                  </div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email</label>
                    <input name="email" type="email" required placeholder="example@email.com" className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mật khẩu (ít nhất 6 ký tự)</label>
                    <input name="password" type="password" required minLength={6} className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ngày sinh</label>
                    <input name="dob" type="date" className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                  <button type="submit" className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl shadow-md">TẠO TÀI KHOẢN</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Device Modal ── */}
      {deviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-lg text-slate-900">{editDevice ? 'Chỉnh sửa Thiết bị' : 'Thêm Linh Kiện Mới'}</h3>
              <button onClick={() => { setDeviceModalOpen(false); setEditDevice(null) }} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleDeviceSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tên thiết bị</label>
                <input name="name" required defaultValue={editDevice?.name} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Danh mục</label>
                  <select name="category" defaultValue={editDevice?.category || 'Vi điều khiển'} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500">
                    {['Vi điều khiển','Robotics','In 3D','Đo lường','Khác'].map(c => <option key={c}>{c}</option>)}
                  </select></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mã thiết bị</label>
                  <input name="code" required defaultValue={editDevice?.code} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Số lượng kho</label>
                  <input name="total" type="number" min="0" required defaultValue={editDevice?.total ?? 0} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Khả dụng</label>
                  <input name="available" type="number" min="0" required defaultValue={editDevice?.available ?? 0} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tình trạng</label>
                  <select name="status" defaultValue={editDevice?.status || 'Tốt'} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                    <option>Tốt</option><option>Hỏng nhẹ</option><option>Hỏng nặng</option>
                  </select></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Vị trí</label>
                  <input name="description" defaultValue={editDevice?.description || ''} placeholder="Tủ A, Ngăn 1" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">URL Ảnh</label>
                <input name="image_url" type="url" defaultValue={editDevice?.image_url || ''} placeholder="https://..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <button type="submit" className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl shadow-md">
                {editDevice ? 'Cập nhật thiết bị' : 'Thêm vào hệ thống'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Schedule Modal ── */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-lg text-slate-900">Tạo Lịch Hoạt Động</h3>
              <button onClick={() => setScheduleModalOpen(false)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tên sự kiện</label>
                <input name="title" required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ngày</label>
                  <input name="date" type="date" required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Giờ</label>
                  <input name="time_range" placeholder="08:00 - 11:00" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phụ trách</label>
                <input name="instructor" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Đối tượng</label>
                <input name="target" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mô tả</label>
                <textarea name="description" rows={3} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <button type="submit" className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl">Tạo lịch</button>
            </form>
          </div>
        </div>
      )}

      {/* ── Material Modal ── */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-lg text-slate-900">Tải lên Tài liệu</h3>
              <button onClick={() => setMaterialModalOpen(false)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleMaterialSubmit} className="p-6 space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tiêu đề</label>
                <input name="title" required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Loại</label>
                  <select name="type" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                    <option value="video">Video</option><option value="pdf">PDF</option><option value="guide">Source Code / Hướng dẫn</option>
                  </select></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tác giả</label>
                  <input name="author" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mô tả</label>
                <textarea name="description" rows={2} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">URL liên kết</label>
                <input name="url" placeholder="https://drive.google.com/..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <button type="submit" className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl">Lưu tài liệu</button>
            </form>
          </div>
        </div>
      )}

      {/* ── Post Modal ── */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-lg text-slate-900">Đăng Bản Tin Mới</h3>
              <button onClick={() => setPostModalOpen(false)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handlePostSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tiêu đề</label>
                <input name="title" required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Danh mục</label>
                <select name="category" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  {['Tin tức','Dự án','Sự kiện','Thông báo'].map(c => <option key={c}>{c}</option>)}
                </select></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">URL ảnh bìa</label>
                <input name="image_url" type="url" placeholder="https://images.unsplash.com/..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nội dung</label>
                <textarea name="content" required rows={5} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <button type="submit" className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl">Đăng bài viết</button>
            </form>
          </div>
        </div>
      )}

      {/* ── Journal Modal ── */}
      {journalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-lg text-slate-900">Ghi Nhật Ký Mới</h3>
              <button onClick={() => setJournalModalOpen(false)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleJournalSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ngày</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Giờ</label>
                  <input name="time" type="time" defaultValue={new Date().toTimeString().slice(0,5)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Loại</label>
                  <select name="type" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                    {['Buổi học','Kiểm kê','Bảo trì','Sự kiện','Khác'].map(t => <option key={t}>{t}</option>)}
                  </select></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Số người tham gia</label>
                  <input name="participants" type="number" min="0" defaultValue="0" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tiêu đề</label>
                <input name="title" required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nội dung</label>
                <textarea name="content" rows={4} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Trạng thái</label>
                <select name="status" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  <option>Hoàn thành</option><option>Đang diễn ra</option>
                </select></div>
              <button type="submit" className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-bold py-3 rounded-xl">Lưu nhật ký</button>
            </form>
          </div>
        </div>
      )}

      {/* ── Report Modal ── */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2"><TriangleAlert className="w-5 h-5 text-amber-500" />Gửi Phiếu Báo Hỏng</h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chọn thiết bị bị lỗi</label>
                <select name="device_id" required className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Chọn thiết bị --</option>
                  {devices.map(d => <option key={d.id} value={d.id}>{d.name} [{d.code}]</option>)}
                </select></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mức độ hỏng</label>
                <select name="severity" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  <option>Nhẹ</option><option>Vừa</option><option>Nặng</option>
                </select></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mô tả chi tiết lỗi</label>
                <textarea name="description" required rows={4} placeholder="Mô tả triệu chứng lỗi chi tiết..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500" /></div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Gửi Báo Cáo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Full Post Modal ── */}
      {fullPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setFullPost(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">{fullPost.category}</span>
              <button onClick={() => setFullPost(null)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {fullPost.image_url && <img src={fullPost.image_url} alt="Bìa" className="w-full h-56 object-cover rounded-2xl" />}
              <h2 className="text-2xl font-black text-slate-900 leading-tight">{fullPost.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <Calendar className="w-3.5 h-3.5" />{formatDate(fullPost.published_at)} &nbsp;·&nbsp; {fullPost.author}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{fullPost.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Telegram Modal ── */}
      {tgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-sky-50">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2"><Send className="w-5 h-5 text-sky-500" />Cài đặt Telegram Bot</h3>
              <button onClick={() => setTgModalOpen(false)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bot Token</label>
                <input value={tgToken} onChange={e => setTgToken(e.target.value)} placeholder="123456789:ABCDEFG..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chat ID</label>
                <input value={tgChatId} onChange={e => setTgChatId(e.target.value)} placeholder="-100123456789" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500" /></div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={tgEnabled} onChange={e => setTgEnabled(e.target.checked)} className="w-4 h-4 accent-sky-600" />
                <span className="text-sm font-semibold text-slate-700">Bật thông báo Telegram</span>
              </label>
              <button onClick={() => {
                localStorage.setItem('tg_bot_token', tgToken)
                localStorage.setItem('tg_chat_id', tgChatId)
                localStorage.setItem('tg_enabled', String(tgEnabled))
                setTgModalOpen(false)
                showDialog('Đã lưu cài đặt', 'Cấu hình Telegram Bot đã được cập nhật.')
              }} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl">Lưu cài đặt</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
