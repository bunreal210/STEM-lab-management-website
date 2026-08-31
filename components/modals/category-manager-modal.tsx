'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Loader2, FolderCog } from 'lucide-react'

interface CategoryManagerModalProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
  onAddCategory: (name: string) => Promise<void>
  onDeleteCategory: (name: string) => Promise<void>
}

export function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerModalProps) {
  const [newCat, setNewCat] = useState('')
  const [loading, setLoading] = useState<string | null>(null) // 'add' or category name
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newCat.trim()
    if (!name) return
    if (categories.includes(name)) {
      setErrorMsg('Danh mục này đã tồn tại.')
      return
    }

    setLoading('add')
    setErrorMsg('')
    try {
      await onAddCategory(name)
      setNewCat('')
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi thêm danh mục.')
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (name: string) => {
    if (name === 'Khác') {
      alert('Không thể xóa danh mục mặc định "Khác".')
      return
    }
    if (!confirm(`Bạn chắc chắn muốn xóa danh mục "${name}"?\n(Lưu ý: Thiết bị thuộc danh mục này sẽ hiển thị danh mục mặc định hoặc cần được cập nhật lại)`)) {
      return
    }

    setLoading(name)
    setErrorMsg('')
    try {
      await onDeleteCategory(name)
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi xóa danh mục.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <FolderCog className="w-5 h-5 text-sky-600" />
            Quản Lý Danh Mục Thiết Bị
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-2.5">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Form to Add New Category */}
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Tên danh mục mới..."
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <button
              type="submit"
              disabled={loading === 'add'}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm px-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {loading === 'add' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Thêm
                </>
              )}
            </button>
          </form>

          {/* Categories List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Danh mục hiện tại ({categories.length})</p>
            {categories.map(cat => (
              <div
                key={cat}
                className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100/50 transition"
              >
                <span>{cat}</span>
                {cat !== 'Khác' && (
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    disabled={loading !== null}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50/50 transition cursor-pointer disabled:opacity-50"
                  >
                    {loading === cat ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
