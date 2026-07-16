import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SidebarProvider, useSidebar } from '../../components/ui/sidebar';
import { AdminSidebar } from '../../components/Admin/Layout/Sidebar';
import { useLocalization } from '../../hooks/useLocalization';

const AdminLayoutContent = () => {
  const { state } = useSidebar();
  const { t } = useLocalization();
  const collapsed = state === 'collapsed';

  return (
    <div className="flex min-h-screen bg-[#fcfaf7] text-black">
      <div
        className={`sticky top-0 h-screen shrink-0 overflow-hidden border-r border-black/5 transition-[width] duration-300 ${
          collapsed ? 'w-[88px]' : 'w-[260px]'
        }`}
      >
        <AdminSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-black/5 bg-[#fefcfa]/90 px-5 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black">
                {t('admin.brand')}
              </div>
              <h1 className="mt-1 text-xl font-black tracking-tight">
                {t('admin.workspace')}
              </h1>
            </div>

          </div>
        </header>

        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export const Layout = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

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
