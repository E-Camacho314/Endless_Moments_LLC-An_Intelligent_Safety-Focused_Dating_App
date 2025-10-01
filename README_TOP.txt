Lyra — FULL Final Polished (FIX1)

Quick Start:
1) Backend
   cd backend
   pip install -r requirements.txt
   export DATABASE_URL=sqlite:///./lyra.db
   uvicorn app.main:app --reload --port 8000
   python -c "from app.seed import run; run()"

2) Web
   cd apps/web
   cp .env.local.example .env.local
   # set NEXT_PUBLIC_API_BASE=http://localhost:8000
   npm i && npm run dev

3) Mobile (Expo)
   cd apps/mobile
   echo "EXPO_PUBLIC_API_BASE=http://10.0.2.2:8000" > .env
   npm i && npm start
