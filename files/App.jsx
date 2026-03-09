import { useState } from 'react'
import FaceAnalyzer from './components/FaceAnalyzer'
import TextAnalyzer from './components/TextAnalyzer'
import EmotionResult from './components/EmotionResult'
import Header from './components/Header'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('face')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="app">
      <Header />

      <main className="main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'face' ? 'active' : ''}`}
            onClick={() => { setActiveTab('face'); setResult(null) }}
          >
            <span className="tab-icon">📷</span> Face Detection
          </button>
          <button
            className={`tab ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => { setActiveTab('text'); setResult(null) }}
          >
            <span className="tab-icon">💬</span> Text Analysis
          </button>
        </div>

        <div className="content-grid">
          <div className="input-panel">
            {activeTab === 'face' ? (
              <FaceAnalyzer setResult={setResult} setLoading={setLoading} loading={loading} />
            ) : (
              <TextAnalyzer setResult={setResult} setLoading={setLoading} loading={loading} />
            )}
          </div>

          <div className="result-panel">
            <EmotionResult result={result} loading={loading} />
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Built with DeepFace + DistilRoBERTa · AI Emotion Recognition</p>
      </footer>
    </div>
  )
}
