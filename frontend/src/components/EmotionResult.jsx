import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import './EmotionResult.css'

const EMOTION_META = {
  happy:     { emoji: '😄', color: '#facc15', label: 'Happy' },
  sad:       { emoji: '😢', color: '#60a5fa', label: 'Sad' },
  angry:     { emoji: '😠', color: '#f87171', label: 'Angry' },
  fear:      { emoji: '😱', color: '#a78bfa', label: 'Fear' },
  surprise:  { emoji: '😲', color: '#fb923c', label: 'Surprise' },
  disgust:   { emoji: '🤢', color: '#4ade80', label: 'Disgust' },
  neutral:   { emoji: '😐', color: '#94a3b8', label: 'Neutral' },
  // text model labels
  joy:       { emoji: '😄', color: '#facc15', label: 'Joy' },
  sadness:   { emoji: '😢', color: '#60a5fa', label: 'Sadness' },
  anger:     { emoji: '😠', color: '#f87171', label: 'Anger' },
  love:      { emoji: '❤️', color: '#f472b6', label: 'Love' },
}

function getMeta(emotion) {
  return EMOTION_META[emotion?.toLowerCase()] || { emoji: '🤔', color: '#00e5ff', label: emotion }
}

export default function EmotionResult({ result, loading }) {
  if (loading) {
    return (
      <div className="result-empty">
        <div className="scanner">
          <div className="scan-line"></div>
          <div className="scan-text">Analyzing...</div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="result-empty">
        <div className="empty-icon">◎</div>
        <p>Results will appear here</p>
        <span>Capture a face or enter text to get started</span>
      </div>
    )
  }

  if (!result.success) {
    return (
      <div className="result-error">
        <span>⚠</span>
        <p>Analysis failed</p>
        <span>{result.error || 'Unknown error occurred'}</span>
      </div>
    )
  }

  const dominant = result.dominant_emotion
  const meta = getMeta(dominant)
  const emotions = result.emotions || {}

  // Sort emotions by value
  const sorted = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)

  // Radar chart data
  const radarData = sorted.map(([name, value]) => ({
    emotion: getMeta(name).label || name,
    value: Math.round(value),
  }))

  return (
    <div className="result-content">
      {/* Dominant Emotion Hero */}
      <div className="dominant-card" style={{ '--accent-color': meta.color }}>
        <div className="dominant-emoji">{meta.emoji}</div>
        <div className="dominant-label">{meta.label}</div>
        <div className="dominant-sub">Dominant Emotion</div>
      </div>

      {/* Bar Chart */}
      <div className="bars-section">
        {sorted.map(([name, value]) => {
          const m = getMeta(name)
          return (
            <div key={name} className="bar-row">
              <span className="bar-label">{m.emoji} {m.label}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${value}%`, background: m.color }}
                ></div>
              </div>
              <span className="bar-value">{value.toFixed(1)}%</span>
            </div>
          )
        })}
      </div>

      {/* Radar Chart */}
      <div className="radar-section">
        <div className="section-label">Emotion Radar</div>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1e2d4a" />
            <PolarAngleAxis
              dataKey="emotion"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Space Mono' }}
            />
            <Radar
              name="emotion"
              dataKey="value"
              stroke={meta.color}
              fill={meta.color}
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{ background: '#0e1420', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: '0.75rem' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {result.text_analyzed && (
        <div className="analyzed-text">
          <div className="section-label">Analyzed Text</div>
          <p>"{result.text_analyzed}"</p>
        </div>
      )}
    </div>
  )
}
