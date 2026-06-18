'use client'

import { X, Send } from 'lucide-react'

interface TelegramModalProps {
  isOpen: boolean
  onClose: () => void
  tgToken: string
  setTgToken: (val: string) => void
  tgChatId: string
  setTgChatId: (val: string) => void
  tgEnabled: boolean
  setTgEnabled: (val: boolean) => void
  onSave: () => void
}

export function TelegramModal({
  isOpen,
  onClose,
  tgToken,
  setTgToken,
  tgChatId,
  setTgChatId,
  tgEnabled,
  setTgEnabled,
  onSave,
}: TelegramModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-sky-50/80">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-sky-500" />
            Cài đặt Telegram Bot
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bot Token</label>
            <input
              value={tgToken}
              onChange={(e) => setTgToken(e.target.value)}
              placeholder="123456789:ABCDEFG..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chat ID</label>
            <input
              value={tgChatId}
              onChange={(e) => setTgChatId(e.target.value)}
              placeholder="-100123456789"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={tgEnabled}
              onChange={(e) => setTgEnabled(e.target.checked)}
              className="w-4 h-4 accent-sky-600 rounded"
            />
            <span className="text-sm font-semibold text-slate-700">Bật thông báo Telegram</span>
          </label>
          <button
            onClick={onSave}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl shadow-md transition"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  )
}
