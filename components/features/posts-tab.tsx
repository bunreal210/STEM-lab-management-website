'use client'

import { Calendar, PenTool, ArrowRight, Trash2, Facebook } from 'lucide-react'
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tin Tức & Hoạt Động CLB</h2>
          <p className="text-sm text-slate-500 mt-1">Cập nhật hình ảnh dự án, tin tức khoa học và thông báo mới nhất.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setPostModalOpen(true)}
            className="bg-stemBlue-600 hover:bg-stemBlue-700 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <PenTool className="w-4 h-4" /> Đăng bản tin
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-medium">Chưa có bài viết nào.</div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all space-y-4 p-5 flex flex-col group relative"
              >
                <div className="absolute top-8 left-8 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
                {post.image_url && (
                  <div className="w-full h-48 md:h-60 overflow-hidden rounded-2xl shrink-0 border border-slate-100 relative">
                    <img
                      src={post.image_url}
                      alt="Bìa"
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.published_at)} <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                    <span>{post.author}</span>
                  </div>
                  <h3
                    onClick={() => setFullPost(post)}
                    className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug group-hover:text-stemBlue-600 transition-colors cursor-pointer"
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">{post.content}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => setFullPost(post)}
                    className="text-stemBlue-600 font-black text-xs flex items-center gap-1.5 hover:underline uppercase tracking-wider transition"
                  >
                    Đọc bài viết <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-rose-500 hover:text-rose-700 font-bold text-xs flex items-center gap-1 transition-colors"
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
          <div className="bg-gradient-to-br from-indigo-900 to-stemBlue-950 text-white p-6 rounded-3xl shadow-xl space-y-4 sticky top-24">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Facebook className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold">Kết nối với chúng tôi</h3>
            <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
              Câu lạc bộ STEM thường xuyên cập nhật kết quả nghiên cứu và thông tin tuyển sinh thành viên năng động tại Fanpage chính thức.
            </p>
            <a
              href="https://www.fablabs.io/labs/bdqstemlab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-indigo-950 font-extrabold text-xs px-5 py-3 rounded-2xl shadow hover:bg-slate-100 transition-all"
            >
              Trang Fab Labs <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
