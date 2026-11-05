#!/usr/bin/env bash

# Exit on error
set -e

# Helper to print messages
log() { echo "[setup] $1"; }

ROOT_DIR=$(pwd)

# -------------------------------------------------
# Install Node dependencies for frontend and backend
# -------------------------------------------------
log "Installing backend dependencies..."
npm install --prefix "$ROOT_DIR/backend"

log "Installing frontend dependencies..."
npm install --prefix "$ROOT_DIR/frontend"

# -------------------------------------------------
# Install Python dependencies (if python available)
# -------------------------------------------------
if command -v python >/dev/null 2>&1; then
  log "Installing Python dependencies..."
  pip install -r "$ROOT_DIR/backend/ml/requirements.txt" --quiet
else
  log "Python not found – skipping Python dependency install."
fi

# -------------------------------------------------
# Optional: Train TensorFlow model (fast) – can be skipped
# -------------------------------------------------
if [ -f "$ROOT_DIR/backend/ml/train_two_tower.py" ]; then
  log "Training TensorFlow recommendation model..."
  python "$ROOT_DIR/backend/ml/train_two_tower.py"
else
  log "No training script found – skipping model training."
fi

# -------------------------------------------------
# Start both client and server concurrently
# -------------------------------------------------
log "Starting development servers..."
npm run dev --prefix "$ROOT_DIR"
