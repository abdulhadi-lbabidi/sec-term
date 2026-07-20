import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SidebarProvider, useSidebar } from '../../../components/ui/sidebar';
import { Sheet, SheetContent } from '../../../components/ui/sheet';
import { AdminSidebar } from '../../../components/Admin/Layout/Sidebar';
import { Header } from '../../../components/Admin/Layout/Header';
import { useAuth } from '../../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminLayoutContent = () => {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const collapsed = state === 'collapsed';
  const [headerAction, setHeaderAction] = useState<React.ReactNode | null>(null);

  return (
    <div className="flex w-full min-h-screen bg-[#fcfaf7] text-black font-cairo">
      {!isMobile && (
        <div
          className={`sticky top-0 h-screen shrink-0 overflow-hidden border-r border-black/5 transition-[width] duration-300 ${collapsed ? 'w-[88px]' : 'w-[260px]'
            }`}
        >
          <AdminSidebar />
        </div>
      )}

      {isMobile && (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side="left" className="w-[260px] p-0 border-r border-black/5 bg-[#fefcfa]">
            <div className="h-full w-full">
              <AdminSidebar />
            </div>
          </SheetContent>
        </Sheet>
      )}

      <div className="flex w-full flex-1 flex-col min-w-0">
        <Header headerAction={headerAction} />

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
  const { isLoading } = useAuth();
  const token = localStorage.getItem('nouh_carting_roken');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#fcfaf7]">
        <Loader2 className="h-8 w-8 animate-spin text-black/45" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <AdminLayoutContent />
    </SidebarProvider>
  );
};
