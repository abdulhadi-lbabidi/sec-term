import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  ChevronRight,
  PanelLeft,
  Globe,
  FolderOpen,
  Gift,
  Star,
  Shield,
} from 'lucide-react';
import { useLocalization } from '../../../hooks/useLocalization';
import { useSidebar } from '../../../components/ui/sidebar';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/Admin/axios';

type SubItem = {
  label: string;
  to: string;
  permission?: string;
};

type SidebarItem = {
  key: string;
  label: string;
  to?: string;
  icon: React.ElementType;
  permission?: string;
  subItems?: SubItem[];
};

export const AdminSidebar = () => {
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();
  const { t, i18n, toggleLanguage } = useLocalization();
  const { user, roles, hasPermission } = useAuth();
  const collapsed = state === 'collapsed';

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch {
    } finally {
      localStorage.removeItem('nouh_carting_roken');
      window.location.href = '/admin/login';
    }
  };

  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({
    Products: true,
    Sales: true,
    Auth: true,
  });

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items: SidebarItem[] = [
    { key: 'dashboard', label: t('admin.dashboard'), to: '/admin/dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
    { key: 'categories', label: t('admin.categories'), to: '/admin/categories', icon: FolderOpen, permission: 'view_category' },
    { key: 'reviews', label: t('admin.reviews'), to: '/admin/reviews', icon: Star, permission: 'view_review' },
    { key: 'packages', label: t('admin.packages'), to: '/admin/packages', icon: Gift, permission: 'view_package' },
    {
      key: 'Products',
      label: t('admin.products'),
      icon: Package,
      subItems: [
        { label: t('admin.products'), to: '/admin/products', permission: 'view_product' },
        { label: t('admin.sizes'), to: '/admin/products/sizes', permission: 'view_size' },
        { label: t('admin.materials'), to: '/admin/products/materials', permission: 'view_material' }
      ]
    },
    {
      key: 'Sales',
      label: i18n.language === 'ar' ? 'المبيعات' : 'Sales',
      icon: ShoppingCart,
      subItems: [
        { label: t('admin.orders'), to: '/admin/orders', permission: 'view_order' },
        { label: t('admin.checkouts'), to: '/admin/checkouts', permission: 'view_checkout' }
      ]
    },
    {
      key: 'Auth',
      label: i18n.language === 'ar' ? 'المستخدمين والصلاحيات' : 'Auth',
      icon: Shield,
      subItems: [
        { label: t('admin.users'), to: '/admin/users', permission: 'view_user' },
        { label: t('admin.roles'), to: '/admin/roles', permission: 'view_role' }
      ]
    },
  ];

  const filteredItems = items
    .map((item) => {
      if (item.subItems) {
        const visibleSubItems = item.subItems.filter(
          (sub) => !sub.permission || hasPermission(sub.permission)
        );
        return { ...item, subItems: visibleSubItems };
      }
      return item;
    })
    .filter((item) => {
      if (item.subItems) {
        return item.subItems.length > 0;
      }
      return !item.permission || hasPermission(item.permission);
    });

  return (
    <aside className="flex h-full w-full flex-col border-r border-[#2d0d39]/10 bg-[#fefcfa] text-black shadow-[8px_0_40px_rgba(45,13,57,0.04)]">
      <div className={`flex items-center border-b border-black/5 px-4 py-4 min-h-[73px] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          user ? (
            <div className="flex flex-col text-start max-w-[150px] overflow-hidden">
              <span className="text-xs font-black text-black leading-tight truncate">{user.name}</span>
              <span className="text-[10px] text-black/55 truncate leading-tight mt-0.5">{user.email}</span>
              {roles && roles.length > 0 && (
                <span className="inline-block w-fit mt-1 rounded-md bg-black/5 px-1.5 py-0.5 text-[9px] font-bold text-black/75 uppercase tracking-wide border border-black/10">
                  {roles[0]}
                </span>
              )}
            </div>
          ) : (
            <div className="px-2 text-xs font-semibold uppercase tracking-[0.35em] text-black">
              {t('admin.brand')}
            </div>
          )
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className="grid size-10 place-items-center rounded-full border border-black/10 bg-white text-black transition-colors hover:bg-black hover:text-white shrink-0"
          aria-label={t('admin.toggle_sidebar')}
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
      
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            if (item.subItems) {
              const hasActiveSub = item.subItems.some(sub => location.pathname === sub.to);
              const isOpen = !!openMenus[item.key];

              return (
                <li key={item.key} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => !collapsed && toggleMenu(item.key)}
                    className={`w-full group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition-all cursor-pointer ${hasActiveSub
                        ? 'bg-black/5 text-black'
                        : 'text-black/70 hover:bg-black/5 hover:text-black'
                      }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={`flex items-center ${collapsed ? 'gap-0' : 'gap-3'}`}>
                      <span
                        className={`grid size-9 place-items-center rounded-xl transition-colors ${hasActiveSub ? 'bg-black/10' : 'bg-black/5 group-hover:bg-white'
                          }`}
                      >
                        <item.icon size={16} />
                      </span>
                      {!collapsed && <span>{item.label}</span>}
                    </span>
                    {!collapsed && (
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rtl:rotate-180'
                          }`}
                      />
                    )}
                  </button>
                  {isOpen && !collapsed && (
                    <ul className="space-y-1 ltr:pl-12 rtl:pr-12">
                      {item.subItems.map((sub) => {
                        const subActive = location.pathname === sub.to;
                        return (
                          <li key={sub.to}>
                            <Link
                              to={sub.to}
                              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${subActive
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
                  className={`group flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition-all ${active
                      ? 'bg-black text-white shadow-lg shadow-black/15'
                      : 'text-black/70 hover:bg-black/5 hover:text-black'
                    }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`flex items-center ${collapsed ? 'gap-0' : 'gap-3'}`}>
                    <span
                      className={`grid size-9 place-items-center rounded-xl transition-colors ${active ? 'bg-white/10' : 'bg-black/5 group-hover:bg-white'
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

      <div className="border-t border-black/5 p-4 space-y-3 flex flex-col items-center">
        {collapsed ? (
          <>
            <button
              type="button"
              onClick={toggleLanguage}
              className="grid size-10 place-items-center rounded-full border border-black/10 bg-white text-black hover:bg-black/5 cursor-pointer"
              title={i18n.language === 'en' ? 'Arabic' : 'English'}
            >
              <span className="text-[10px] font-black">{i18n.language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="grid size-10 place-items-center rounded-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
              title={t('admin.logout')}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 w-full">
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
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-red-600 hover:bg-red-100 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t('admin.logout')}</span>
              <LogOut size={14} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
