import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SidebarProvider, useSidebar } from '../../components/ui/sidebar';
import { AdminSidebar } from '../../components/Admin/Layout/Sidebar';
import { useLocalization } from '../../hooks/useLocalization';
import { FolderOpen, Scale, Layers, Package, Gift, Star, ArrowLeft } from 'lucide-react';

const AdminLayoutContent = () => {
  const { state } = useSidebar();
  const { t, i18n } = useLocalization();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const isRtl = i18n.language === 'ar';
  const [headerAction, setHeaderAction] = useState<React.ReactNode | null>(null);

  const isCategoriesPage = location.pathname === '/admin/categories';
  const isSizesPage = location.pathname === '/admin/products/sizes';
  const isMaterialsPage = location.pathname === '/admin/products/materials';
  const isProductsPage = location.pathname === '/admin/products';
  const isPackagesPage = location.pathname === '/admin/packages';
  const isReviewsPage = location.pathname === '/admin/reviews';
  const isAddVariantPage = location.pathname.startsWith('/admin/products/add-variant/') || location.pathname.startsWith('/admin/products/edit-variant/');
  const isAddProductPage = location.pathname === '/admin/products/add' || location.pathname.startsWith('/admin/products/edit/');

  return (
    <div className="flex w-full min-h-screen bg-[#fcfaf7] text-black">
      <div
        className={`sticky top-0 h-screen shrink-0 overflow-hidden border-r border-black/5 transition-[width] duration-300 ${collapsed ? 'w-[88px]' : 'w-[260px]'
          }`}
      >
        <AdminSidebar />
      </div>

      <div className="flex w-full flex-1 flex-col">
        <header className="border-b border-black/5 bg-[#fefcfa]/90 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            {isCategoriesPage || isSizesPage || isMaterialsPage || isProductsPage || isPackagesPage || isReviewsPage || isAddVariantPage || isAddProductPage ? (
              <>
                <div className="flex items-center gap-3">
                  {(isAddProductPage || isAddVariantPage) && (
                    <button
                      onClick={() => window.history.back()}
                      className="rounded-full bg-black/5 p-2.5 text-black hover:bg-black/10 transition-colors"
                    >
                      <ArrowLeft className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                  <div className="rounded-xl bg-black/5 p-2 text-black">
                    {isCategoriesPage && <FolderOpen className="h-6 w-6" />}
                    {(isProductsPage || isAddVariantPage || isAddProductPage) && <Package className="h-6 w-6" />}
                    {isSizesPage && <Scale className="h-6 w-6" />}
                    {isMaterialsPage && <Layers className="h-6 w-6" />}
                    {isPackagesPage && <Gift className="h-6 w-6" />}
                    {isReviewsPage && <Star className="h-6 w-6" />}
                  </div>
                  <div>
                    <h1 className="text-lg font-black tracking-tight">
                      {isCategoriesPage && t('admin.manage_categories')}
                      {isProductsPage && (isRtl ? 'إدارة المنتجات' : 'Manage Products')}
                      {isAddProductPage && (location.pathname.includes('/edit/') ? (isRtl ? 'تعديل المنتج' : 'Edit Product') : (isRtl ? 'إضافة منتج جديد' : 'Add New Product'))}
                      {isAddVariantPage && (location.pathname.includes('/edit-variant/') ? (isRtl ? 'تعديل المتغير' : 'Edit Variant') : (isRtl ? 'إضافة متغيرات المنتج' : 'Add Product Variant'))}
                      {isSizesPage && t('admin.manage_sizes')}
                      {isMaterialsPage && t('admin.manage_materials')}
                      {isPackagesPage && t('admin.manage_packages')}
                      {isReviewsPage && (isRtl ? 'المراجعات' : 'Reviews')}
                    </h1>
                    <p className="text-xs text-black/60 mt-0.5">
                      {isCategoriesPage && t('admin.categories_description')}
                      {isProductsPage && (isRtl ? 'إدارة منتجات الفرن والمخبوزات' : 'Manage oven products and bakery items')}
                      {isAddProductPage && (isRtl ? 'إدارة تفاصيل المنتج مثل الاسم والصور' : 'Manage product details like name and images')}
                      {isAddVariantPage && (isRtl ? 'إدارة تفاصيل متغير المنتج كالحجم والسعر والمادة' : 'Manage variant details like size, price, and material')}
                      {isSizesPage && t('admin.sizes_description')}
                      {isMaterialsPage && t('admin.materials_description')}
                      {isPackagesPage && t('admin.packages_description')}
                      {isReviewsPage && (isRtl ? 'إدارة المراجعات وتقييمات العملاء' : 'Manage customer reviews and ratings')}
                    </p>
                  </div>
                </div>
                <div>
                  {headerAction}
                </div>
              </>
            ) : (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black">
                  {t('admin.brand')}
                </div>
                <h1 className="mt-1 text-xl font-black tracking-tight">
                  {t('admin.workspace')}
                </h1>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-5 py-3 md:px-8 md:py-4">
          <div className="mx-auto max-w-7xl">
            <Outlet context={{ setHeaderAction }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export const Layout = () => {
  const { i18n } = useTranslation();
  const token = localStorage.getItem('nouh_carting_roken');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider defaultOpen>
      <AdminLayoutContent />
    </SidebarProvider>
  );
};

export const AdminDashboard = () => (
  <div className="rounded-2xl border border-black/10 bg-white p-8">
    <h1 className="text-3xl font-bold tracking-tight text-black">Admin Dashboard</h1>
    <p className="mt-4 max-w-2xl text-sm leading-6 text-black/70">
      This is the starting point for the admin area. You can add users, orders, products, and analytics pages under this route.
    </p>
  </div>
);
