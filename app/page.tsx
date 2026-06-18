'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Device, Schedule, Material, Post, Loan, JournalEntry, DeviceReport, UserProfile, Tab } from '@/lib/types'
import { Dialog as UiDialog } from '@/components/ui/dialog'

// Feature components
import { HomeTab } from '@/components/features/home-tab'
import { DevicesTab } from '@/components/features/devices-tab'
import { SchedulesTab } from '@/components/features/schedules-tab'
import { MaterialsTab } from '@/components/features/materials-tab'
import { PostsTab } from '@/components/features/posts-tab'
import { JournalTab } from '@/components/features/journal-tab'
import { BorrowTab } from '@/components/features/borrow-tab'
import { ReportsTab } from '@/components/features/reports-tab'
import { AdminTab } from '@/components/features/admin-tab'

// Modal components
import { AuthModal } from '@/components/modals/auth-modal'
import { DeviceModal } from '@/components/modals/device-modal'
import { ScheduleModal } from '@/components/modals/schedule-modal'
import { MaterialModal } from '@/components/modals/material-modal'
import { PostModal } from '@/components/modals/post-modal'
import { JournalModal } from '@/components/modals/journal-modal'
import { ReportModal } from '@/components/modals/report-modal'
import { FullPostModal } from '@/components/modals/full-post-modal'
import { TelegramModal } from '@/components/modals/telegram-modal'

