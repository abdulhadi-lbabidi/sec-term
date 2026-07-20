import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../../../hooks/useLocalization';
import { FolderOpen, Scale, Layers, Package, Gift, Star, ArrowLeft, Shield, Users as UsersIcon, Menu } from 'lucide-react';
import { useSidebar } from '../../ui/sidebar';

interface HeaderProps {
  headerAction: React.ReactNode;
}

export const Header = ({ headerAction }: HeaderProps) => {
  const { t, i18n } = useLocalization();
  const { toggleSidebar, isMobile } = useSidebar();
  const location = useLocation();
  const isRtl = i18n.language === 'ar';

  const isCategoriesPage = location.pathname === '/admin/categories';
  const isSizesPage = location.pathname === '/admin/products/sizes';
  const isMaterialsPage = location.pathname === '/admin/products/materials';
  const isProductsPage = location.pathname === '/admin/products';
  const isPackagesPage = location.pathname === '/admin/packages';
  const isReviewsPage = location.pathname === '/admin/reviews';
  const isRolesPage = location.pathname === '/admin/roles';
  const isAddRolePage = location.pathname === '/admin/roles/add';
  const isEditRolePage = location.pathname.startsWith('/admin/roles/edit/');
  const isUsersPage = location.pathname === '/admin/users';
  const isAddVariantPage = location.pathname.startsWith('/admin/products/add-variant/') || location.pathname.startsWith('/admin/products/edit-variant/');
  const isAddProductPage = location.pathname === '/admin/products/add' || location.pathname.startsWith('/admin/products/edit/');

  return (
    <header className="border-b border-black/5 bg-[#fefcfa]/90 px-4 py-3 backdrop-blur md:px-8 md:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {isCategoriesPage || isSizesPage || isMaterialsPage || isProductsPage || isPackagesPage || isReviewsPage || isRolesPage || isAddRolePage || isEditRolePage || isUsersPage || isAddVariantPage || isAddProductPage ? (
          <>
            <div className="flex items-start gap-2.5 min-w-0">
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="rounded-full bg-black/5 p-2 text-black hover:bg-black/10 transition-colors cursor-pointer shrink-0 mt-0.5"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-4 w-4" />
                </button>
              )}
              {(isAddProductPage || isAddVariantPage || isAddRolePage || isEditRolePage) && (
                <button
                  onClick={() => window.history.back()}
                  className="rounded-full bg-black/5 p-2 text-black hover:bg-black/10 transition-colors shrink-0 mt-0.5"
                >
                  <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}
              <div className="rounded-xl bg-black/5 p-1.5 text-black shrink-0">
                {isCategoriesPage && <FolderOpen className="h-5 w-5" />}
                {(isProductsPage || isAddVariantPage || isAddProductPage) && <Package className="h-5 w-5" />}
                {isSizesPage && <Scale className="h-5 w-5" />}
                {isMaterialsPage && <Layers className="h-5 w-5" />}
                {isPackagesPage && <Gift className="h-5 w-5" />}
                {isReviewsPage && <Star className="h-5 w-5" />}
                {(isRolesPage || isAddRolePage || isEditRolePage) && <Shield className="h-5 w-5" />}
                {isUsersPage && <UsersIcon className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-black tracking-tight text-black sm:text-base md:text-lg leading-tight">
                  {isCategoriesPage && t('admin.manage_categories')}
                  {isProductsPage && (isRtl ? 'إدارة المنتجات' : 'Manage Products')}
                  {isAddProductPage && (location.pathname.includes('/edit/') ? (isRtl ? 'تعديل المنتج' : 'Edit Product') : (isRtl ? 'إضافة منتج جديد' : 'Add New Product'))}
                  {isAddVariantPage && (location.pathname.includes('/edit-variant/') ? (isRtl ? 'تعديل المتغير' : 'Edit Variant') : (isRtl ? 'إضافة متغيرات المنتج' : 'Add Product Variant'))}
                  {isSizesPage && t('admin.manage_sizes')}
                  {isMaterialsPage && t('admin.manage_materials')}
                  {isPackagesPage && t('admin.manage_packages')}
                  {isReviewsPage && (isRtl ? 'المراجعات' : 'Reviews')}
                  {isRolesPage && t('admin.roles')}
                  {isAddRolePage && t('admin.add_new_role')}
                  {isEditRolePage && t('admin.edit_role')}
                  {isUsersPage && t('admin.users')}
                </h1>
                <p className="text-[10px] text-black/50 sm:text-xs mt-0.5 leading-normal max-w-[200px] sm:max-w-xs md:max-w-md">
                  {isCategoriesPage && t('admin.categories_description')}
                  {isProductsPage && (isRtl ? 'إدارة منتجات الفرن والمخبوزات' : 'Manage oven products and bakery items')}
                  {isAddProductPage && (isRtl ? 'إدارة تفاصيل المنتج مثل الاسم والصور' : 'Manage product details like name and images')}
                  {isAddVariantPage && (isRtl ? 'إدارة تفاصيل متغير المنتج كالحجم والسعر والمادة' : 'Manage variant details like size, price, and material')}
                  {isSizesPage && t('admin.sizes_description')}
                  {isMaterialsPage && t('admin.materials_description')}
                  {isPackagesPage && t('admin.packages_description')}
                  {isReviewsPage && (isRtl ? 'إدارة المراجعات وتقييمات العملاء' : 'Manage customer reviews and ratings')}
                  {isRolesPage && (isRtl ? 'إدارة أدوار وصلاحيات النظام' : 'Manage system roles and permissions')}
                  {isAddRolePage && (isRtl ? 'إعداد الأدوار الجديدة وتحديد الصلاحيات الخاصة بها' : 'Create new system roles and select their specific permissions')}
                  {isEditRolePage && (isRtl ? 'تعديل تفاصيل الدور والتحكم في صلاحياته النشطة' : 'Edit role details and control its active permissions')}
                  {isUsersPage && (isRtl ? 'إدارة حسابات المستخدمين النشطين وصلاحياتهم' : 'Manage active user accounts and their permissions')}
                </p>
              </div>
            </div>
            <div className="shrink-0 self-end sm:self-auto">
              {headerAction}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="rounded-full bg-black/5 p-2 text-black hover:bg-black/10 transition-colors cursor-pointer shrink-0"
                aria-label="Toggle menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-black/45">
                {t('admin.brand')}
              </div>
              <h1 className="text-base font-black tracking-tight text-black sm:text-lg">
                {t('admin.workspace')}
              </h1>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
