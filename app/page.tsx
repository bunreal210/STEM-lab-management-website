'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Device, Schedule, Material, Post, Loan, JournalEntry, DeviceReport, UserProfile, Tab } from '@/lib/types'
import { Dialog as UiDialog } from '@/components/ui/dialog'

// Layout components
import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'

// Feature components
import { HomeTab } from '@/components/features/home-tab'
import { DevicesTab } from '@/components/features/devices-tab'
import { SchedulesTab } from '@/components/features/schedules-tab'
import { MaterialsTab } from '@/components/features/materials-tab'
import { JournalTab } from '@/components/features/journal-tab'
import { BorrowTab } from '@/components/features/borrow-tab'
import { ReportsTab } from '@/components/features/reports-tab'
import { AdminTab } from '@/components/features/admin-tab'
import { ProfileTab } from '@/components/features/profile-tab'

// Modal components
import { AuthModal } from '@/components/modals/auth-modal'
import { DeviceModal } from '@/components/modals/device-modal'
import { ScheduleModal } from '@/components/modals/schedule-modal'
import { MaterialModal } from '@/components/modals/material-modal'
import { JournalModal } from '@/components/modals/journal-modal'
import { ReportModal } from '@/components/modals/report-modal'
import { NotificationModal } from '@/components/modals/notification-modal'
import { CompleteProfileModal } from '@/components/modals/complete-profile-modal'
import { sendNotification, notifyStudent } from '@/lib/services/notifications'

