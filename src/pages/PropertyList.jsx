import { useAuth } from '../context/AuthContext'

// 物件一覧のダミーデータ
const dummyProperties = [
  { id: 1, name: 'グランドメゾン渋谷', rent: '150,000円', area: '東京都渋谷区' },
  { id: 2, name: 'パークサイド新宿', rent: '120,000円', area: '東京都新宿区' },
  { id: 3, name: 'サンライズ横浜', rent: '98,000円', area: '神奈川県横浜市' },
  { id: 4, name: 'リバーサイド大阪', rent: '85,000円', area: '大阪府大阪市' },
]

export function PropertyList() {
  const { user, signOut } = useAuth()

  return (
    <div className="property-page">
      <header className="property-header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={() => signOut()}>ログアウト</button>
        </div>
      </header>
      <div className="property-grid">
        {dummyProperties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2>{property.name}</h2>
            <p className="property-rent">{property.rent}</p>
            <p className="property-area">{property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