import {
  Zap, Moon, Sun, Menu, X, ArrowLeftRight, TriangleAlert, Settings, LogOut,
  Shield, Send, Bell, PackageMinus, Users2
} from 'lucide-react'

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
  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
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

  async function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = fd.get('email') as string
    const password = fd.get('password') as string
    const name = fd.get('name') as string
    const className = (fd.get('class') as string).toUpperCase()
    const dob = fd.get('dob') as string
    const phone = fd.get('phone') as string

    // Truyền metadata vào signUp – DB trigger sẽ tự tạo profile (tránh lỗi RLS)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          class_name: className,
          dob: dob || null,
          phone,
        },
      },
    })
    if (error) { showDialog('Đăng ký thất bại', error.message, false); return }

    setAuthOpen(false)

    if (data.session) {
      // Email confirmation đang TẮT → đã đăng nhập ngay
      showDialog('Đăng ký thành công!', `Chào mừng ${name}! Tài khoản đã được tạo và đăng nhập.`)
      if (data.user) loadUserData(data.user.id)
    } else {
      // Email confirmation đang BẬT → yêu cầu xác nhận email
      showDialog(
        'Đăng ký thành công!',
        `Tài khoản của ${name} đã được tạo.\n\nVui lòng kiểm tra hộp thư email ${email} và nhấn link xác nhận để kích hoạt tài khoản.`
      )
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
      showDialog('Đã cập nhật', 'Thông tin linh kiện đã được cập nhật thành công.')
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

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300">
      
      {/* Decorative Blur Ambient Blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Dialog ── */}
      {dialog && <UiDialog title={dialog.title} msg={dialog.msg} ok={dialog.ok} onClose={() => setDialog(null)} />}

      {/* ── TOP BAR ── */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-xs py-2 px-4 text-center font-semibold flex items-center justify-center gap-2">
        <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
        Chương trình STEM INNOVATION PETROVIETNAM được tài trợ bởi Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam
      </div>

      {/* ── HEADER ── */}
      <header className="bg-white/85 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-40 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-5 cursor-pointer" onClick={() => switchTab('trang-chu')}>
            <div className="flex items-center gap-1.5 md:gap-3 border-r border-slate-200 pr-2 md:pr-5">
              <div className="w-9 h-9 md:w-11 md:h-11 bg-white rounded-xl shadow-sm border border-slate-100 p-0.5">
                <img src="/assets/images/logo-bdq.jpg" alt="BDQ" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
              </div>
              <div className="w-9 h-9 md:w-11 md:h-11 bg-white rounded-xl shadow-sm border border-slate-100 p-0.5">
                <img src="/assets/images/logo-pvn.png" alt="PVN" className="w-full h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
              </div>
            </div>
            <div className="leading-tight">
              <h1 className="font-black text-sm md:text-lg text-indigo-950 tracking-tight">STEM LABORATORY</h1>
              <div className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest">THPT Bắc Đông Quan</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {([
              ['trang-chu','Trang chủ'],['co-so-vat-chat','Kho Thiết bị'],
              ['lich-hoc','Lịch hoạt động'],['kho-tai-lieu','Thư viện số'],
              ['truyen-thong','Tin tức'],['nhat-ky','Nhật ký Lab'],
            ] as [Tab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => switchTab(t)}
                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${tab===t ? 'text-stemBlue-700 bg-stemBlue-50/80 border border-stemBlue-100' : 'text-slate-600 border border-transparent hover:bg-slate-50'}`}>
                {label}
              </button>
            ))}
            {authUser && <>
              <button onClick={() => switchTab('muon-tra')}
                className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${tab==='muon-tra' ? 'bg-stemBlue-50 text-stemBlue-700 border-stemBlue-200' : 'bg-white/50 border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                Mượn thiết bị
              </button>
              <button onClick={() => switchTab('bao-hong')}
                className={`px-3 py-2 rounded-xl text-sm font-bold border flex items-center gap-1.5 transition-all ${tab==='bao-hong' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white/50 border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                <TriangleAlert className="w-4 h-4 text-amber-500" /> Báo lỗi
              </button>
            </>}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-all">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {isAdmin && (
              <button onClick={() => switchTab('admin-panel')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-1.5 shadow-md">
                <Settings className="w-4 h-4" /> Quản trị
              </button>
            )}

            {!authUser ? (
              <div className="flex items-center gap-1.5">
                <button onClick={() => { setAuthMode('login'); setAuthOpen(true) }}
                  className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-bold transition">Đăng nhập</button>
                <button onClick={() => { setAuthMode('register'); setAuthOpen(true) }}
                  className="hidden sm:inline-block bg-stemBlue-600 hover:bg-stemBlue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition">Đăng ký</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/50 py-1.5 px-3.5 rounded-full shadow-inner">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    {profile?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-black text-slate-800 leading-none truncate max-w-[100px]">{profile?.name || 'User'}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition" title="Đăng xuất">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg animate-fade-in">
            {([['trang-chu','Trang chủ'],['co-so-vat-chat','Kho Thiết bị'],['lich-hoc','Lịch hoạt động'],['kho-tai-lieu','Thư viện số'],['truyen-thong','Tin tức'],['nhat-ky','Nhật ký Lab']] as [Tab,string][]).map(([t,label]) => (
              <button key={t} onClick={() => switchTab(t)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${tab === t ? 'bg-indigo-50/50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                {label}
              </button>
            ))}
            {authUser && <>
              <button onClick={() => switchTab('muon-tra')} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-stemBlue-600 bg-stemBlue-50 border border-stemBlue-100 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" /> Đăng ký Mượn/Trả
              </button>
              <button onClick={() => switchTab('bao-hong')} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 flex items-center gap-2">
                <TriangleAlert className="w-4 h-4" /> Báo hỏng Thiết bị
              </button>
            </>}
          </div>
        )}
      </header>

      {/* ── MAIN CONTENT TAB ROUTER ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {tab === 'trang-chu' && (
          <HomeTab
            devicesCount={devices.length}
            schedulesCount={schedules.length}
            materialsCount={materials.length}
            profilesCount={allProfiles.length}
            switchTab={switchTab}
            authUser={authUser}
            setAuthOpen={setAuthOpen}
            setAuthMode={setAuthMode}
          />
        )}

        {tab === 'co-so-vat-chat' && (
          <DevicesTab
            filteredDevices={filteredDevices}
            deviceSearch={deviceSearch}
            setDeviceSearch={setDeviceSearch}
            deviceCat={deviceCat}
            setDeviceCat={setDeviceCat}
            loading={loading}
            isAdmin={isAdmin}
            authUser={authUser}
            setAuthOpen={setAuthOpen}
            setAuthMode={setAuthMode}
            setDeviceModalOpen={setDeviceModalOpen}
            setEditDevice={setEditDevice}
            deleteDevice={deleteDevice}
            switchTab={switchTab}
          />
        )}

        {tab === 'lich-hoc' && (
          <SchedulesTab
            schedules={schedules}
            isAdmin={isAdmin}
            setScheduleModalOpen={setScheduleModalOpen}
            deleteSchedule={deleteSchedule}
          />
        )}

        {tab === 'kho-tai-lieu' && (
          <MaterialsTab
            filteredMaterials={filteredMaterials}
            matFilter={matFilter}
            setMatFilter={setMatFilter}
            isAdmin={isAdmin}
            setMaterialModalOpen={setMaterialModalOpen}
            deleteMaterial={deleteMaterial}
          />
        )}

        {tab === 'truyen-thong' && (
          <PostsTab
            posts={posts}
            isAdmin={isAdmin}
            setPostModalOpen={setPostModalOpen}
            setFullPost={setFullPost}
            deletePost={deletePost}
          />
        )}

        {tab === 'nhat-ky' && (
          <JournalTab
            journal={journal}
            filteredJournal={filteredJournal}
            jnThisMonth={jnThisMonth}
            jnParticipants={jnParticipants}
            jnFilter={jnFilter}
            setJnFilter={setJnFilter}
            isAdmin={isAdmin}
            setJournalModalOpen={setJournalModalOpen}
            deleteJournal={deleteJournal}
          />
        )}

        {tab === 'bao-hong' && (
          <ReportsTab
            myReports={myReports}
            setReportModalOpen={setReportModalOpen}
            authUser={authUser}
            setAuthOpen={setAuthOpen}
          />
        )}

        {tab === 'muon-tra' && (
          <BorrowTab
            profile={profile}
            devices={devices}
            myLoans={myLoans}
            onSubmitBorrow={handleBorrowSubmit}
          />
        )}

        {tab === 'admin-panel' && isAdmin && (
          <AdminTab
            pendingLoans={pendingLoans}
            activeLoans={activeLoans}
            pendingReports={pendingReports}
            allProfilesCount={allProfiles.length}
            loans={loans}
            reports={reports}
            allProfiles={allProfiles}
            setTgModalOpen={setTgModalOpen}
            approveLoan={approveLoan}
            rejectLoan={rejectLoan}
            returnLoan={returnLoan}
            resolveReport={resolveReport}
            switchTab={switchTab}
            setEditDevice={setEditDevice}
            setDeviceModalOpen={setDeviceModalOpen}
            setScheduleModalOpen={setScheduleModalOpen}
            setJournalModalOpen={setJournalModalOpen}
            setPostModalOpen={setPostModalOpen}
          />
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h2 className="font-extrabold text-base">BĐQ STEM LAB <span className="text-[10px] font-bold text-sky-400 ml-1">v2.1</span></h2>
              <p className="text-slate-400 text-xs leading-relaxed">Không gian học tập, sáng tạo và khám phá hàng đầu dành cho học sinh trường THPT Bắc Đông Quan.</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">Danh mục chính</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                {(['nhat-ky','bao-hong','co-so-vat-chat','kho-tai-lieu'] as Tab[]).map(t => (
                  <button key={t} onClick={() => switchTab(t)} className="text-left hover:text-white transition-colors capitalize">{t}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">Thông tin liên hệ</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Phòng Thực Hành STEM - Trường THPT Bắc Đông Quan</p>
              <p className="text-xs text-slate-400 mt-1">Email: stemlab.bdq@gmail.com</p>
              <p className="text-xs text-slate-400">Điện Thoại Liên Hệ: 0984552238 Mrs. Thanh</p>
            </div>
          </div>
          <div className="border-t border-slate-800/80 mt-8 pt-6 text-center text-[11px] text-slate-500">
            © 2026 STEM Laboratory Management Website. Bản quyền thuộc về nhóm phát triển. <br className="sm:hidden" />
            Thiết kế bởi <a href="https://www.facebook.com/bunreal210" target="_blank" className="text-slate-400 hover:text-slate-200 transition-colors">Phạm Công Vinh</a>.
          </div>
          
        </div>
      </footer>

      {/* ════════════ OVERLAY MODALS ════════════ */}
      
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onSubmitLogin={handleLoginSubmit}
        onSubmitRegister={handleRegisterSubmit}
      />

      <DeviceModal
        isOpen={deviceModalOpen}
        onClose={() => { setDeviceModalOpen(false); setEditDevice(null) }}
        editDevice={editDevice}
        onSubmit={handleDeviceSubmit}
      />

      <ScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSubmit={handleScheduleSubmit}
      />

      <MaterialModal
        isOpen={materialModalOpen}
        onClose={() => setMaterialModalOpen(false)}
        onSubmit={handleMaterialSubmit}
      />

      <PostModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        onSubmit={handlePostSubmit}
      />

      <JournalModal
        isOpen={journalModalOpen}
        onClose={() => setJournalModalOpen(false)}
        onSubmit={handleJournalSubmit}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        devices={devices}
        onSubmit={handleReportSubmit}
      />

      <FullPostModal
        post={fullPost}
        onClose={() => setFullPost(null)}
      />

      <TelegramModal
        isOpen={tgModalOpen}
        onClose={() => setTgModalOpen(false)}
        tgToken={tgToken}
        setTgToken={setTgToken}
        tgChatId={tgChatId}
        setTgChatId={setTgChatId}
        tgEnabled={tgEnabled}
        setTgEnabled={setTgEnabled}
        onSave={() => {
          localStorage.setItem('tg_bot_token', tgToken)
          localStorage.setItem('tg_chat_id', tgChatId)
          localStorage.setItem('tg_enabled', String(tgEnabled))
          setTgModalOpen(false)
          showDialog('Cài đặt thành công', 'Cấu hình cảnh báo Telegram Bot đã được cập nhật thành công.')
        }}
      />

    </div>
  )
}