export default function App() {
  // ── Auth state
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // ── Data state
  const [devices, setDevices]         = useState<Device[]>([])
  const [schedules, setSchedules]     = useState<Schedule[]>([])
  const [materials, setMaterials]     = useState<Material[]>([])
  const [loans, setLoans]             = useState<Loan[]>([])
  const [journal, setJournal]         = useState<JournalEntry[]>([])
  const [reports, setReports]         = useState<DeviceReport[]>([])

  // ── UI state
  const [tab, setTab]                 = useState<Tab>('trang-chu')
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [dialog, setDialog]           = useState<{ title: string; msg: string; ok: boolean } | null>(null)
  const [loading, setLoading]         = useState(true)

  // ── Filter state
  const [deviceSearch, setDeviceSearch] = useState('')
  const [deviceCat, setDeviceCat]       = useState('all')
  const [matFilter, setMatFilter]       = useState('all')
  const [journalTab, setJournalTab]     = useState<'hoc-sinh' | 'giao-vien' | 'quan-tri'>('hoc-sinh')

  // ── Modal state
  const [authMode, setAuthMode]         = useState<'login' | 'register'>('login')
  const [authOpen, setAuthOpen]         = useState(false)
  const [deviceModalOpen, setDeviceModalOpen] = useState(false)
  const [editDevice, setEditDevice]     = useState<Device | null>(null)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [materialModalOpen, setMaterialModalOpen] = useState(false)
  const [journalModalOpen, setJournalModalOpen]     = useState(false)
  const [reportModalOpen, setReportModalOpen]       = useState(false)
  const [notificationModalOpen, setNotificationModalOpen] = useState(false)

  // ─── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    localStorage.removeItem('darkMode')

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
    const [devRes, scRes, matRes, jnRes] = await Promise.all([
      supabase.from('devices').select('*').order('created_at'),
      supabase.from('schedules').select('*').order('date'),
      supabase.from('materials').select('*').order('created_at'),
      supabase.from('journal_entries').select('*').order('date', { ascending: false }),
    ])
    if (devRes.data)  setDevices(devRes.data)
    if (scRes.data)   setSchedules(scRes.data)
    if (matRes.data)  setMaterials(matRes.data)
    if (jnRes.data)   setJournal(jnRes.data)
    setLoading(false)
  }

  const loadUserData = async (uid: string) => {
    const [profRes, loansRes, repRes] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', uid).maybeSingle(),
      supabase.from('loans').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('device_reports').select('*').eq('reporter_id', uid).order('created_at', { ascending: false }),
    ])
    if (profRes.data) {
      setProfile(profRes.data)
      // Tự động đồng bộ email vào user_profiles
      const sessionUser = authUser
      if (sessionUser && sessionUser.id === uid && (!profRes.data.email || profRes.data.email !== sessionUser.email)) {
        const emailVal = sessionUser.email || ''
        await supabase.from('user_profiles').update({ email: emailVal }).eq('id', uid)
        setProfile({ ...profRes.data, email: emailVal })
      }
    } else {
      // Tự động khởi tạo profile cho người dùng OAuth lần đầu đăng nhập
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.id === uid) {
        const meta = user.user_metadata || {}
        const fallbackName = meta.full_name || meta.name || meta.user_name || user.email?.split('@')[0] || 'Thành viên Lab'
        const newProf: UserProfile = {
          id: user.id,
          name: fallbackName,
          role: 'student',
          class_name: 'Chưa cập nhật',
          phone: '',
          dob: null,
          email: user.email || '',
          created_at: new Date().toISOString(),
        }
        await supabase.from('user_profiles').upsert(newProf)
        setProfile(newProf)
      }
    }
    if (loansRes.data) setLoans(loansRes.data)
    if (repRes.data) setReports(repRes.data)
  }

  const updateProfile = async (name: string, class_name: string, phone: string, dob: string) => {
    if (!authUser) return
    const { error } = await supabase
      .from('user_profiles')
      .update({ name, class_name, phone, dob: dob || null })
      .eq('id', authUser.id)
    if (error) throw error
    await loadUserData(authUser.id)
  }

  const loadAdminData = useCallback(async () => {
    const [loansRes, repRes] = await Promise.all([
      supabase.from('loans').select('*').order('created_at', { ascending: false }),
      supabase.from('device_reports').select('*').order('created_at', { ascending: false }),
    ])
    if (loansRes.data) setLoans(loansRes.data)
    if (repRes.data)   setReports(repRes.data)
  }, [])

  const isAdmin = profile?.role === 'admin'

  function showDialog(title: string, msg: string, ok = true) {
    setDialog({ title, msg, ok })
  }

  function switchTab(t: Tab) {
    setTab(t)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (t === 'trang-ca-nhan' && (isAdmin || profile?.role === 'teacher')) loadAdminData()
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

  async function handleOAuthLogin(provider: 'google' | 'facebook' | 'github') {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      })
      if (error) {
        showDialog('Đăng nhập thất bại', error.message, false)
      }
    } catch (err: any) {
      showDialog('Lỗi kết nối', err?.message || 'Không thể kết nối đến nhà cung cấp dịch vụ.', false)
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
    const title = fd.get('title') as string
    const date = fd.get('date') as string
    const timeRange = fd.get('time_range') as string
    const instructor = (fd.get('instructor') as string) || profile?.name || 'Chưa phân công'
    const target = fd.get('target') as string
    const description = fd.get('description') as string

    const { error } = await supabase.from('schedules').insert({
      title, date, time_range: timeRange, instructor,
      target_audience: target, description,
    })
    if (error) { showDialog('Lỗi', error.message, false); return }
    setScheduleModalOpen(false)
    showDialog('Xong', 'Đã thêm lịch hoạt động mới.')
    
    sendNotification('schedule_created', {
      title: '📅 Lịch hoạt động STEM mới',
      details: {
        'Nội dung': title,
        'Ngày': date,
        'Thời gian': timeRange,
        'Giáo viên phụ trách': instructor,
        'Đối tượng': target,
      },
      note: description,
    })
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
      purpose: fd.get('purpose') as string, status: 'Chờ duyệt' as const,
    }
    const { error } = await supabase.from('loans').insert(loan)
    if (error) { showDialog('Lỗi', error.message, false); return }

    showDialog('Đăng ký thành công', 'Phiếu mượn đã gửi cho Admin. Vui lòng chờ phê duyệt.')
    
    sendNotification('borrow_request', {
      title: '📦 Yêu cầu mượn thiết bị mới',
      details: {
        'Học sinh / Giáo viên': `${profile.name} (${profile.class_name || 'Lab User'})`,
        'Số điện thoại': profile.phone || 'Chưa cập nhật',
        'Thiết bị': dev.name,
        'Số lượng mượn': `${qty} cái/bộ`,
        'Hạn hẹn trả': loan.return_date,
      },
      note: loan.purpose,
    })

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

    sendNotification('borrow_approved', {
      title: '✅ Đã duyệt phiếu mượn thiết bị',
      details: {
        'Người mượn': ln.user_name,
        'Thiết bị bàn giao': `${ln.device_name} (x${ln.quantity})`,
        'Người phê duyệt': profile?.name || 'Admin',
      },
    })

    // Gửi thông báo trực tiếp đến học sinh qua Email và Zalo (tự động bỏ qua nếu không có Email/SĐT)
    if (ln.user_id) {
      supabase.from('user_profiles').select('email, phone, name').eq('id', ln.user_id).maybeSingle().then(({ data: stProf }) => {
        if (stProf) {
          notifyStudent(
            stProf,
            '✅ Yêu cầu mượn thiết bị đã được duyệt',
            `Yêu cầu mượn thiết bị "${ln.device_name}" của bạn đã được ban quản trị phê duyệt thành công. Vui lòng đến nhận thiết bị tại phòng Lab.`,
            {
              'Người nhận': ln.user_name,
              'Thiết bị bàn giao': `${ln.device_name} (x${ln.quantity})`,
              'Ngày mượn': new Date(ln.created_at).toLocaleDateString('vi-VN'),
              'Hạn trả': ln.return_date ? new Date(ln.return_date).toLocaleDateString('vi-VN') : 'Không quy định',
              'Mục đích': ln.purpose || 'Không ghi rõ',
            }
          )
        }
      })
    }

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

    sendNotification('borrow_returned', {
      title: '🔄 Đã thu hồi / Hoàn trả thiết bị',
      details: {
        'Người trả': ln.user_name,
        'Thiết bị': `${ln.device_name} (x${ln.quantity})`,
        'Trạng thái kho': 'Đã hoàn tất nhập kho an toàn',
        'Người tiếp nhận': profile?.name || 'Admin',
      },
    })

    // Gửi thông báo hoàn trả thành công trực tiếp đến học sinh qua Email và Zalo (tự động bỏ qua nếu không có Email/SĐT)
    if (ln.user_id) {
      supabase.from('user_profiles').select('email, phone, name').eq('id', ln.user_id).maybeSingle().then(({ data: stProf }) => {
        if (stProf) {
          notifyStudent(
            stProf,
            '🔄 Xác nhận hoàn trả thiết bị thành công',
            `Thiết bị "${ln.device_name}" bạn mượn đã được hoàn trả về kho và được kiểm duyệt thành công bởi ban quản trị. Phiếu mượn đã hoàn thành.`,
            {
              'Người trả': ln.user_name,
              'Thiết bị hoàn trả': `${ln.device_name} (x${ln.quantity})`,
              'Ngày xác nhận': new Date().toLocaleDateString('vi-VN'),
              'Trạng thái kho': 'Đã hoàn trả và nhập kho an toàn',
            }
          )
        }
      })
    }

    loadAdminData(); loadPublicData()
  }

  // ─── JOURNAL (v3.0 — phân quyền theo vai trò) ──────────────────────────────
  async function handleJournalSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const journalRole = fd.get('journal_role') as string || journalTab
    const entry: Record<string, unknown> = {
      date: fd.get('date') as string,
      time_of_day: fd.get('time') as string,
      type: journalRole === 'hoc-sinh' ? 'Buổi học' : journalRole === 'giao-vien' ? 'Đánh giá' : 'Kiểm kê',
      title: fd.get('title') as string,
      content: fd.get('content') as string,
      author: profile?.name || 'Unknown',
      author_id: authUser?.id || null,
      participants: parseInt(fd.get('participants') as string) || 0,
      status: 'Hoàn thành',
      journal_role: journalRole,
      subject: (fd.get('subject') as string) || null,
      room_condition: (fd.get('room_condition') as string) || null,
      equipment_notes: (fd.get('equipment_notes') as string) || null,
      rating: fd.get('rating') ? parseInt(fd.get('rating') as string) : null,
      target_class: (fd.get('target_class') as string) || null,
    }
    const { error } = await supabase.from('journal_entries').insert(entry)
    if (error) { showDialog('Lỗi', error.message, false); return }
    setJournalModalOpen(false)
    showDialog('Đã ghi nhật ký', 'Nhật ký hoạt động đã được lưu thành công.')
    
    const roleLabel = journalRole === 'hoc-sinh' ? 'Học sinh' : journalRole === 'giao-vien' ? 'Giáo viên' : 'Quản trị viên'
    sendNotification('journal_created', {
      title: `📓 Nhật ký phòng Lab mới (${roleLabel})`,
      details: {
        'Chủ đề': entry.title as string,
        'Ngày thực hiện': entry.date as string,
        'Thời gian': entry.time_of_day as string,
        'Người thực hiện': entry.author as string,
        'Lớp / Đối tượng': entry.target_class as string,
        'Môn học': entry.subject as string,
      },
      note: entry.content as string,
    })

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

    sendNotification('report_created', {
      title: '🚨 Báo hỏng / Sự cố thiết bị',
      details: {
        'Người báo': `${profile.name} (${profile.class_name || 'Lab User'})`,
        'Thiết bị sự cố': dev?.name || 'Không xác định',
        'Mức độ': rpt.severity,
      },
      note: rpt.description,
    })

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

  const filteredDevices = devices.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(deviceSearch.toLowerCase()) || d.code.toLowerCase().includes(deviceSearch.toLowerCase())
    const matchCat = deviceCat === 'all' || d.category === deviceCat
    return matchSearch && matchCat
  })
  const filteredMaterials = matFilter === 'all' ? materials : materials.filter(m => m.type === matFilter)
  const myLoans   = loans.filter(l => l.user_id === authUser?.id)
  const myReports = reports.filter(r => r.reporter_id === authUser?.id)

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300">
      
      {/* Decorative Blur Ambient Blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Dialog ── */}
      {dialog && <UiDialog title={dialog.title} msg={dialog.msg} ok={dialog.ok} onClose={() => setDialog(null)} />}

      {/* ── HEADER ── */}
      <AppHeader
        tab={tab}
        authUser={authUser}
        profile={profile}
        mobileOpen={mobileOpen}
        isAdmin={isAdmin}
        onSwitchTab={switchTab}
        onLogout={handleLogout}
        onOpenAuth={(mode) => {
          setAuthMode(mode)
          setAuthOpen(true)
        }}
        onToggleMobile={() => setMobileOpen(!mobileOpen)}
      />

      {/* ── MAIN CONTENT TAB ROUTER ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {tab === 'trang-chu' && (
          <HomeTab
            devicesCount={devices.length}
            schedulesCount={schedules.length}
            materialsCount={materials.length}
            profilesCount={0}
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

        {tab === 'nhat-ky' && (
          <JournalTab
            journal={journal}
            isAdmin={isAdmin}
            profile={profile}
            authUser={authUser}
            setJournalModalOpen={setJournalModalOpen}
            deleteJournal={deleteJournal}
            activeJournalTab={journalTab}
            setActiveJournalTab={setJournalTab}
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

        {tab === 'trang-ca-nhan' && (
          <ProfileTab
            profile={profile}
            authUser={authUser}
            loans={loans}
            reports={reports}
            journal={journal}
            schedules={schedules}
            devices={devices}
            onUpdateProfile={updateProfile}
            pendingLoans={pendingLoans}
            activeLoans={activeLoans}
            pendingReports={pendingReports}
            setNotificationModalOpen={setNotificationModalOpen}
            approveLoan={approveLoan}
            rejectLoan={rejectLoan}
            returnLoan={returnLoan}
            resolveReport={resolveReport}
            switchTab={switchTab}
            setEditDevice={setEditDevice}
            setDeviceModalOpen={setDeviceModalOpen}
            setScheduleModalOpen={setScheduleModalOpen}
            setJournalModalOpen={setJournalModalOpen}
          />
        )}
      </main>

      {/* ── FOOTER ── */}
      <AppFooter onSwitchTab={switchTab} />

      {/* ════════════ OVERLAY MODALS ════════════ */}
      
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onSubmitLogin={handleLoginSubmit}
        onSubmitRegister={handleRegisterSubmit}
        onOAuthLogin={handleOAuthLogin}
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

      <JournalModal
        isOpen={journalModalOpen}
        onClose={() => setJournalModalOpen(false)}
        onSubmit={handleJournalSubmit}
        userRole={profile?.role || 'student'}
        activeJournalTab={journalTab}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        devices={devices}
        onSubmit={handleReportSubmit}
      />

      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        onSaved={() => showDialog('Cài đặt thành công', 'Cấu hình thông báo đa kênh đã được lưu thành công.')}
      />

      <CompleteProfileModal
        isOpen={Boolean(authUser && profile && (profile.class_name === 'Chưa cập nhật' || !profile.phone || profile.phone.trim() === ''))}
        currentName={profile?.name || 'Thành viên'}
        onSubmit={async (className, phone, dob) => {
          await updateProfile(profile?.name || 'Thành viên', className, phone, dob)
        }}
      />

    </div>
  )
}
