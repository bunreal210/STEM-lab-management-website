export type Schedule = {
  id: string
  title: string
  date: string
  time_range: string | null
  instructor: string | null
  target_audience: string | null
  description: string | null
  created_at: string
}

export type Material = {
  id: string
  title: string
  type: string
  author: string | null
  description: string | null
  url: string | null
  created_at: string
}

export type Post = {
  id: string
  title: string
  category: string | null
  author: string | null
  image_url: string | null
  content: string | null
  published_at: string
}

export type JournalEntry = {
  id: string
  date: string
  time_of_day: string | null
  type: string
  title: string
  content: string | null
  author: string | null
  participants: number
  status: string
  created_at: string
  journal_role: string | null
  author_id: string | null
  subject: string | null
  room_condition: string | null
  equipment_notes: string | null
  rating: number | null
  target_class: string | null
}

