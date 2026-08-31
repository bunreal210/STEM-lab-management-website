export type NotificationEvent =
  | 'borrow_request'
  | 'borrow_approved'
  | 'borrow_returned'
  | 'post_created'
  | 'report_created'
  | 'schedule_created'
  | 'journal_created'

export interface NotificationConfig {
  telegram: {
    enabled: boolean
    botToken: string
    chatId: string
  }
  discord: {
    enabled: boolean
    webhookUrl: string
  }
  zalo: {
    enabled: boolean
    webhookUrl: string
  }
  browser: {
    enabled: boolean
  }
  customWebhook: {
    enabled: boolean
    webhookUrl: string
  }
  events: {
    borrow_request: boolean
    borrow_approved: boolean
    borrow_returned: boolean
    post_created: boolean
    report_created: boolean
    schedule_created: boolean
    journal_created: boolean
  }
}

export interface NotificationPayload {
  title: string
  details: Record<string, string | number | undefined | null>
  note?: string
}

const STORAGE_KEY = 'stem_notification_config'

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  telegram: {
    enabled: false,
    botToken: '',
    chatId: '',
  },
  discord: {
    enabled: false,
    webhookUrl: '',
  },
  zalo: {
    enabled: false,
    webhookUrl: '',
  },
  browser: {
    enabled: false,
  },
  customWebhook: {
    enabled: false,
    webhookUrl: '',
  },
  events: {
    borrow_request: true,
    borrow_approved: true,
    borrow_returned: true,
    post_created: true,
    report_created: true,
    schedule_created: true,
    journal_created: true,
  },
}

const EVENT_DISCORD_COLORS: Record<NotificationEvent, number> = {
  borrow_request: 0x3b82f6, // Blue
  borrow_approved: 0x10b981, // Emerald green
  borrow_returned: 0x06b6d4, // Cyan
  post_created: 0x8b5cf6, // Violet
  report_created: 0xef4444, // Red
  schedule_created: 0xf59e0b, // Amber
  journal_created: 0x6366f1, // Indigo
}

export function getNotificationConfig(): NotificationConfig {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        telegram: { ...DEFAULT_NOTIFICATION_CONFIG.telegram, ...parsed.telegram },
        discord: { ...DEFAULT_NOTIFICATION_CONFIG.discord, ...parsed.discord },
        zalo: { ...DEFAULT_NOTIFICATION_CONFIG.zalo, ...parsed.zalo },
        browser: { ...DEFAULT_NOTIFICATION_CONFIG.browser, ...parsed.browser },
        customWebhook: { ...DEFAULT_NOTIFICATION_CONFIG.customWebhook, ...parsed.customWebhook },
        events: { ...DEFAULT_NOTIFICATION_CONFIG.events, ...parsed.events },
      }
    }

    // Migration from legacy keys if available
    const oldTgToken = localStorage.getItem('tg_bot_token')
    const oldTgChatId = localStorage.getItem('tg_chat_id')
    const oldTgEnabled = localStorage.getItem('tg_enabled') === 'true'

    if (oldTgToken || oldTgChatId) {
      return {
        ...DEFAULT_NOTIFICATION_CONFIG,
        telegram: {
          enabled: oldTgEnabled,
          botToken: oldTgToken || '',
          chatId: oldTgChatId || '',
        },
      }
    }
  } catch {}
  return DEFAULT_NOTIFICATION_CONFIG
}

export function saveNotificationConfig(config: NotificationConfig): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    // Keep backwards compatibility for legacy keys
    localStorage.setItem('tg_bot_token', config.telegram.botToken)
    localStorage.setItem('tg_chat_id', config.telegram.chatId)
    localStorage.setItem('tg_enabled', String(config.telegram.enabled))
  } catch (err) {
    console.error('Error saving notification config:', err)
  }
}

/**
 * Format notification payload to HTML for Telegram
 */
