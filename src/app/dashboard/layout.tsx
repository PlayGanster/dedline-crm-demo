"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Search, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Users, DollarSign } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const quickCreateItems = [
    { id: 1, title: "Новый заказ", description: "Создать заказ клиента", icon: FileText },
    { id: 2, title: "Новый клиент", description: "Добавить клиента в базу", icon: Users },
    { id: 3, title: "Новый агент", description: "Добавить сотрудника", icon: Users },
    { id: 4, title: "Счёт", description: "Выставить счёт", icon: DollarSign },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Sidebar onLogout={handleLogout} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        {/* Main Content */}
        <main className={cn("min-h-screen transition-all duration-300", isCollapsed ? "lg:ml-20" : "lg:ml-64")}>
          {/* Top Bar */}
          <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-white dark:bg-card px-3 sm:px-6 h-[55px]">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:inline-flex"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCollapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setIsCreateOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Быстрое создание</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Поиск</p>
                </TooltipContent>
              </Tooltip>

              {/* Theme Toggle - Desktop */}
              <ThemeToggle className="hidden lg:flex" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Avatar>
                  <AvatarFallback>АД</AvatarFallback>
                </Avatar>
                <span className="hidden lg:block text-sm font-medium">Администратор</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuLabel>Аккаунт</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => router.push('/dashboard/profile')}>
                    <Settings size={16} />
                    Настройки
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2" onClick={handleLogout}>
                    <LogOut size={16} />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Page Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-3 sm:p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Search Dialog */}
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogContent className="sm:max-w-[600px] p-0">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle>Поиск по системе</DialogTitle>
              <DialogDescription>
                Найдите клиентов, заказы, документы и многое другое
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-4">
              <Input
                placeholder="Начните вводить для поиска..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="h-10"
              />
            </div>
            <ScrollArea className="max-h-[400px] px-6 pb-6">
              {searchQuery.length < 2 ? (
                <div className="text-center py-8 text-slate-500">
                  <Search size={48} className="mx-auto mb-3 opacity-20" />
                  <p>Введите минимум 2 символа для поиска</p>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>Ничего не найдено</p>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Quick Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Быстрое создание</DialogTitle>
              <DialogDescription>
                Выберите, что вы хотите создать
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              {quickCreateItems.map((item) => (
                <button
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                    <item.icon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
