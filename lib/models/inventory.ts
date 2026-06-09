export interface Device {
  id: string
  name: string
  category: string
  code: string
  total: number
  available: number
  status: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface Loan {
  id: string
  user_id: string | null
  user_name: string
  class_name: string | null
  phone: string | null
  device_id: string | null
  device_name: string
  quantity: number
  return_date: string | null
  purpose: string | null
  status: 'Chờ duyệt' | 'Đang mượn' | 'Đã trả'
  created_at: string
}

export interface DeviceReport {
  id: string
  device_id: string | null
  device_name: string
  reporter_id: string | null
  reporter_name: string | null
  class_name: string | null
  severity: string
  description: string | null
  status: string
  admin_note: string | null
  created_at: string
}
