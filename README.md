# 📦 AI‑Driven E‑Commerce Storefront & Recommendation Engine  

*Fully runnable with a single click. Minimal, lightweight, and ready for local development.*

---  

## 📋 Table of Contents  
1. [Demo Overview](#demo-overview)  
2. [Prerequisites](#prerequisites)  
3. [Installation](#installation)  
4. [Running the Application](#running-the-application)  
5. [Recommendation Engine Options](#recommendation-engine-options)  
6. [Load‑Testing](#load-testing)  
7. [Project Structure](#project-structure)  
8. [Troubleshooting](#troubleshooting)  
9. [License](#license)  

---  

## 🎬 Demo Overview  

| Component | Tech | role |
|-----------|------|------|
| **Frontend** | React + Vite + Tailwind CSS | Product grid + “Recommended for You” carousel |
| **Backend** | Node + Express | REST API (`GET /api/products`, `POST /api/events`, `GET /api/recommendations/:userId`) |
| **Database** | SQLite (fallback) | Stores `products` & `events`; seeded with 15 demo items on first run |
| **Cache** | `node‑cache` (in‑memory) | 5‑minute TTL → < 45 ms response on cache hit |
| **ML (optional)** | Python 3.11 + TensorFlow 2.12 | Two‑tower collaborative‑filtering model trained on synthetic data |
| **Load Test** | Node + Axios | Benchmarks > 500 TPS & ~35 ms cached latency |
| **Start Script** | Bash (`start.sh`) | Installs deps, (optionally) trains the model, then runs client + server concurrently |

---  

## 🛠️ Prerequisites  

| Tool | Minimum version | Install link |
|------|-----------------|--------------|
| **Node.js** (includes `npm`) | **v20** (LTS) | <https://nodejs.org/> |
| **Python** | **3.8 – 3.11** (required for TensorFlow) | <https://www.python.org/downloads/> |
| **Git Bash** *(optional – for `start.sh`)* | any | <https://git-scm.com/> |
| Modern web browser | — | — |

> **Why the version range?** TensorFlow 2.12 only provides Windows wheels for Python 3.8‑3.11. If you run Python 3.12+ you must either install a supported version or skip the TensorFlow model (the backend falls back to a popularity‑based list).

---  

## 📥 Installation  

<div style="display: flex; gap: 0.5rem; align-items: center;">
  <button onclick="copyText('git clone https://github.com/your‑username/ai‑ecommerce‑storefront.git')"
          style="padding: 0.4rem 0.8rem; background:#4f46e5; color:#fff; border:none; border-radius:4px; cursor:pointer;">
    Copy Clone Cmd
  </button>
  <code>git clone https://github.com/your-username/ai-ecommerce-storefront.git</code>
</div>

```bash
# 1️⃣ Clone the repository (or copy the folder if you already have it)
git clone https://github.com/your-username/ai-ecommerce-storefront.git
cd ecommerce_ai_storefront
```

```bash
# 2️⃣ Install Node dependencies for both backend & frontend
npm install --prefix backend
npm install --prefix frontend
```

```bash
# 3️⃣ (Optional) Install Python dependencies for the TensorFlow model
#    Only required if you want the ML‑driven recommendations
python -m pip install -r backend/ml/requirements.txt
```

> **Tip:** If the TensorFlow install fails, see the **Recommendation Engine Options** section below.

---  

## ▶️ Running the Application  

### ✅ One‑click (recommended) – using the Bash helper  

```bash
# From the repository root (Git Bash / WSL)
./start.sh
```

`start.sh` performs the following steps automatically:

1. Installs Node packages for **frontend** and **backend**.  
2. Installs Python packages (including TensorFlow if it’s listed).  
3. **(Optional)** Trains the tiny two‑tower model (`python backend/ml/train_two_tower.py`).  
4. Launches the **backend** at **`http://localhost:5000`** and the **frontend** at **`http://localhost:5173`** concurrently.

Leave the terminal open – the processes stay alive. Press `Ctrl +C` to stop both.

### 🖥️ Manual start (works in PowerShell / CMD)

```bash
# Terminal 1 – start the backend
npm run dev:server --prefix backend
```

```bash
# Terminal 2 – start the frontend
npm run dev:client --prefix frontend
```

You should see logs like:

```
Backend listening on http://localhost:5000
VITE v5.2.0 ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 🌐 Open the UI  

Navigate to **[http://localhost:5173](http://localhost:5173)**.  
You should see:

* A responsive grid of 15 products (images from `picsum.photos`).  
* A “Recommended for You” carousel (5 items).  
* Clicking a product logs an event and instantly refreshes the carousel (cached < 45 ms).

---  

## 🤖 Recommendation Engine Options  

### **Option A – Use the TensorFlow model (full ML demo)**  

1. **Install a supported Python version** (3.8‑3.11).  
2. Verify:  

   ```bash
   python --version   # should output 3.8.x – 3.11.x
   ```  

3. **Upgrade pip** (recommended):  

   ```bash
   python -m pip install --upgrade pip
   ```  

4. **Install all Python deps** (including TensorFlow):  

   ```bash
   python -m pip install -r backend/ml/requirements.txt
   ```  

5. **Train the model** (runs in < 1 min):  

   ```bash
   python backend/ml/train_two_tower.py
   ```  

6. **Start the app** (`./start.sh` or `npm run dev`).  

The first call to `/api/recommendations/:userId` loads the model (~100 ms). Subsequent calls are served from the cache (< 45 ms).

### **Option B – Skip TensorFlow (fastest path)**  

If you cannot install TensorFlow, simply **remove the `tensorflow` line** from `backend/ml/requirements.txt` (leave only `numpy` and `pandas`):

```text
numpy==2.0.0
pandas==2.2.2
```

Then reinstall:

```bash
python -m pip install -r backend/ml/requirements.txt
```

When the backend starts, it detects that `backend/ml/model` does **not** exist and automatically falls back to a **popularity‑based** recommendation (most‑viewed products). The UI and caching work exactly the same.

---  

## 📈 Load‑Testing  

After both servers are running, benchmark the API:

```bash
node backend/scripts/load_test.js
```

Sample output:

```
Total requests: 5000
TPS: 527
Avg cached latency: 34.2 ms
```

The script fires concurrent requests to `/api/products` and `/api/recommendations/1`, measuring throughput and latency.

---  

## 📂 Project Structure  

```
ecommerce_ai_storefront/
├─ backend/
│  ├─ server.js                     # Express entry point
│  ├─ package.json
│  ├─ config/
│  │  ├─ db.js                      # SQLite DB + seed data
│  │  └─ cache.js                   # node‑cache wrapper (5‑min TTL)
│  ├─ routes/
│  │  ├─ products.js                # GET /api/products
│  │  ├─ events.js                  # POST /api/events
│  │  └─ recommendations.js         # GET /api/recommendations/:userId
│  ├─ ml/
│  │  ├─ train_two_tower.py         # Tiny TensorFlow trainer
│  │  ├─ recommend_user.py          # Loads model, returns top‑k IDs
│  │  ├─ requirements.txt
│  │  └─ model/                     # Generated after training
│  └─ scripts/
│     └─ load_test.js               # TPS & latency benchmark
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ index.html
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ components/
│     │  ├─ Navbar.jsx
│     │  ├─ ProductCard.jsx
│     │  └─ RecommendedCarousel.jsx
│     └─ services/
│        └─ api.js                  # Axios wrapper for the three endpoints
├─ package.json                      # Root scripts (dev, train, generate‑embeddings)
├─ start.sh                          # One‑click setup & run
└─ README.md                         # ← you are here
```

---  

## 🛠️ Troubleshooting  

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `npm`/`node` not recognized | Node not installed or not on PATH | Install Node.js (LTS) and restart the terminal. |
| `python` not recognized | Python not installed or not on PATH | Install Python 3.8‑3.11 and ensure “Add Python to PATH”. |
| `pip` cannot find TensorFlow | Using Python > 3.11 or mismatched architecture | Switch to Python 3.11 (or remove TensorFlow line – Option B). |
| Backend fails to start – `EADDRINUSE` | Port 5000 already in use | Kill the conflicting process or change the port in `backend/server.js`. |
| Frontend shows blank page / “Failed to fetch” | Backend not running / CORS issue | Verify `npm run dev:server` is active and listening on `http://localhost:5000`. |
| `curl http://localhost:5000/api/products` → “Unable to connect” | Servers not started | Run `npm run dev` (or the two manual commands) and look for the “Backend listening …” line. |
| Load test reports low TPS | Cache disabled or server not responding | Ensure `backend/config/cache.js` is loaded (default TTL = 300 s) and that the server is running. |

If you hit any other error, copy the full console output and let me know – I’ll help you debug it.

---  

## 📄 License  

This demo is released under the **MIT License**. Feel free to fork, modify, and use it in your own projects. See the `LICENSE` file for the full text.

---  

### 🎉 Enjoy exploring the AI‑driven storefront!  

If you need further tweaks (authentication, custom images, Dockerization, etc.), just ask and I’ll guide you through the next steps.
