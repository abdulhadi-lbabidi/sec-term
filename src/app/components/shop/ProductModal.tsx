import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const ProductModal = ({ product, onClose }: { product: any, onClose: () => void }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-dm-sans">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 flex flex-col md:flex-row gap-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          ✕
        </button>
        <div className="w-full md:w-1/2">
          <img src={product.image || 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80'} alt={product.name} className="w-full h-auto object-cover rounded-md" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-2">{product.name}</h2>
          <p className="text-xl text-gray-700 mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6 flex-grow">{product.description || "A delicious premium pastry crafted with the finest ingredients."}</p>
          
          <div className="bg-gray-50 p-4 rounded mb-6 border border-gray-100">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Volume Discounts</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Buy 5+ items: Get <span className="text-black font-bold">10% OFF</span></li>
              <li>• Buy 10+ items: Get <span className="text-black font-bold">20% OFF</span></li>
            </ul>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex items-center border rounded">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 hover:bg-gray-100">-</button>
              <span className="px-4 border-l border-r py-1">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
            </div>
            <button onClick={handleAdd} className="flex-grow bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
