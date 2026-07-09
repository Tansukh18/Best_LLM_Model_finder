# Perfect LLM Model Finder 🔍🎯

🚀 **Live Web App**: [https://best-llm-model-finder-3a5c.vercel.app](https://best-llm-model-finder-3a5c.vercel.app)  
⚙️ **Backend API**: [https://perfect-llm-finder-api.onrender.com](https://perfect-llm-finder-api.onrender.com) (Status: [Health Check](https://perfect-llm-finder-api.onrender.com/api/health))

Perfect LLM Model Finder is a tool designed to simplify the overwhelming process of choosing the right LLM for your specific project or use case. It leverages Open LLM Benchmarks and intelligent keyword heuristics/Gemini AI to analyze and rank models based on your requirements.

This project is a modern, full-stack implementation split into:
1. **Frontend**: Next.js (React) web application styled with premium dark theme aesthetics.
2. **Backend**: FastAPI (Python) web service handling model matching, translation, and caching.

---

## Features 🎯

- **Performance-Driven Matching:** Recommends models based on relevant benchmarks mapped to your task.
- **Customizable size preference:** Match models based on parameter size limits (1B to 50B).
- **Global Language Support:** Fully supports 100+ languages via auto-language detection and translation.
- **Premium User Interface:** Beautiful dark UI with glassmorphism, glowing accents, and micro-animations.
- **Feedback Loop:** Save user feedback to improve model recommendations over time.

---

## Tech Stack 🛠️

* **Frontend**: Next.js 14, React 18, TypeScript, Custom CSS
* **Backend**: FastAPI, Python 3.11, Pandas, Hugging Face `datasets`
* **AI/Translation**: Gemini API (optional), `deep-translator`, `langdetect`
* **Deployment**: Vercel (Frontend), Render (Backend)

---

## Local Development 🚀

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GEMINI_KEY=your_gemini_api_key_here  # Optional: falls back to heuristics if not provided
```

Run the backend server:
```bash
uvicorn main:app --reload --port 8000
```
API docs will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup (Next.js)

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the frontend dev server:
```bash
npm run dev
```
Open `http://localhost:3000` to view the app!

---

## Deployment 🌥️

### Backend (Render)
1. Deploy using the included `Dockerfile` or python runtime.
2. Render deployment settings are configured in `render.yaml` at the root.
3. Configure the environment variable `GEMINI_KEY` (optional) in your Render service dashboard.

### Frontend (Vercel)
1. Import the project into Vercel.
2. Set the root directory to `frontend`.
3. Set the environment variable `NEXT_PUBLIC_API_URL` to your live Render backend URL (e.g., `https://your-backend.onrender.com`).
4. Vercel will automatically build the static output export using the configuration in `vercel.json`.
