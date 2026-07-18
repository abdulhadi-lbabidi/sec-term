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
  Gift,
  Star,
} from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useSidebar } from '../../../components/ui/sidebar';

type SubItem = {
  label: string;
  to: string;
};

type SidebarItem = {
  label: string;
  to?: string;
  icon: React.ElementType;
  subItems?: SubItem[];
};

export const AdminSidebar = () => {
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();
  const { t, i18n, toggleLanguage } = useLocalization();
  const collapsed = state === 'collapsed';
  const isRtl = i18n.language === 'ar';

  const [isProductsOpen, setIsProductsOpen] = React.useState(true);

  const items: SidebarItem[] = [
    { label: t('admin.dashboard'), to: '/admin/dashboard', icon: LayoutDashboard },
    { label: isRtl ? 'الفئات' : 'Categories', to: '/admin/categories', icon: FolderOpen },
    { label: isRtl ? 'المراجعات' : 'Reviews', to: '/admin/reviews', icon: Star },
    { label: isRtl ? 'الباقات' : 'Packages', to: '/admin/packages', icon: Gift },
    {
      label: t('admin.products'),
      icon: Package,
      subItems: [
        { label: isRtl ? 'المنتجات' : 'Products', to: '/admin/products' },
        { label: isRtl ? 'الأحجام' : 'Sizes', to: '/admin/products/sizes' },
        { label: isRtl ? 'المكونات' : 'Materials', to: '/admin/products/materials' }
      ]
    },
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

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {!collapsed && (
          <div className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.3em] text-black/35">
            {t('admin.navigation')}
          </div>
        )}
        <ul className="space-y-1">
          {items.map((item) => {
            if (item.subItems) {
              const hasActiveSub = item.subItems.some(sub => location.pathname === sub.to);
              return (
                <li key={item.label} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => !collapsed && setIsProductsOpen(!isProductsOpen)}
                    className={`w-full group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition-all cursor-pointer ${
                      hasActiveSub
                        ? 'bg-black/5 text-black'
                        : 'text-black/70 hover:bg-black/5 hover:text-black'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={`flex items-center ${collapsed ? 'gap-0' : 'gap-3'}`}>
                      <span
                        className={`grid size-9 place-items-center rounded-xl transition-colors ${
                          hasActiveSub ? 'bg-black/10' : 'bg-black/5 group-hover:bg-white'
                        }`}
                      >
                        <item.icon size={16} />
                      </span>
                      {!collapsed && <span>{item.label}</span>}
                    </span>
                    {!collapsed && (
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          isProductsOpen ? 'rotate-90' : 'rtl:rotate-180'
                        }`}
                      />
                    )}
                  </button>
                  {isProductsOpen && !collapsed && (
                    <ul className="space-y-1 ltr:pl-12 rtl:pr-12">
                      {item.subItems.map((sub) => {
                        const subActive = location.pathname === sub.to;
                        return (
                          <li key={sub.to}>
                            <Link
                              to={sub.to}
                              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                                subActive
                                  ? 'bg-black text-white shadow-sm'
                                  : 'text-black/60 hover:bg-black/5 hover:text-black'
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${subActive ? 'bg-white' : 'bg-black/30'}`} />
                              <span>{sub.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const active = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to || ''}
                  className={`group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition-all ${
                    active
                      ? 'bg-black text-white shadow-lg shadow-black/15'
                      : 'text-black/70 hover:bg-black/5 hover:text-black'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`flex items-center ${collapsed ? 'gap-0' : 'gap-3'}`}>
                    <span
                      className={`grid size-9 place-items-center rounded-xl transition-colors ${
                        active ? 'bg-white/10' : 'bg-black/5 group-hover:bg-white'
                      }`}
                    >
                      <item.icon size={16} />
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-black/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5 cursor-pointer"
            aria-label={t('admin.language')}
          >
            <Globe size={14} />
            <span>{i18n.language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>{t('admin.view_site')}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            localStorage.clear();
            window.location.href = '/admin/login';
          }}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-red-600 hover:bg-red-100 transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>{t('admin.logout')}</span>
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
};
