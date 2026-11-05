// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import ProductCard from './components/ProductCard.jsx';
import RecommendedCarousel from './components/RecommendedCarousel.jsx';
import { getProducts, getRecommendations, logEvent } from './services/api.js';

const USER_ID = 1; // hard‑coded demo user

export default function App() {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Load product catalog
  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  // Load recommendations for demo user
  useEffect(() => {
    getRecommendations(USER_ID).then(res => setRecommendations(res.recommendations)).catch(console.error);
  }, []);

  // Handle product click – log event and (optional) refresh recommendations
  const handleProductClick = async (productId) => {
    await logEvent({ userId: USER_ID, productId, type: 'click' });
    // Refresh recommendations (cached, fast)
    getRecommendations(USER_ID).then(res => setRecommendations(res.recommendations)).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p.id)} />
          ))}
        </div>
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
          <RecommendedCarousel
            productIds={recommendations}
            allProducts={products}
            onProductClick={handleProductClick}
          />
        </section>
      </main>
    </div>
  );
}
