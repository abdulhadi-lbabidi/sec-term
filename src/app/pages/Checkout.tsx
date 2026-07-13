import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const Checkout = () => {
  const { items, subtotal, discount, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert('Your cart is empty!');
    // Process checkout...
    clearCart();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="font-playfair text-4xl text-black mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 font-dm-sans">Thank you for your order from Nouh's Catering.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-dm-sans">
      <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Delivery Form */}
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Delivery Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-3 py-2 border" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input required type="tel" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-3 py-2 border" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-3 py-2 border" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black px-3 py-2 border" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-black text-cream py-3 px-4 rounded hover:bg-gray-800 transition text-white">
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
          <div className="space-y-3 mb-4 border-b pb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Bulk Discount applied</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
