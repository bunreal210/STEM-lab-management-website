import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type {
  Device,
  DeviceReport,
  JournalEntry,
  Loan,
  Material,
  Post,
  Schedule,
  UserProfile,
} from '@/lib/types'

export type PublicData = {
  devices: Device[]
  schedules: Schedule[]
  materials: Material[]
  posts: Post[]
  journal: JournalEntry[]
}

export type UserData = {
  profile: UserProfile | null
  loans: Loan[]
  reports: DeviceReport[]
}

export type AdminData = {
  loans: Loan[]
  reports: DeviceReport[]
  profiles: UserProfile[]
}

export async function loadPublicData(): Promise<PublicData> {
  const [devicesRes, schedulesRes, materialsRes, postsRes, journalRes] = await Promise.all([
    supabase.from('devices').select('*').order('created_at'),
    supabase.from('schedules').select('*').order('date'),
    supabase.from('materials').select('*').order('created_at'),
    supabase.from('posts').select('*').order('published_at', { ascending: false }),
    supabase.from('journal_entries').select('*').order('date', { ascending: false }),
  ])

  return {
    devices: devicesRes.data ?? [],
    schedules: schedulesRes.data ?? [],
    materials: materialsRes.data ?? [],
    posts: postsRes.data ?? [],
    journal: journalRes.data ?? [],
  }
}

export async function loadUserData(uid: string): Promise<UserData> {
  const [profileRes, loansRes, reportsRes] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('id', uid).single(),
    supabase.from('loans').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
    supabase.from('device_reports').select('*').eq('reporter_id', uid).order('created_at', { ascending: false }),
  ])

  return {
    profile: profileRes.data ?? null,
    loans: loansRes.data ?? [],
    reports: reportsRes.data ?? [],
  }
}

export async function loadAdminData(): Promise<AdminData> {
  const [loansRes, reportsRes, profilesRes] = await Promise.all([
    supabase.from('loans').select('*').order('created_at', { ascending: false }),
    supabase.from('device_reports').select('*').order('created_at', { ascending: false }),
    supabase.from('user_profiles').select('*').order('created_at'),
  ])

  return {
    loans: loansRes.data ?? [],
    reports: reportsRes.data ?? [],
    profiles: profilesRes.data ?? [],
  }
}

export async function loginUser(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function registerStudent(input: {
  email: string
  password: string
  name: string
  className: string
  dob: string
  phone: string
}) {
  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        class_name: input.className,
        dob: input.dob || null,
        phone: input.phone,
      },
    },
  })
}

export async function logoutUser() {
  return supabase.auth.signOut()
}

export async function upsertDevice(
  payload: Partial<Device> & {
    name: string
    category: string
    code: string
    total: number
    available: number
    status: string
    description: string
    image_url: string | null
  },
  editId?: string
) {
  if (editId) {
    return supabase.from('devices').update(payload).eq('id', editId)
  }
  return supabase.from('devices').insert(payload)
}

export async function deleteRow(
  table: 'devices' | 'schedules' | 'materials' | 'posts' | 'journal_entries',
  id: string
) {
  return supabase.from(table).delete().eq('id', id)
}

export async function createSchedule(input: {
  title: string
  date: string
  time_range: string | null
  instructor: string | null
  target_audience: string | null
  description: string | null
}) {
  return supabase.from('schedules').insert(input)
}

export async function createMaterial(input: {
  title: string
  type: string
  author: string | null
  description: string | null
  url: string
}) {
  return supabase.from('materials').insert(input)
}

export async function createPost(input: {
  title: string
  category: string
  content: string
  image_url: string | null
  author: string
}) {
  return supabase.from('posts').insert(input)
}

export async function createLoan(input: {
  user_id: string
  user_name: string
  class_name: string | null
  phone: string | null
  device_id: string
  device_name: string
  quantity: number
  return_date: string
  purpose: string
  status: Loan['status']
}) {
  return supabase.from('loans').insert(input)
}

export async function updateLoanStatus(id: string, status: Loan['status']) {
  return supabase.from('loans').update({ status }).eq('id', id)
}

export async function updateDeviceAvailability(id: string, available: number) {
  return supabase.from('devices').update({ available }).eq('id', id)
}

export async function createReport(input: {
  device_id: string
  device_name: string
  reporter_id: string
  reporter_name: string | null
  class_name: string | null
  severity: string
  description: string
  status: string
  admin_note: string
}) {
  return supabase.from('device_reports').insert(input)
}

export async function resolveReport(id: string, note: string) {
  return supabase.from('device_reports').update({ status: 'Đã xử lý', admin_note: note }).eq('id', id)
}

export async function sendTelegramMessage(text: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tg_bot_token') : null
  const chatId = typeof window !== 'undefined' ? localStorage.getItem('tg_chat_id') : null
  const enabled = typeof window !== 'undefined' ? localStorage.getItem('tg_enabled') === 'true' : false

  if (!enabled || !token || !chatId) return

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    })
  } catch {
    // Best-effort notification
  }
}
