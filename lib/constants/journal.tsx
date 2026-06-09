import type { ReactNode } from 'react'
import { BookOpen, ClipboardList, FileText, Star, Wrench } from 'lucide-react'

export const JOURNAL_ICONS: Record<string, { icon: ReactNode; color: string }> = {
  'Buổi học': { icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  'Kiểm kê': { icon: <ClipboardList className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  'Bảo trì': { icon: <Wrench className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  'Sự kiện': { icon: <Star className="w-5 h-5" />, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  'Khác': { icon: <FileText className="w-5 h-5" />, color: 'text-slate-600 bg-slate-50 border-slate-200' },
}