function formatTelegramMessage(title: string, details: Record<string, string | number | undefined | null>, note?: string): string {
  let text = `<b>${title}</b>\n\n`
  for (const [key, val] of Object.entries(details)) {
    if (val !== undefined && val !== null && val !== '') {
      text += `• <b>${key}:</b> ${val}\n`
    }
  }
  if (note) {
    text += `\n<i>💬 ${note}</i>\n`
  }
  text += `\n🏛 <i>Hệ thống Quản lý STEM Lab – THPT Bắc Đông Quan</i>`
  return text
}

/**
 * Format notification payload for Discord Rich Embed
 */
function formatDiscordPayload(event: NotificationEvent, title: string, details: Record<string, string | number | undefined | null>, note?: string) {
  const fields = Object.entries(details)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([name, value]) => ({
      name,
      value: String(value),
      inline: true,
    }))

  return {
    username: 'STEM Lab THPT Bắc Đông Quan',
    avatar_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=128&h=128&fit=crop',
    embeds: [
      {
        title,
        color: EVENT_DISCORD_COLORS[event] || 0x4f46e5,
        fields,
        description: note ? `💬 **Ghi chú:** ${note}` : undefined,
        footer: {
          text: 'STEM Laboratory Management Website • THPT Bắc Đông Quan',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  }
}

/**
 * Format notification payload for Zalo / Generic JSON Webhook
 */
function formatGenericPayload(title: string, details: Record<string, string | number | undefined | null>, note?: string) {
  let plainText = `[STEM LAB BĐQ] ${title}\n`
  for (const [key, val] of Object.entries(details)) {
    if (val !== undefined && val !== null && val !== '') {
      plainText += `- ${key}: ${val}\n`
    }
  }
  if (note) plainText += `Ghi chú: ${note}\n`

  return {
    source: 'STEM_LAB_BDQ',
    title,
    text: plainText,
    message: plainText,
    content: plainText,
    details,
    note,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Trigger HTML5 Browser Web Notification popup
 */
function triggerBrowserNotification(title: string, details: Record<string, string | number | undefined | null>, note?: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission === 'granted') {
    const summary = Object.entries(details)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .slice(0, 2)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ')

    try {
      new Notification(title, {
        body: summary + (note ? `\n${note}` : ''),
        icon: '/favicon.ico',
      })
    } catch {}
  }
}

/**
 * Dispatch notification to ALL enabled channels simultaneously
 */
export async function sendNotification(
  event: NotificationEvent,
  payload: NotificationPayload
): Promise<void> {
  const config = getNotificationConfig()

  // Check if event is enabled
  if (!config.events[event]) return

  const promises: Promise<any>[] = []

  // 1. Telegram Dispatch
  if (config.telegram.enabled && config.telegram.botToken && config.telegram.chatId) {
    const tgHtml = formatTelegramMessage(payload.title, payload.details, payload.note)
    const tgPromise = fetch(`https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegram.chatId,
        text: tgHtml,
        parse_mode: 'HTML',
      }),
    }).catch((err) => console.warn('Telegram notification failed:', err))
    promises.push(tgPromise)
  }

  // 2. Discord Webhook Dispatch (Rich Embeds)
  if (config.discord.enabled && config.discord.webhookUrl) {
    const discordBody = formatDiscordPayload(event, payload.title, payload.details, payload.note)
    const discordPromise = fetch(config.discord.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordBody),
    }).catch((err) => console.warn('Discord webhook notification failed:', err))
    promises.push(discordPromise)
  }

  // 3. Zalo Webhook Dispatch
  if (config.zalo.enabled && config.zalo.webhookUrl) {
    const zaloBody = formatGenericPayload(payload.title, payload.details, payload.note)
    const zaloPromise = fetch(config.zalo.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zaloBody),
    }).catch((err) => console.warn('Zalo notification failed:', err))
    promises.push(zaloPromise)
  }

  // 4. Custom Webhook Dispatch (Slack / Lark / etc.)
  if (config.customWebhook.enabled && config.customWebhook.webhookUrl) {
    const webhookBody = formatGenericPayload(payload.title, payload.details, payload.note)
    const webhookPromise = fetch(config.customWebhook.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookBody),
    }).catch((err) => console.warn('Custom webhook notification failed:', err))
    promises.push(webhookPromise)
  }

  // 5. Browser Notification Dispatch
  if (config.browser.enabled) {
    triggerBrowserNotification(payload.title, payload.details, payload.note)
  }

  await Promise.allSettled(promises)
}

/**
 * Test a specific channel with a sample message
 */
export async function testNotificationChannel(
  channel: 'telegram' | 'discord' | 'zalo' | 'browser' | 'customWebhook',
  config: NotificationConfig
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Telegram Test
    if (channel === 'telegram') {
      if (!config.telegram.botToken || !config.telegram.chatId) {
        return { success: false, message: 'Vui lòng nhập đầy đủ Bot Token và Chat ID của Telegram.' }
      }
      const testMsg = `🔔 <b>Kiểm tra kết nối Telegram Bot thành công!</b>\n\nHệ thống Quản lý STEM Lab – THPT Bắc Đông Quan đã kết nối thành công với nhóm/kênh này.`
      const res = await fetch(`https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.telegram.chatId,
          text: testMsg,
          parse_mode: 'HTML',
        }),
      })
      const data = await res.json()
      if (data.ok) {
        return { success: true, message: 'Gửi tin nhắn thử nghiệm Telegram thành công! Hãy kiểm tra nhóm chat Telegram.' }
      } else {
        return { success: false, message: `Lỗi Telegram: ${data.description || 'Không thể gửi tin'}` }
      }
    }

    // 2. Discord Test (Rich Embed)
    if (channel === 'discord') {
      if (!config.discord.webhookUrl) {
        return { success: false, message: 'Vui lòng nhập Discord Webhook URL.' }
      }
      const payload = {
        username: 'STEM Lab THPT Bắc Đông Quan',
        avatar_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=128&h=128&fit=crop',
        embeds: [
          {
            title: '🎮 Kết nối Discord Webhook thành công!',
            color: 0x5865f2, // Discord Blurple
            description: 'Kênh Discord này đã được cấu hình nhận thông báo tự động từ **Hệ thống Quản lý STEM Lab – THPT Bắc Đông Quan**.',
            fields: [
              { name: 'Trạng thái', value: '🟢 Hoạt động tốt', inline: true },
              { name: 'Kênh tích hợp', value: 'Discord Webhook (Free)', inline: true },
            ],
            footer: {
              text: 'STEM Laboratory • THPT Bắc Đông Quan',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      }
      const res = await fetch(config.discord.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok || res.status === 204) {
        return { success: true, message: 'Gửi tin nhắn thử nghiệm Discord thành công! Hãy kiểm tra kênh chat Discord.' }
      } else {
        return { success: false, message: `Lỗi Discord Webhook: Mã phản hồi ${res.status}. Vui lòng kiểm tra lại URL.` }
      }
    }

    // 3. Zalo Test
    if (channel === 'zalo') {
      if (!config.zalo.webhookUrl) {
        return { success: false, message: 'Vui lòng nhập Webhook URL của Zalo.' }
      }
      const payload = {
        title: '🔔 Kiểm tra kết nối Zalo thành công',
        text: 'Hệ thống Quản lý STEM Lab – THPT Bắc Đông Quan đã kết nối thành công với Zalo Webhook!',
        timestamp: new Date().toISOString(),
      }
      const res = await fetch(config.zalo.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok || res.status === 200 || res.status === 204) {
        return { success: true, message: 'Gửi tin nhắn thử nghiệm qua Zalo Webhook thành công!' }
      } else {
        return { success: false, message: `Lỗi Zalo Webhook: Mã phản hồi ${res.status}` }
      }
    }

    // 4. Browser Notification Test
    if (channel === 'browser') {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        return { success: false, message: 'Trình duyệt của bạn không hỗ trợ Web Notification API.' }
      }
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          return { success: false, message: 'Bạn chưa cấp quyền nhận thông báo trên trình duyệt.' }
        }
      }
      new Notification('🔔 Thông báo STEM Lab THPT Bắc Đông Quan', {
        body: 'Kết nối thông báo trình duyệt thành công! Bạn sẽ nhận được popup khi có hoạt động mới.',
        icon: '/favicon.ico',
      })
      return { success: true, message: 'Đã hiển thị thông báo popup trên trình duyệt thành công!' }
    }

    // 5. Custom Webhook Test
    if (channel === 'customWebhook') {
      if (!config.customWebhook.webhookUrl) {
        return { success: false, message: 'Vui lòng nhập Webhook URL tùy chỉnh.' }
      }
      const payload = formatGenericPayload('🔔 Kiểm tra Custom Webhook thành công', {
        'Hệ thống': 'STEM Lab THPT Bắc Đông Quan',
        'Thời gian': new Date().toLocaleString('vi-VN'),
      })
      const res = await fetch(config.customWebhook.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok || res.status === 200 || res.status === 204) {
        return { success: true, message: 'Gửi dữ liệu thử nghiệm đến Custom Webhook thành công!' }
      } else {
        return { success: false, message: `Mã phản hồi từ Webhook: ${res.status}` }
      }
    }
  } catch (err: any) {
    return { success: false, message: `Lỗi kết nối: ${err.message || 'Không thể kết nối đến máy chủ.'}` }
  }
  return { success: false, message: 'Kênh không hợp lệ.' }
}

