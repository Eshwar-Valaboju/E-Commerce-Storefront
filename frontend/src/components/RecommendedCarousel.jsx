// frontend/src/components/RecommendedCarousel.jsx
import React from 'react';

export default function RecommendedCarousel({ productIds, allProducts, onProductClick }) {
  // Map ids to product objects
  const items = productIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean);

  if (items.length === 0) {
    return <p className="text-gray-500">No recommendations yet.</p>;
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-2">
      {items.map(product => (
        <div
          key={product.id}
          className="min-w-[200px] bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onProductClick(product.id)}
        >
          <img src={product.image} alt={product.title} className="w-full h-40 object-cover rounded-t-lg" />
          <div className="p-2">
            <h4 className="text-md font-medium truncate">{product.title}</h4>
            <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
