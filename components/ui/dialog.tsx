'use client'

import { AlertCircle, CheckCircle } from 'lucide-react'

export function Dialog({
  title,
  msg,
  ok,
  onClose,
}: {
  title: string
  msg: string
  ok: boolean
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
            ok ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
          }`}
        >
          {ok ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
        </div>
        <h3 className="text-center text-lg font-extrabold text-slate-900">{title}</h3>
        <p className="whitespace-pre-line text-center text-sm text-slate-500">{msg}</p>
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-stemBlue-600 py-2.5 font-bold text-white transition hover:bg-stemBlue-700"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}
