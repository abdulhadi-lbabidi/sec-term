import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/client/checkout');
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 font-dm-sans">
      <h1 className="text-3xl font-playfair font-bold text-center mb-8">Login to Nouh's Catering</h1>
      <form onSubmit={handleLogin} className="space-y-4 bg-white shadow-sm p-6 rounded-lg border">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input required type="email" placeholder="test@example.com" className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-black focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input required type="password" placeholder="••••••••" className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-black focus:ring-black" />
        </div>
        <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition">
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="text-black underline">Register</Link>
      </p>
    </div>
  );
};

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/client/checkout');
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 font-dm-sans">
      <h1 className="text-3xl font-playfair font-bold text-center mb-8">Create an Account</h1>
      <form onSubmit={handleRegister} className="space-y-4 bg-white shadow-sm p-6 rounded-lg border">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-black focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input required type="email" className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-black focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input required type="password" className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-black focus:ring-black" />
        </div>
        <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
};