/**
 * Gửi thông báo trực tiếp cho từng học sinh qua Email và Zalo (tự động bỏ qua nếu không có Email/SĐT)
 */
export async function notifyStudent(
  studentProfile: { email?: string; phone?: string | null; name: string | null },
  title: string,
  messageText: string,
  details: Record<string, string | number | undefined | null>
): Promise<void> {
  const promises: Promise<any>[] = []

  // 1. Gửi qua Email (nếu học sinh có đăng ký Email)
  if (studentProfile.email && studentProfile.email.includes('@')) {
    const emailPromise = fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: studentProfile.email,
        subject: `[STEM LAB BDQ] ${title}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 600px; color: #1e293b; line-height: 1.6; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <div style="display: flex; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
              <span style="font-size: 24px; margin-right: 8px;">🔬</span>
              <h2 style="color: #0284c7; margin: 0; font-size: 20px; font-weight: 800;">STEM Lab THPT Bắc Đông Quan</h2>
            </div>
            
            <h3 style="color: #0f172a; margin-top: 0; font-size: 16px; font-weight: 700;">${title}</h3>
            <p style="font-size: 14px; color: #334155;">Chào bạn <strong>${studentProfile.name || 'Thành viên'}</strong>,</p>
            <p style="font-size: 14px; color: #334155;">${messageText}</p>
            
            <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Chi tiết thông tin:</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tbody>
                  ${Object.entries(details)
                    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
                    .map(([k, v]) => `
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">${k}:</td>
                        <td style="padding: 6px 0; color: #1e293b; font-weight: 700;">${v}</td>
                      </tr>
                    `).join('')}
                </tbody>
              </table>
            </div>
            
            <p style="font-size: 13px; color: #64748b; font-style: italic; margin-top: 24px;">Đây là email tự động từ hệ thống quản lý phòng Lab. Vui lòng không trả lời trực tiếp thư này.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <footer style="font-size: 11px; color: #94a3b8; text-align: center;">
              🏛 Hệ thống Quản lý STEM Lab & FabLab – Trường THPT Bắc Đông Quan
            </footer>
          </div>
        `,
      }),
    }).catch(err => console.warn('Resend email notification failed:', err))
    promises.push(emailPromise)
  }

  // 2. Gửi qua Zalo Webhook (nếu có cấu hình Zalo và học sinh có số điện thoại)
  const config = getNotificationConfig()
  if (config.zalo.enabled && config.zalo.webhookUrl && studentProfile.phone && studentProfile.phone.trim() !== '') {
    let plainText = `[STEM LAB BĐQ] ${title}\n${messageText}\n`
    for (const [key, val] of Object.entries(details)) {
      if (val !== undefined && val !== null && val !== '') {
        plainText += `- ${key}: ${val}\n`
      }
    }
    const zaloPromise = fetch(config.zalo.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'STEM_LAB_BDQ',
        phone: studentProfile.phone,
        title,
        text: plainText,
        details,
      }),
    }).catch(err => console.warn('Student Zalo notification failed:', err))
    promises.push(zaloPromise)
  }

  await Promise.all(promises)
}
