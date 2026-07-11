import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { PropertyForm } from '../components/PropertyForm'

export function PropertyList() {
  const { user, signOut } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null) // nullなら新規登録、値があれば編集対象

  // 物件一覧を取得する（RLSにより自分が登録した物件のみ取得される）
  const fetchProperties = async () => {
    setLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMessage(error.message)
    } else {
      setProperties(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const openCreateForm = () => {
    setEditingProperty(null)
    setIsFormOpen(true)
  }

  const openEditForm = (property) => {
    setEditingProperty(property)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingProperty(null)
  }

  // 新規登録・更新のどちらもこの関数で処理する
  const handleSubmit = async (values) => {
    setErrorMessage('')

    const { error } = editingProperty
      ? // 更新（RLSにより自分の物件以外は更新できない）
        await supabase.from('properties').update(values).eq('id', editingProperty.id)
      : // 新規登録（user_idに自分のIDを設定する）
        await supabase.from('properties').insert({ ...values, user_id: user.id })

    if (error) {
      setErrorMessage(error.message)
      return
    }

    closeForm()
    await fetchProperties()
  }

  // 物件を削除する（RLSにより自分の物件以外は削除できない）
  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除しますか？')) {
      return
    }

    setErrorMessage('')
    const { error } = await supabase.from('properties').delete().eq('id', id)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    await fetchProperties()
  }

  return (
    <div className="property-page">
      <header className="property-header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={() => signOut()}>ログアウト</button>
        </div>
      </header>

      <div className="property-actions">
        <button onClick={openCreateForm}>＋ 新規登録</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {isFormOpen && (
        <PropertyForm
          initialValues={editingProperty}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {loading ? (
        <p className="loading-message">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="empty-message">登録されている物件はありません。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h2>{property.name}</h2>
              <p className="property-rent">{property.rent.toLocaleString()}円</p>
              <p className="property-area">
                {property.area}・{property.layout}
              </p>
              <div className="property-card-actions">
                <button onClick={() => openEditForm(property)}>編集</button>
                <button onClick={() => handleDelete(property.id)}>削除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
