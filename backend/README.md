# SignEase Backend

Node.js + Express + MongoDB backend for the SignEase app. Uses the same variables as the frontend: `fullName`, `email`, `level`, `streakDays`, `lessonsCompleted`, `quizScore`.

## Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `MONGODB_URI` – MongoDB connection string (default: `mongodb://localhost:27017/signease`)
   - `JWT_SECRET` – A strong secret for signing tokens
   - `PORT` – Server port (default: 5000)

3. **Start MongoDB** (if running locally)

4. **Seed lessons** (optional)
   ```bash
   node scripts/seedLessons.js
   ```

5. **Run the server**
   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/signup` | No | Register – `{ fullName, email, password }` |
| POST | `/api/auth/login` | No | Login – `{ email, password }` |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/me` | Yes | Update profile – `{ fullName, level, streakDays, lessonsCompleted, quizScore }` |
| GET | `/api/lessons` | No | List lessons |

## Frontend API URL

The frontend uses `http://localhost:5000` by default. For Android emulator, change `API_BASE_URL` in `frontend/lib/api.js` to `http://10.0.2.2:5000`.
