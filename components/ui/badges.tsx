export function StatusBadge({ status }: { status: string }) {
  if (status === 'Tốt') {
    return (
      <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
        Hoạt động
      </span>
    )
  }
  if (status === 'Hỏng nhẹ') {
    return (
      <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
        Bảo trì
      </span>
    )
  }
  return (
    <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
      Hỏng
    </span>
  )
}

export function LoanBadge({ status }: { status: string }) {
  if (status === 'Chờ duyệt') {
    return <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">Chờ duyệt</span>
  }
  if (status === 'Đang mượn') {
    return <span className="rounded bg-indigo-100 px-2 py-1 text-[10px] font-bold text-indigo-700">Đang mượn</span>
  }
  return <span className="rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">Đã trả</span>
}

export function SeverityBadge({ s }: { s: string }) {
  const cls = s === 'Nặng' ? 'bg-rose-100 text-rose-700' : s === 'Vừa' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
  return <span className={`${cls} rounded px-2 py-0.5 text-[10px] font-bold`}>{s}</span>
}

export function ReportStatusBadge({ status }: { status: string }) {
  if (status === 'Đã xử lý') {
    return <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">✓ Đã xử lý</span>
  }
  return <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">⏳ Chờ xử lý</span>
}
