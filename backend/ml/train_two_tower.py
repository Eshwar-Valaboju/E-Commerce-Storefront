// backend/ml/train_two_tower.py
import os
import json
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from pathlib import Path

# Settings
NUM_USERS = 100
NUM_ITEMS = 15
EMBED_DIM = 8
EPOCHS = 5
BATCH_SIZE = 32

# Synthetic interaction data (user_id, item_id, rating)
np.random.seed(42)
interactions = []
for _ in range(5000):
    user_id = np.random.randint(1, NUM_USERS + 1)
    item_id = np.random.randint(1, NUM_ITEMS + 1)
    rating = np.random.choice([1, 2, 3, 4, 5])
    interactions.append([user_id, item_id, rating])

df = pd.DataFrame(interactions, columns=["user_id", "item_id", "rating"])

# Build Two‑Tower model
user_input = layers.Input(shape=(), dtype="int32", name="user_id")
item_input = layers.Input(shape=(), dtype="int32", name="item_id")

user_emb = layers.Embedding(input_dim=NUM_USERS + 1, output_dim=EMBED_DIM, name="user_embedding")(user_input)
item_emb = layers.Embedding(input_dim=NUM_ITEMS + 1, output_dim=EMBED_DIM, name="item_embedding")(item_input)

# Flatten embeddings
user_vec = layers.Flatten()(user_emb)
item_vec = layers.Flatten()(item_emb)

# Dot product and prediction
dot = layers.Dot(axes=1)([user_vec, item_vec])
output = layers.Activation('sigmoid')(dot)  # predict rating relevance (0‑1)

model = keras.Model(inputs=[user_input, item_input], outputs=output)
model.compile(optimizer='adam', loss='binary_crossentropy')

# Prepare training data (binary relevance)
ratings = (df["rating"] > 3).astype(int).values
train_dataset = tf.data.Dataset.from_tensor_slices(((df["user_id"].values, df["item_id"].values), ratings))
train_dataset = train_dataset.shuffle(10000).batch(BATCH_SIZE)

model.fit(train_dataset, epochs=EPOCHS, verbose=2)

# Save model
model_dir = Path(__file__).parent / "model"
model_dir.mkdir(parents=True, exist_ok=True)
model.save(str(model_dir))

# Export item embeddings to JSON for quick lookup
item_embedding_layer = model.get_layer('item_embedding')
item_embeddings = item_embedding_layer.get_weights()[0]  # shape (num_items+1, embed_dim)
emb_dict = {str(i): item_embeddings[i].tolist() for i in range(1, NUM_ITEMS + 1)}
with open(model_dir / "item_embeddings.json", "w") as f:
    json.dump(emb_dict, f)

print("Training complete. Model and item_embeddings.json saved.")
