import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AdminDashboard, Layout as AdminLayout } from '../pages/Admin/Layout';
import { Categories } from '../pages/Admin/Categories/Categories';
import { Sizes } from '../pages/Admin/Products/Sizes/Sizes';
import { Materials } from '../pages/Admin/Products/Materials/Materials';
import { Products } from '../pages/Admin/Products/ProductPages/Products';
import { AddProduct } from '../pages/Admin/Products/ProductPages/AddProduct';
import { AddProductVariant } from '../pages/Admin/Products/ProductPages/AddProductVariant';
import { Reviews } from '../pages/Admin/Reviews/Reviews';
import { Packages } from '../pages/Admin/Packages/Packages';
import { Login } from '../pages/Admin/Login';

export const AdminRoutes = (
  <>
    <Route path="/admin/login" element={<Login />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="categories" element={<Categories />} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="products" element={<Products />} />
      <Route path="products/add" element={<AddProduct />} />
      <Route path="products/edit/:id" element={<AddProduct />} />
      <Route path="products/add-variant/:productId" element={<AddProductVariant />} />
      <Route path="products/edit-variant/:variantId" element={<AddProductVariant />} />
      <Route path="products/sizes" element={<Sizes />} />
      <Route path="products/materials" element={<Materials />} />
      <Route path="packages" element={<Packages />} />
      <Route path="client" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
    <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
  </>
);

