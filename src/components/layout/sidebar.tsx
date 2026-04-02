"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Phone,
  Wallet,
  Bell,
  MessageSquare,
  LogOut,
  X,
  UserCog,
  FileClock,
  Smartphone,
  Settings,
  User,
  CreditCard,
  FileCheck,
  Receipt,
  TrendingUp,
  TrendingDown,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

const mainItems = [
  { id: "dashboard", label: "Дашбоард", icon: LayoutDashboard, href: "/dashboard" },
  { id: "requests", label: "Заявки", icon: FileText, href: "/dashboard/requests" },
  { id: "clients", label: "Клиенты", icon: Users, href: "/dashboard/clients" },
  { id: "performers", label: "Исполнители", icon: UserCheck, href: "/dashboard/performers" },
  { id: "calls", label: "Звонки", icon: Phone, href: "/dashboard/calls" },
];

const financeItems = [
  { id: "transactions", label: "Транзакции", icon: CreditCard, href: "/dashboard/finance/transactions" },
  { id: "invoices", label: "Счета", icon: FileCheck, href: "/dashboard/finance/invoices" },
  { id: "acts", label: "Акты", icon: Receipt, href: "/dashboard/finance/acts" },
  { id: "income", label: "Доходы", icon: TrendingUp, href: "/dashboard/finance/income" },
  { id: "expenses", label: "Расходы", icon: TrendingDown, href: "/dashboard/finance/expenses" },
];

const communicationItems = [
  { id: "notifications", label: "Уведомления", icon: Bell, href: "/dashboard/notifications" },
  { id: "chats", label: "Чаты", icon: MessageSquare, href: "/dashboard/chats" },
];

const adminItems = [
  { id: "users", label: "Пользователи", icon: UserCog, href: "/dashboard/users" },
  { id: "crm-logs", label: "Логи CRM", icon: FileClock, href: "/dashboard/logs/crm" },
  { id: "app-logs", label: "Логи APP", icon: Smartphone, href: "/dashboard/logs/app" },
  { id: "settings", label: "Настройки", icon: Settings, href: "/dashboard/settings" },
  { id: "profile", label: "Профиль", icon: User, href: "/dashboard/profile" },
];

interface NavSectionProps {
  title: string;
  items: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }>; href: string }>;
  onTabChange: (href: string) => void;
  setIsMobileOpen: (open: boolean) => void;
  pathname: string;
  isCollapsed: boolean;
}

function NavSection({ title, items, onTabChange, setIsMobileOpen, pathname, isCollapsed }: NavSectionProps) {
  return (
    <div className={cn("mb-6", isCollapsed && "text-center")}>
      {!isCollapsed && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">{title}</h3>
      )}
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(isCollapsed ? "w-full flex justify-center" : "w-full")}>
                  <button
                    onClick={() => {
                      onTabChange(item.href);
                      setIsMobileOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full",
                      pathname === item.href
                        ? "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                      isCollapsed && "justify-center px-0 w-12"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="ml-2">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sidebar({ onLogout, isCollapsed: parentIsCollapsed, onToggleCollapse, isMobileOpen: parentIsMobileOpen, setIsMobileOpen: parentSetIsMobileOpen }: SidebarProps) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [internalIsMobileOpen, setInternalIsMobileOpen] = useState(false);
  
  const isCollapsed = parentIsCollapsed !== undefined ? parentIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = onToggleCollapse || (() => setInternalIsCollapsed(prev => !prev));
  const isMobileOpen = parentIsMobileOpen !== undefined ? parentIsMobileOpen : internalIsMobileOpen;
  const setIsMobileOpen = parentSetIsMobileOpen || setInternalIsMobileOpen;
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  return (
    <TooltipProvider>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 h-full bg-white dark:bg-card border-r z-50 transition-all duration-300",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Header */}
          <div className={cn("flex items-center justify-between border-b shrink-0 h-[55px]", isCollapsed ? "justify-center px-2" : "px-3")}>
            {!isCollapsed && (
              <div className="flex items-center justify-center h-full w-full overflow-hidden px-3">
                <img src="/logo-light.png" alt="FuneralFlow" className="h-[40px] w-[165px] object-contain dark:hidden" />
                <img src="/logo.png" alt="FuneralFlow" className="h-[40px] w-[165px] object-contain hidden dark:block" />
              </div>
            )}
            {isCollapsed && (
              <div className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shrink-0">
                <span className="text-base font-bold text-white">ПГ</span>
              </div>
            )}
          </div>

          {/* Mobile close button - показываем только когда меню открыто */}
          {isMobileOpen && (
            <div className="lg:hidden absolute top-3 right-3 z-50">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 sidebar-scroll hide-horizontal-scroll" style={{ height: 'calc(100vh - 113px)' }}>
            <NavSection
              title="Основные"
              items={mainItems}
              pathname={pathname}
              onTabChange={handleNavigation}
              setIsMobileOpen={setIsMobileOpen}
              isCollapsed={isCollapsed}
            />

            <NavSection
              title="Финансы"
              items={financeItems}
              pathname={pathname}
              onTabChange={handleNavigation}
              setIsMobileOpen={setIsMobileOpen}
              isCollapsed={isCollapsed}
            />

            <NavSection
              title="Коммуникации"
              items={communicationItems}
              pathname={pathname}
              onTabChange={handleNavigation}
              setIsMobileOpen={setIsMobileOpen}
              isCollapsed={isCollapsed}
            />

            <NavSection
              title="Администрирование"
              items={adminItems}
              pathname={pathname}
              onTabChange={handleNavigation}
              setIsMobileOpen={setIsMobileOpen}
              isCollapsed={isCollapsed}
            />
          </nav>

          {/* Footer */}
          <div className={cn("p-3 border-t shrink-0", isCollapsed && "px-2")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(isCollapsed ? "w-full flex justify-center" : "w-full")}>
                  <button
                    onClick={onLogout}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full",
                      isCollapsed && "justify-center px-0 w-12"
                    )}
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="truncate">Выйти</span>}
                  </button>
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="ml-2">
                  <p>Выйти</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </aside>
    </TooltipProvider>
  );
}
