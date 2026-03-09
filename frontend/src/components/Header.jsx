import './Header.css'
export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">⬡</div>
          <div>
            <div className="logo-name">EmoSense <span className="badge">AI</span></div>
            <div className="logo-sub">Emotion Recognition System</div>
          </div>
        </div>
        <div className="header-status"><span className="dot"></span><span>Model Online</span></div>
      </div>
    </header>
  )
}
