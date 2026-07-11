import { useState } from 'react'

// 物件の新規登録・編集の両方で使うフォーム
// initialValuesがあれば編集モード、なければ新規登録モードとして扱う
export function PropertyForm({ initialValues, onSubmit, onCancel }) {
  const isEditing = Boolean(initialValues)

  const [name, setName] = useState(initialValues?.name ?? '')
  const [rent, setRent] = useState(initialValues?.rent ?? '')
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [layout, setLayout] = useState(initialValues?.layout ?? '')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    await onSubmit({
      name,
      rent: Number(rent),
      area,
      layout,
    })

    setSubmitting(false)
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? '物件を編集' : '物件を新規登録'}</h2>
      <label>
        物件名
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        家賃（円）
        <input
          type="number"
          min="0"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          required
        />
      </label>
      <label>
        エリア名
        <input value={area} onChange={(e) => setArea(e.target.value)} required />
      </label>
      <label>
        間取り
        <input
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          placeholder="例：1LDK"
          required
        />
      </label>
      <div className="property-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : isEditing ? '更新する' : '登録する'}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
      </div>
    </form>
  )
}
