import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import type { NewPlay } from '@/types'

export default function RecordNew() {
  const navigate = useNavigate()
  const [form, setForm] = useState<NewPlay>({
    spent: 0,
    result: 'failed',
    memo: '',
    played_at: new Date().toISOString(),
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase.from('plays').insert(form)

    if (error) {
      console.error(error)
      alert('保存に失敗しました')
    } else {
      navigate('/')
    }
    setSaving(false)
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">プレイ記録</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">投入金額（円）</label>
          <input
            type="number"
            required
            min={0}
            value={form.spent}
            onChange={(e) => setForm({ ...form, spent: Number(e.target.value) })}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">結果</label>
          <select
            value={form.result}
            onChange={(e) => setForm({ ...form, result: e.target.value as NewPlay['result'] })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="failed">失敗</option>
            <option value="got">獲得</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">メモ</label>
          <input
            type="text"
            value={form.memo ?? ''}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
            placeholder="例: 橋渡し、あと少しだった"
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/')}>
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}
