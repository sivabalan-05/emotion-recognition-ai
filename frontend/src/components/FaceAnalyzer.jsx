import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
import './FaceAnalyzer.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function FaceAnalyzer({ setResult, setLoading, loading }) {
  const webcamRef = useRef(null)
  const [mode, setMode] = useState('webcam') // 'webcam' | 'upload'
  const [previewSrc, setPreviewSrc] = useState(null)
  const [camError, setCamError] = useState(false)
  const [liveMode, setLiveMode] = useState(false)
  const liveInterval = useRef(null)

  const analyzeImage = useCallback(async (imageSrc) => {
    if (!imageSrc) return
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/analyze/face`, { image: imageSrc })
      setResult(res.data)
    } catch (err) {
      setResult({ success: false, error: err.message })
    } finally {
      setLoading(false)
    }
  }, [setLoading, setResult])

  const captureOnce = useCallback(() => {
    const img = webcamRef.current?.getScreenshot()
    if (img) {
      setPreviewSrc(img)
      analyzeImage(img)
    }
  }, [analyzeImage])

  const toggleLive = useCallback(() => {
    if (liveMode) {
      clearInterval(liveInterval.current)
      setLiveMode(false)
    } else {
      setLiveMode(true)
      liveInterval.current = setInterval(() => {
        const img = webcamRef.current?.getScreenshot()
        if (img) analyzeImage(img)
      }, 2000)
    }
  }, [liveMode, analyzeImage])

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target.result
      setPreviewSrc(src)
      analyzeImage(src)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div className="panel-title">Face Emotion</div>

      <div className="mode-toggle">
        <button className={mode === 'webcam' ? 'active' : ''} onClick={() => setMode('webcam')}>Webcam</button>
        <button className={mode === 'upload' ? 'active' : ''} onClick={() => setMode('upload')}>Upload Image</button>
      </div>

      {mode === 'webcam' ? (
        <div className="webcam-wrap">
          {!camError ? (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam"
              onUserMediaError={() => setCamError(true)}
              mirrored
            />
          ) : (
            <div className="cam-error">
              <span>📵</span>
              <p>Camera not accessible.<br/>Switch to Image Upload.</p>
            </div>
          )}

          {liveMode && <div className="live-badge">● LIVE</div>}

          <div className="btn-row">
            <button className="btn-primary" onClick={captureOnce} disabled={loading || camError}>
              {loading ? 'Analyzing...' : 'Capture & Analyze'}
            </button>
            <button className={`btn-secondary ${liveMode ? 'active' : ''}`} onClick={toggleLive} disabled={camError}>
              {liveMode ? 'Stop Live' : 'Live Mode'}
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-wrap">
          <label className="upload-label">
            <input type="file" accept="image/*" onChange={handleUpload} />
            <div className="upload-area">
              {previewSrc ? (
                <img src={previewSrc} alt="preview" className="preview-img" />
              ) : (
                <>
                  <div className="upload-icon">⬆</div>
                  <p>Click or drag an image here</p>
                  <span>JPG, PNG, WEBP supported</span>
                </>
              )}
            </div>
          </label>
          {loading && <p className="analyzing-text">🔍 Analyzing face...</p>}
        </div>
      )}
    </div>
  )
}
