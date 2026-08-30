'use client'

import { Calendar, PenTool, ArrowRight, Trash2, Newspaper, Sparkles, ExternalLink } from 'lucide-react'
import type { Post } from '@/lib/types'
import { formatDate } from '@/lib/utils/date'

interface PostsTabProps {
  posts: Post[]
  isAdmin: boolean
  setPostModalOpen: (val: boolean) => void
  setFullPost: (p: Post | null) => void
  deletePost: (id: string) => void
}

export function PostsTab({
  posts,
  isAdmin,
  setPostModalOpen,
  setFullPost,
  deletePost,
}: PostsTabProps) {
  return (
    <section className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-sky-600" />
            Bản Tin &amp; Hoạt Động STEM
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Cập nhật hình ảnh dự án, tin tức khoa học và thông báo từ câu lạc bộ.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setPostModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
          >
            <PenTool className="w-4 h-4" /> Đăng bản tin
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/60 rounded-2xl border border-slate-200/80 text-slate-400 font-medium text-sm">
              Chưa có bài viết hoặc thông báo nào.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-md hover:border-sky-300 transition-all p-4 sm:p-5 flex flex-col group relative space-y-3"
              >
                {post.image_url && (
                  <div className="w-full h-48 sm:h-56 overflow-hidden rounded-xl shrink-0 border border-slate-100 relative bg-slate-50">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/95 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm border border-slate-100">
                        {post.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(post.published_at)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-slate-600 font-medium">{post.author}</span>
                  </div>

                  <h3
                    onClick={() => setFullPost(post)}
                    className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors cursor-pointer"
                  >
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setFullPost(post)}
                    className="text-sky-600 font-bold text-xs flex items-center gap-1 hover:text-sky-800 transition cursor-pointer"
                  >
                    Đọc toàn bộ <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-rose-500 hover:text-rose-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa bài
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {/* Sidebar Info */}
        <div>
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-5 sm:p-6 rounded-2xl shadow-md space-y-4 sticky top-24 border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Kênh Thông Tin CLB
            </div>
            
            <h4 className="font-extrabold text-base sm:text-lg leading-snug">
              CLB STEM &amp; Nghiên Cứu Khoa Học
            </h4>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Nơi giao lưu, chia sẻ ý tưởng sáng tạo khoa học kỹ thuật, tham gia các cuộc thi Robotics cấp Tỉnh &amp; Quốc Gia của trường THPT Bắc Đông Quan.
            </p>

            <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Trường THPT:</span>
                <span className="font-bold text-white">Bắc Đông Quan</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Địa điểm:</span>
                <span className="font-bold text-white">Phòng Lab STEM tầng 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
