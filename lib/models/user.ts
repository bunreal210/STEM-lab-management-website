export interface UserProfile {
  id: string
  name: string | null
  class_name: string | null
  dob: string | null
  role: 'admin' | 'student'
  phone: string | null
  created_at: string
}
