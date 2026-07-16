import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  PanelLeft,
  Globe,
  FolderOpen,
} from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useSidebar } from '../../../components/ui/sidebar';

type SidebarItem = {
  label: string;
  to: string;
  icon: React.ElementType;
};

export const AdminSidebar = () => {
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();
  const { t, i18n, toggleLanguage } = useLocalization();
  const collapsed = state === 'collapsed';
  const isRtl = i18n.language === 'ar';

  const items: SidebarItem[] = [
    { label: t('admin.dashboard'), to: '/admin/dashboard', icon: LayoutDashboard },
    { label: isRtl ? 'الفئات' : 'Categories', to: '/admin/categories', icon: FolderOpen },
    { label: t('admin.products'), to: '/admin/products', icon: Package },
    { label: t('admin.orders'), to: '/admin/orders', icon: ShoppingCart },
    { label: t('admin.customers'), to: '/admin/customers', icon: Users },
    { label: t('admin.analytics'), to: '/admin/analytics', icon: BarChart3 },
    { label: t('admin.settings'), to: '/admin/settings', icon: Settings },
  ];


  return (
    <aside className="flex h-full w-full flex-col border-r border-[#2d0d39]/10 bg-[#fefcfa] text-black shadow-[8px_0_40px_rgba(45,13,57,0.04)]">
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-4">
        <div className="px-2 text-xs font-semibold uppercase tracking-[0.35em] text-black">
          {collapsed ? 'BA' : t('admin.brand')}
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="grid size-10 place-items-center rounded-full border border-black/10 bg-white text-black transition-colors hover:bg-black hover:text-white"
          aria-label={t('admin.toggle_sidebar')}
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4">
        {!collapsed && (
          <div className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.3em] text-black/35">
            {t('admin.navigation')}
          </div>
        )}
        <ul className="space-y-1">
          {items.map(({ label, to, icon: Icon }) => {
            const active = location.pathname === to;

            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition-all ${
                    active
                      ? 'bg-black text-white shadow-lg shadow-black/15'
                      : 'text-black/70 hover:bg-black/5 hover:text-black'
                  }`}
                  title={collapsed ? label : undefined}
                >
                  <span className={`flex items-center ${collapsed ? 'gap-0' : 'gap-3'}`}>
                    <span
                      className={`grid size-9 place-items-center rounded-xl transition-colors ${
                        active ? 'bg-white/10' : 'bg-black/5 group-hover:bg-white'
                      }`}
                    >
                      <Icon size={16} />
                    </span>
                    {!collapsed && <span>{label}</span>}
                  </span>
                  {!collapsed && (
                    <ChevronRight
                      size={16}
                      className={`transition-transform rtl:rotate-180 ${
                        active ? 'translate-x-0 text-white/90' : 'text-black/30 group-hover:translate-x-0.5'
                      }`}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-black/5 p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5"
            aria-label={t('admin.language')}
          >
            <Globe size={14} />
            <span>{i18n.language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          <Link
            to="/client"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5"
          >
            {t('admin.view_site')}
            <LogOut size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
};
