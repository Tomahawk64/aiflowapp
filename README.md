# AI Flow App

A visual, node-based AI prompt tool built with React Flow, Express, Groq AI (LLaMA 3.1), and MongoDB. Type a prompt into the input node, run the flow, and watch the AI response appear in the output node — all rendered as an interactive pipeline canvas.

---

## Live Demo

**Deployed on Render:** [https://aiflowapp-1.onrender.com](https://aiflowapp-1.onrender.com)

> **Note:** The backend is hosted on Render's free tier, which spins down after inactivity. On your first request, **please allow up to 30 seconds** for the backend to start up. Once it's awake, subsequent requests will be fast.

---

## Features

- Interactive node-based canvas powered by **React Flow**
- Real-time AI responses via **Groq API** (LLaMA 3.1 8B Instant model)
- Save prompt/response pairs to **MongoDB**
- Animated edge connecting Input Node → Output Node
- Live backend connection indicator
- Character counters on both nodes
- MiniMap and canvas controls built in

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| React Flow 11 | Visual node canvas |
| Axios | HTTP requests to backend |
| Create React App | Build toolchain |

### Backend
| Technology | Purpose |
|---|---|
| Node.js / Express | REST API server |
| Mongoose | MongoDB ODM |
| Axios | Calls to Groq AI API |
| CORS | Cross-origin request handling |
| dotenv | Environment variable management |
| Nodemon | Auto-restart in development |

### External Services
| Service | Purpose |
|---|---|
| Groq API | LLaMA 3.1 8B Instant inference |
| MongoDB Atlas | Persistent storage for flow entries |
| Render | Cloud deployment (backend + frontend) |

---

## How to Use the App

### 1. Open the App
Navigate to [https://aiflowapp-1.onrender.com](https://aiflowapp-1.onrender.com).

If the backend is cold-started, a "Connecting..." indicator will appear. Wait up to **30 seconds** for it to become active.

### 2. Enter a Prompt
Click inside **Node 1** (the Input Node on the left side of the canvas). Type any natural-language prompt — a question, a task, or anything you'd like the AI to respond to.

### 3. Run the Flow
Click the **"Run Flow"** button in the toolbar at the top. The app sends your prompt to the backend, which forwards it to the Groq LLaMA 3.1 AI model.

### 4. View the Response
The AI response will appear in **Node 2** (the Output Node on the right). While waiting, a loading animation (three dots) is displayed.

### 5. Save the Flow (Optional)
Once a response is generated, click the **"Save"** button to persist the prompt and response pair to MongoDB. A success message will confirm the save.

### 6. Run Again
Clear the input and type a new prompt to start a new flow anytime.

---

## API Endpoints

| Method | Endpoint | Body | Response | Description |
|---|---|---|---|---|
| `GET` | `/` | — | `{ message }` | Health check |
| `POST` | `/api/ask-ai` | `{ prompt: string }` | `{ reply: string }` | Sends prompt to Groq LLaMA 3.1, returns AI reply |
| `POST` | `/api/save` | `{ prompt: string, response: string }` | `{ message: string }` | Saves prompt + response to MongoDB |

---

## Running Locally

### Prerequisites
- Node.js (v16 or higher)
- npm
- A [Groq API key](https://console.groq.com/) (free tier available)
- A MongoDB URI (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd aiflowapp
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start       # without nodemon
```

The backend will run at `http://localhost:5000`.

### 3. Set Up the Frontend

```bash
cd frontend
npm install
```

For local development, the frontend proxies API requests to `http://localhost:5000` automatically (configured in `package.json`), so no extra env file is needed.

Start the frontend:

```bash
npm start
```

The app will open at `http://localhost:3000`.

### 4. (Production Only) Frontend Environment Variable

If building for production, create a `.env` file in `frontend/`:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

Then build:

```bash
npm run build
```

---

## Project Structure

```
aiflowapp/
├── backend/
│   ├── server.js           # Express server entry point
│   ├── package.json
│   ├── models/
│   │   └── FlowEntry.js    # Mongoose schema (prompt, response, createdAt)
│   └── routes/
│       └── api.js          # /api/ask-ai and /api/save routes
│
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                  # Root component, state management, React Flow canvas
        ├── index.js                # React entry point
        ├── components/
        │   ├── InputNode.js        # Custom node: textarea for prompt input
        │   └── OutputNode.js       # Custom node: displays AI response
        └── styles/
            └── App.css
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `GROQ_API_KEY` | Yes | API key from [console.groq.com](https://console.groq.com/) |
| `PORT` | No | Server port (default: `5000`) |
| `FRONTEND_URL` | No | Allowed CORS origin for production |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | Production only | Backend base URL (not needed for local dev) |

---

## AI Model

This app uses **Groq's hosted LLaMA 3.1 8B Instant** model (`llama-3.1-8b-instant`):

- Fast, low-latency inference via Groq's LPU hardware
- Free tier available at [console.groq.com](https://console.groq.com/)
- Temperature: `0.7` (balanced creativity and accuracy)

---

## Deployment Notes (Render)

- The backend is deployed as a **Web Service** on Render's free tier.
- The frontend is served as a **Static Site** on Render.
- Free-tier services spin down after 15 minutes of inactivity — the first request after inactivity may take **up to 30 seconds** to respond while the service wakes up.
- Set all backend environment variables in the Render dashboard under **Environment**.
- Set `REACT_APP_API_URL` to your backend's Render URL when deploying the frontend.

---

## License

MIT
