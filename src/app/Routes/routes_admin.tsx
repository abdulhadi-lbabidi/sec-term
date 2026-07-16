import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AdminDashboard, Layout as AdminLayout } from '../pages/Admin/Layout';
import { Categories } from '../pages/Admin/Categories/Categories';
import { Login } from '../pages/Admin/Login';

export const AdminRoutes = (
  <>
    <Route path="/admin/login" element={<Login />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="categories" element={<Categories />} />
      <Route path="client" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
    <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
  </>
);

