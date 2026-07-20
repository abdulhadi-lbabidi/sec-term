import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';

interface CategoryCardProps {
  category: any;
  image?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, image }) => {
  const { language } = useAppStore();
  const name = language === 'ar' ? category.nameAr : category.nameEn;

  return (
    <Link to={`/shop?category=${category.id}`} className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 flex items-end">
      <img
        src={image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div className="relative p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-bold text-xl drop-shadow-md">{name}</h3>
        <div className="w-12 h-1 bg-[#C5A880] mt-3 rounded-full origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </Link>
  );
};
