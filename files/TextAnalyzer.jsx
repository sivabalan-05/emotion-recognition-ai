import { useState } from 'react'
import axios from 'axios'
import './TextAnalyzer.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const EXAMPLES = [
  "I can't believe how amazing today was! Everything went perfectly!",
  "I'm so frustrated. Nothing is working and I've been at this for hours.",
  "I'm scared about what might happen next. I don't feel safe.",
  "I miss her so much. The house feels empty without her.",
  "OMG did you just see that?! That was absolutely insane!",
]

export default function TextAnalyzer({ setResult, setLoading, loading }) {
  const [text, setText] = useState('')
  const charLimit = 500

  const analyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/analyze/text`, { text })
      setResult(res.data)
    } catch (err) {
      setResult({ success: false, error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) analyze()
  }

  return (
    <div>
      <div className="panel-title">Text Emotion</div>

      <textarea
        className="text-input"
        placeholder="Type or paste text here to analyze its emotional tone..."
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, charLimit))}
        onKeyDown={handleKey}
        rows={6}
      />

      <div className="text-meta">
        <span className="char-count">{text.length}/{charLimit}</span>
        <span className="hint">Ctrl+Enter to analyze</span>
      </div>

      <button
        className="analyze-btn"
        onClick={analyze}
        disabled={loading || !text.trim()}
      >
        {loading ? (
          <span className="loading-text"><span className="spinner"></span> Analyzing...</span>
        ) : (
          '🧠 Analyze Emotion'
        )}
      </button>

      <div className="examples-section">
        <p className="examples-label">Try an example:</p>
        <div className="examples-list">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              className="example-chip"
              onClick={() => setText(ex)}
            >
              {ex.slice(0, 45)}…
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
