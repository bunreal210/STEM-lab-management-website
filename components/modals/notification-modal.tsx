'use client'

import { useState, useEffect } from 'react'
import {
  X,
  Bell,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Gamepad2,
  Globe,
  Monitor,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  getNotificationConfig,
  saveNotificationConfig,
  testNotificationChannel,
  type NotificationConfig,
  DEFAULT_NOTIFICATION_CONFIG,
} from '@/lib/services/notifications'

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
}

type TabType = 'telegram' | 'discord' | 'zalo' | 'browser' | 'customWebhook' | 'events'

export function NotificationModal({
  isOpen,
  onClose,
  onSaved,
}: NotificationModalProps) {
  const [config, setConfig] = useState<NotificationConfig>(DEFAULT_NOTIFICATION_CONFIG)
  const [activeTab, setActiveTab] = useState<TabType>('telegram')
  const [testingChannel, setTestingChannel] = useState<TabType | null>(null)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (isOpen) {
      setConfig(getNotificationConfig())
      setTestResult(null)
      setSavedSuccess(false)
      setShowGuide(false)
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setBrowserPermission(Notification.permission)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    saveNotificationConfig(config)
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      onSaved?.()
      onClose()
    }, 700)
  }

  const handleTest = async (channel: 'telegram' | 'discord' | 'zalo' | 'browser' | 'customWebhook') => {
    setTestingChannel(channel)
    setTestResult(null)
    const res = await testNotificationChannel(channel, config)
    setTestingChannel(null)
    setTestResult(res)
    if (channel === 'browser' && typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission)
    }
  }

  const handleRequestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission()
      setBrowserPermission(permission)
      if (permission === 'granted') {
        setConfig({
          ...config,
          browser: { enabled: true },
        })
        setTestResult({ success: true, message: 'Đã cấp quyền thông báo trình duyệt!' })
      } else {
        setTestResult({ success: false, message: 'Chưa được cấp quyền trên trình duyệt.' })
      }
    }
  }

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string; enabled?: boolean }> = [
    { id: 'telegram', label: 'Telegram', icon: Send, color: 'text-sky-500', enabled: config.telegram.enabled },
    { id: 'discord', label: 'Discord', icon: Gamepad2, color: 'text-indigo-500', enabled: config.discord.enabled },
    { id: 'zalo', label: 'Zalo', icon: MessageSquare, color: 'text-blue-500', enabled: config.zalo.enabled },
    { id: 'browser', label: 'Trình duyệt', icon: Monitor, color: 'text-emerald-500', enabled: config.browser.enabled },
    { id: 'customWebhook', label: 'Webhook', icon: Globe, color: 'text-amber-500', enabled: config.customWebhook.enabled },
    { id: 'events', label: 'Sự kiện', icon: ShieldCheck, color: 'text-purple-500' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scale-in flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              Cài đặt Thông báo Đa kênh
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Tab Pills */}
        <div className="flex border-b border-slate-100 bg-slate-50/40 p-2 gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tb) => {
            const Icon = tb.icon
            const isActive = activeTab === tb.id
            return (
              <button
                key={tb.id}
                onClick={() => { setActiveTab(tb.id); setTestResult(null); setShowGuide(false) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tb.color}`} />
                {tb.label}
                {tb.enabled !== undefined && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      tb.enabled ? (isActive ? 'bg-white' : 'bg-emerald-500') : 'bg-transparent'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-slate-800 text-xs sm:text-sm">
          
          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
              <button
                onClick={() => setTestResult(null)}
                className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* 1. TELEGRAM TAB */}
          {activeTab === 'telegram' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between p-3 bg-sky-50/70 rounded-xl border border-sky-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-500" /> Bật thông báo Telegram
                </span>
                <input
                  type="checkbox"
                  checked={config.telegram.enabled}
                  onChange={(e) => setConfig({
                    ...config,
                    telegram: { ...config.telegram, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Bot Token</label>
                <input
                  type="text"
                  value={config.telegram.botToken}
                  onChange={(e) => setConfig({
                    ...config,
                    telegram: { ...config.telegram, botToken: e.target.value }
                  })}
                  placeholder="Ví dụ: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Chat ID / Group ID</label>
                <input
                  type="text"
                  value={config.telegram.chatId}
                  onChange={(e) => setConfig({
                    ...config,
                    telegram: { ...config.telegram, chatId: e.target.value }
                  })}
                  placeholder="Ví dụ: -100123456789 hoặc 987654321"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              {/* Collapsible Quick Guide */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="w-full px-3 py-1.5 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-sky-500" /> Hướng dẫn lấy Token & Chat ID
                  </span>
                  {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showGuide && (
                  <div className="p-3 text-[11px] text-slate-600 bg-white space-y-1 leading-relaxed border-t border-slate-100">
                    <p>1. Chat với <b>@BotFather</b> &rarr; gửi <code>/newbot</code> lấy <b>Bot Token</b>.</p>
                    <p>2. Thêm Bot vào nhóm &rarr; thêm <b>@userinfobot</b> vào nhóm để xem <b>Chat ID</b>.</p>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  disabled={testingChannel === 'telegram'}
                  onClick={() => handleTest('telegram')}
                  className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {testingChannel === 'telegram' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Gửi thử nghiệm Telegram
                </button>
              </div>
            </div>
          )}

          {/* 2. DISCORD TAB */}
          {activeTab === 'discord' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-indigo-500" /> Bật thông báo Discord Webhook
                </span>
                <input
                  type="checkbox"
                  checked={config.discord.enabled}
                  onChange={(e) => setConfig({
                    ...config,
                    discord: { ...config.discord, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Discord Webhook URL</label>
                <input
                  type="url"
                  value={config.discord.webhookUrl}
                  onChange={(e) => setConfig({
                    ...config,
                    discord: { ...config.discord, webhookUrl: e.target.value }
                  })}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Collapsible Quick Guide */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="w-full px-3 py-1.5 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Cách lấy Webhook URL Discord
                  </span>
                  {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showGuide && (
                  <div className="p-3 text-[11px] text-slate-600 bg-white space-y-1 leading-relaxed border-t border-slate-100">
                    <p>1. Chuột phải kênh chat Discord &rarr; <b>Edit Channel (Chỉnh sửa kênh)</b>.</p>
                    <p>2. Chọn <b>Integrations (Tích hợp)</b> &rarr; <b>Webhooks</b> &rarr; <b>New Webhook</b>.</p>
                    <p>3. Bấm <b>Copy Webhook URL</b> và dán vào ô bên trên.</p>
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  disabled={testingChannel === 'discord'}
                  onClick={() => handleTest('discord')}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {testingChannel === 'discord' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Gamepad2 className="w-3.5 h-3.5" />}
                  Gửi thử nghiệm Discord
                </button>
              </div>
            </div>
          )}

          {/* 3. ZALO TAB */}
          {activeTab === 'zalo' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Bật thông báo Zalo Webhook
                </span>
                <input
                  type="checkbox"
                  checked={config.zalo.enabled}
                  onChange={(e) => setConfig({
                    ...config,
                    zalo: { ...config.zalo, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Zalo Webhook URL / Endpoint</label>
                <input
                  type="url"
                  value={config.zalo.webhookUrl}
                  onChange={(e) => setConfig({
                    ...config,
                    zalo: { ...config.zalo, webhookUrl: e.target.value }
                  })}
                  placeholder="https://webhook.zalo.me/... hoặc webhook n8n/make forward sang Zalo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  disabled={testingChannel === 'zalo'}
                  onClick={() => handleTest('zalo')}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {testingChannel === 'zalo' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                  Gửi thử nghiệm Zalo
                </button>
              </div>
            </div>
          )}

          {/* 4. BROWSER TAB */}
          {activeTab === 'browser' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-emerald-500" /> Bật thông báo Trình duyệt (Popup)
                </span>
                <input
                  type="checkbox"
                  checked={config.browser.enabled}
                  onChange={(e) => setConfig({
                    ...config,
                    browser: { enabled: e.target.checked }
                  })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Quyền thông báo:</span>
                {browserPermission === 'granted' ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ✓ Đã cấp quyền
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestBrowserPermission}
                    className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-md transition cursor-pointer"
                  >
                    Bấm để Cấp quyền
                  </button>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  disabled={testingChannel === 'browser'}
                  onClick={() => handleTest('browser')}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {testingChannel === 'browser' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Monitor className="w-3.5 h-3.5" />}
                  Thử hiển thị popup
                </button>
              </div>
            </div>
          )}

          {/* 5. CUSTOM WEBHOOK TAB */}
          {activeTab === 'customWebhook' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between p-3 bg-amber-50/70 rounded-xl border border-amber-100">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-500" /> Bật Custom Webhook (Slack / Lark)
                </span>
                <input
                  type="checkbox"
                  checked={config.customWebhook.enabled}
                  onChange={(e) => setConfig({
                    ...config,
                    customWebhook: { ...config.customWebhook, enabled: e.target.checked }
                  })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Webhook URL</label>
                <input
                  type="url"
                  value={config.customWebhook.webhookUrl}
                  onChange={(e) => setConfig({
                    ...config,
                    customWebhook: { ...config.customWebhook, webhookUrl: e.target.value }
                  })}
                  placeholder="https://hooks.slack.com/... hoặc endpoint máy chủ của bạn"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  disabled={testingChannel === 'customWebhook'}
                  onClick={() => handleTest('customWebhook')}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {testingChannel === 'customWebhook' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                  Gửi thử nghiệm Custom Webhook
                </button>
              </div>
            </div>
          )}

          {/* 6. EVENTS CONFIG TAB */}
          {activeTab === 'events' && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Chọn các loại sự kiện nhận thông báo:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'borrow_request' as const, title: '📦 Học sinh mượn đồ' },
                  { id: 'borrow_approved' as const, title: '✅ Duyệt phiếu mượn' },
                  { id: 'borrow_returned' as const, title: '🔄 Duyệt trả đồ vào kho' },
                  { id: 'post_created' as const, title: '📰 Đăng bài viết mới' },
                  { id: 'report_created' as const, title: '🚨 Báo hỏng thiết bị' },
                  { id: 'schedule_created' as const, title: '📅 Lên lịch học mới' },
                  { id: 'journal_created' as const, title: '📓 Thêm nhật ký Lab' },
                ].map((ev) => (
                  <label
                    key={ev.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition cursor-pointer select-none text-xs font-semibold ${
                      config.events[ev.id]
                        ? 'border-indigo-200 bg-indigo-50/50 text-indigo-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={config.events[ev.id]}
                      onChange={(e) => setConfig({
                        ...config,
                        events: { ...config.events, [ev.id]: e.target.checked }
                      })}
                      className="w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer"
                    />
                    <span>{ev.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu thành công!
              </span>
            ) : (
              <span className="text-slate-400">Lưu tự động vào trình duyệt</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Lưu cấu hình
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
