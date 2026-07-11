import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    // 新規会員登録を行う
    const { data, error } = await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // メール確認が不要な設定の場合はそのまま物件一覧へ遷移する
    if (data.session) {
      navigate('/properties')
    } else {
      setMessage('確認メールを送信しました。メール内のリンクから登録を完了してください。')
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>
        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="info-message">{message}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '登録中...' : '登録する'}
        </button>
        <p className="auth-switch">
          すでにアカウントをお持ちの方は<Link to="/login">ログイン</Link>
        </p>
      </form>
    </div>
  )
}
