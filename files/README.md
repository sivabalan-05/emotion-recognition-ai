# 🧠 EmoSense AI — Emotion Recognition System

An AI-powered emotion recognition web app that detects emotions from **faces** (webcam or image) and **text** in real time.

![CI](https://github.com/YOUR_USERNAME/emosense-ai/actions/workflows/ci.yml/badge.svg)

---

## ✨ Features

- 📷 **Face Emotion Detection** — webcam live mode or image upload, powered by [DeepFace](https://github.com/serengil/deepface)
- 💬 **Text Emotion Analysis** — NLP-based emotion from text, powered by [DistilRoBERTa](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base)
- 📊 **Live Charts** — bar charts + radar visualization of all emotion scores
- ⚡ **FastAPI backend** + **React frontend**

---

## 🗂️ Project Structure

```
emosense-ai/
├── backend/
│   ├── main.py              # FastAPI app (face + text endpoints)
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── FaceAnalyzer.jsx   # Webcam / image upload
│   │   │   ├── TextAnalyzer.jsx   # Text input
│   │   │   └── EmotionResult.jsx  # Charts & results
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .github/
│   └── workflows/ci.yml     # GitHub Actions CI
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or 3.11
- Node.js 18+
- A webcam (optional, for face detection)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/emosense-ai.git
cd emosense-ai
```

---

### 2. Start the Backend

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

The API will be live at: **http://localhost:8000**

> ⚠️ First startup downloads the AI models (~500MB). This only happens once.

#### API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/analyze/face` | Analyze face emotion from base64 image |
| POST | `/analyze/text` | Analyze text emotion |

---

### 3. Start the Frontend

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start dev server
npm run dev
```

Open your browser at: **http://localhost:3000**

---

## 📤 Uploading to GitHub

### First time setup

```bash
# 1. Initialize git (from project root)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "feat: initial commit — EmoSense AI emotion recognition"

# 4. Create a new repo on GitHub (go to github.com → New Repository)
#    Name it: emosense-ai
#    Set it to Public or Private
#    Do NOT initialize with README (we already have one)

# 5. Connect your local repo to GitHub
git remote add origin https://github.com/YOUR_USERNAME/emosense-ai.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

### Subsequent pushes

```bash
git add .
git commit -m "your commit message here"
git push
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, FastAPI, Uvicorn |
| Face AI | DeepFace (VGG-Face / OpenCV) |
| Text AI | HuggingFace Transformers, DistilRoBERTa |
| Frontend | React 18, Vite |
| Charts | Recharts |
| Animations | Framer Motion |
| CI/CD | GitHub Actions |

---

## 🔧 Troubleshooting

**Camera not working?**
- Make sure your browser has camera permissions enabled
- Try switching to "Upload Image" mode instead

**Backend not starting?**
- Make sure you're using Python 3.10 or 3.11 (not 3.12+)
- Try: `pip install --upgrade pip` then reinstall requirements

**Models downloading slowly?**
- First startup downloads models from the internet
- Once downloaded, they're cached for future runs

**CORS errors in browser?**
- Make sure the backend is running on port 8000
- Check that `VITE_API_URL` in `.env.local` points to the correct address

---

## 📄 License

MIT License — free to use and modify.

---

## 🙏 Credits

- [DeepFace](https://github.com/serengil/deepface) by Sefik Ilkin Serengil
- [j-hartmann/emotion-english-distilroberta-base](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base) on HuggingFace
