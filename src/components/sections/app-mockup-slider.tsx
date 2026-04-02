"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, CheckCircle, Upload, User, Phone, MapPin, Clock, X, FileText, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  title: string;
  type: "mobile" | "desktop";
}

const slides: Slide[] = [
  { id: 1, title: "Мобильный агент", type: "mobile" },
  { id: 2, title: "Дашборд директора", type: "desktop" },
  { id: 3, title: "Синхронизация", type: "mobile" },
];

interface AppMockupSliderProps {
  onOpenDemo?: () => void;
  isDemoOpen?: boolean;
}

export function AppMockupSlider({ onOpenDemo, isDemoOpen }: AppMockupSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || isDemoOpen) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isDemoOpen]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Блокировка скролла страницы при открытой демо-панели
  useEffect(() => {
    if (isDemoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDemoOpen]);

  return (
    <motion.div
      layout
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "relative w-full",
        isDemoOpen ? "fixed inset-0 z-50 m-0" : "max-w-lg"
      )}
    >
      {/* Decorative Background */}
      <motion.div
        layout
        className={cn(
          "absolute rounded-3xl bg-gradient-to-tr from-brand-100 to-brand-50 opacity-60 blur-2xl",
          isDemoOpen ? "-inset-0" : "-inset-4"
        )}
      />

      {/* Device Frame */}
      <motion.div
        layout
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "relative overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-2xl",
          isDemoOpen ? "rounded-none h-full" : "rounded-2xl"
        )}
      >
        {/* Status Bar - скрываем в демо режиме */}
        <AnimatePresence>
          {!isDemoOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between border-b bg-slate-100 px-4 py-2"
            >
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                <span>12:34</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className={cn(
          "relative overflow-hidden",
          isDemoOpen ? "h-full" : "aspect-[4/3]"
        )}>
          <AnimatePresence>
            {isDemoOpen ? (
              <DemoContent key="demo" onClose={onOpenDemo} />
            ) : (
              <SliderContent key="slider" currentSlide={currentSlide} />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Dots - скрываем в демо режиме */}
        <AnimatePresence>
          {!isDemoOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center gap-2 border-t bg-slate-50 px-4 py-3"
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentSlide
                      ? "w-8 bg-brand-600"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Badge - скрываем сразу при начале анимации */}
      <AnimatePresence>
        {!isDemoOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute -right-2 -top-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-lg"
          >
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span>Онлайн</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Контент слайдера
function SliderContent({ currentSlide }: { currentSlide: number }) {
  return (
    <motion.div
      key="slider-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex h-full flex-col"
    >
      <div className="relative h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {currentSlide === 0 && <MobileAgentSlide key="slide-0" />}
          {currentSlide === 1 && <DesktopDashboardSlide key="slide-1" />}
          {currentSlide === 2 && <SyncSlide key="slide-2" />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Демо-контент
function DemoContent({ onClose }: { onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "agents" | "reports">("dashboard");

  const orders = [
    { id: "#047", client: "Иванов Петр Сергеевич", agent: "Алексей Смирнов", status: "new", amount: "45 000", time: "14:30", services: "Кремация" },
    { id: "#046", client: "Петрова Анна Ивановна", agent: "Мария Козлова", status: "progress", amount: "78 000", time: "11:00", services: "Похороны" },
    { id: "#045", client: "Сидоров Виктор Константинович", agent: "Алексей Смирнов", status: "done", amount: "32 000", time: "16:45", services: "Транспортировка" },
    { id: "#044", client: "Кузнецова Елена Павловна", agent: "Дмитрий Волков", status: "done", amount: "95 000", time: "10:15", services: "Полный пакет" },
    { id: "#043", client: "Морозов Иван Петрович", agent: "Мария Козлова", status: "new", amount: "52 000", time: "09:30", services: "Кремация" },
  ];

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    progress: "bg-yellow-100 text-yellow-700",
    done: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    new: "Новый",
    progress: "В работе",
    done: "Завершён",
    cancelled: "Отменён",
  };

  const stats = [
    { label: "Заказов сегодня", value: "12", change: "+3", icon: FileText, color: "blue", bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Завершено", value: "8", change: "+2", icon: CheckCircle, color: "green", bg: "bg-green-50", text: "text-green-600" },
    { label: "В работе", value: "4", change: "0", icon: Clock, color: "yellow", bg: "bg-yellow-50", text: "text-yellow-600" },
    { label: "Выручка", value: "155к", change: "+28к", icon: CreditCard, color: "purple", bg: "bg-purple-50", text: "text-purple-600" },
  ];

  const agents = [
    { name: "Алексей Смирнов", orders: 3, status: "online", location: "ул. Ленина, 45", avatar: "АС", phone: "+7 (999) 111-22-33", completed: 24, revenue: "420к" },
    { name: "Мария Козлова", orders: 2, status: "online", location: "пр. Мира, 12", avatar: "МК", phone: "+7 (999) 222-33-44", completed: 18, revenue: "350к" },
    { name: "Дмитрий Волков", orders: 1, status: "busy", location: "ул. Гагарина, 8", avatar: "ДВ", phone: "+7 (999) 333-44-55", completed: 15, revenue: "280к" },
    { name: "Елена Соколова", orders: 0, status: "offline", location: "Офис", avatar: "ЕС", phone: "+7 (999) 444-55-66", completed: 21, revenue: "390к" },
    { name: "Игорь Петров", orders: 2, status: "online", location: "ул. Пушкина, 23", avatar: "ИП", phone: "+7 (999) 555-66-77", completed: 12, revenue: "210к" },
  ];

  const reports = [
    { period: "Март 2026", orders: 287, revenue: "1.42М", avgCheck: "4 950", growth: "+12%" },
    { period: "Февраль 2026", orders: 256, revenue: "1.28М", avgCheck: "5 000", growth: "+8%" },
    { period: "Январь 2026", orders: 238, revenue: "1.19М", avgCheck: "5 000", growth: "+5%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex h-full flex-col bg-slate-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <span className="text-sm font-bold text-white">F</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold">FuneralFlow</h2>
              <p className="text-xs text-muted-foreground">Панель директора</p>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <nav className="flex items-center gap-1">
            {[
              { id: "dashboard", label: "Дашборд" },
              { id: "orders", label: "Заказы" },
              { id: "agents", label: "Агенты" },
              { id: "reports", label: "Отчёты" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTab === item.id ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Онлайн
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-slate-100"
            aria-label="Закрыть демо"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          {activeTab === "dashboard" && (
            <DashboardTab stats={stats} orders={orders} statusColors={statusColors} statusLabels={statusLabels} agents={agents} />
          )}
          {activeTab === "orders" && (
            <OrdersTab orders={orders} statusColors={statusColors} statusLabels={statusLabels} />
          )}
          {activeTab === "agents" && (
            <AgentsTab agents={agents} />
          )}
          {activeTab === "reports" && (
            <ReportsTab reports={reports} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  text: string;
}

interface Order {
  id: string;
  client: string;
  agent: string;
  status: string;
  amount: string;
  time: string;
  services: string;
}

interface Agent {
  name: string;
  orders: number;
  status: string;
  location: string;
  avatar: string;
  phone: string;
  completed: number;
  revenue: string;
}

// Вкладка Дашборд
function DashboardTab({ stats, orders, statusColors, statusLabels, agents }: { 
  stats: Stat[]; 
  orders: Order[]; 
  statusColors: Record<string, string>; 
  statusLabels: Record<string, string>;
  agents: Agent[];
}) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-xs text-green-600">{stat.change}</p>
              </div>
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.text)} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-white lg:col-span-2"
        >
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold">Последние заказы</h3>
              <p className="text-xs text-slate-500">Обновлено 2 мин назад</p>
            </div>
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-700">
              + Новый заказ
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-slate-600">Заказ</th>
                  <th className="px-5 py-3 text-left font-medium text-slate-600">Клиент</th>
                  <th className="px-5 py-3 text-left font-medium text-slate-600">Услуга</th>
                  <th className="px-5 py-3 text-left font-medium text-slate-600">Агент</th>
                  <th className="px-5 py-3 text-left font-medium text-slate-600">Статус</th>
                  <th className="px-5 py-3 text-right font-medium text-slate-600">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-brand-600">{order.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.client}</span>
                        <span className="text-xs text-slate-500">{order.time}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{order.services}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200" />
                        <span className="text-slate-600">{order.agent}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusColors[order.status])}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">{order.amount} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Agents Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          {/* Agents List */}
          <div className="rounded-xl border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold">Агенты</h4>
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                3 онлайн
              </span>
            </div>
            <div className="space-y-3">
              {agents.slice(0, 4).map((agent) => (
                <div key={agent.name} className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                        {agent.avatar}
                      </div>
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                          agent.status === "online" && "bg-green-500",
                          agent.status === "busy" && "bg-yellow-500",
                          agent.status === "offline" && "bg-slate-400"
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-slate-500">{agent.orders} заказов</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{agent.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="rounded-xl border bg-white p-5">
            <h4 className="mb-4 text-sm font-semibold">Активность за неделю</h4>
            <div className="flex items-end justify-between gap-2">
              {[
                { day: "Пн", value: 8, height: "h-16" },
                { day: "Вт", value: 12, height: "h-24" },
                { day: "Ср", value: 6, height: "h-12" },
                { day: "Чт", value: 15, height: "h-28" },
                { day: "Пт", value: 10, height: "h-20" },
                { day: "Сб", value: 4, height: "h-8" },
                { day: "Вс", value: 2, height: "h-4" },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: item.height }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={cn(
                      "w-6 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400",
                      item.height
                    )}
                  />
                  <span className="text-xs text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-xs text-slate-500">Всего заказов</span>
              <span className="text-sm font-semibold">57</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-white p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Агенты на карте</h4>
            <button className="text-xs text-brand-600 hover:underline">Открыть карту</button>
          </div>
          <div className="relative h-48 overflow-hidden rounded-lg bg-slate-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">Интерактивная карта</p>
                <p className="text-xs text-slate-400">Местоположение агентов в реальном времени</p>
              </div>
            </div>
            {/* Fake map markers */}
            <div className="absolute left-1/4 top-1/3 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 shadow-lg shadow-brand-300" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 shadow-lg shadow-brand-300" />
            <div className="absolute left-3/4 top-1/4 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 shadow-lg shadow-brand-300" />
            <div className="absolute left-2/3 top-2/3 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 shadow-lg shadow-brand-300" />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border bg-white p-5"
        >
          <h4 className="mb-4 text-sm font-semibold">Последняя активность</h4>
          <div className="space-y-3">
            {[
              { text: "Алексей С. создал заказ #047", time: "2 мин назад", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
              { text: "Мария К. обновила статус заказа #046", time: "5 мин назад", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
              { text: "Дмитрий В. загрузил документы", time: "12 мин назад", icon: Upload, color: "text-purple-600", bg: "bg-purple-50" },
              { text: "Новый заказ #043 получен", time: "18 мин назад", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", activity.bg)}>
                  <activity.icon className={cn("h-4 w-4", activity.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{activity.text}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Вкладка Заказы
function OrdersTab({ orders, statusColors, statusLabels }: { 
  orders: Order[]; 
  statusColors: Record<string, string>; 
  statusLabels: Record<string, string>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Все заказы</h2>
          <p className="text-sm text-slate-500">Управление заказами и заявками</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Новый заказ
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Поиск по клиенту или заказу..."
            className="w-full rounded-lg border px-4 py-2 text-sm outline-none focus:border-brand-500"
          />
        </div>
        <select className="rounded-lg border px-4 py-2 text-sm outline-none focus:border-brand-500">
          <option>Все статусы</option>
          <option>Новые</option>
          <option>В работе</option>
          <option>Завершённые</option>
        </select>
        <select className="rounded-lg border px-4 py-2 text-sm outline-none focus:border-brand-500">
          <option>Все агенты</option>
          <option>Алексей Смирнов</option>
          <option>Мария Козлова</option>
          <option>Дмитрий Волков</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Заказ</th>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Клиент</th>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Услуга</th>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Агент</th>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Дата</th>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Статус</th>
              <th className="px-5 py-3 text-right font-medium text-slate-600">Сумма</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[...orders, ...orders].map((order, i) => (
              <tr key={`${order.id}-${i}`} className="group hover:bg-slate-50">
                <td className="px-5 py-4 font-medium text-brand-600">{order.id}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{order.client}</span>
                    <span className="text-xs text-slate-500">{order.time}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600">{order.services}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-slate-200" />
                    <span className="text-slate-600">{order.agent}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500">24.03.2026</td>
                <td className="px-5 py-4">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusColors[order.status])}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-medium">{order.amount} ₽</td>
                <td className="px-5 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Показано 1-10 из 47 заказов</p>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">Назад</button>
          <button className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700">1</button>
          <button className="rounded-lg border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">2</button>
          <button className="rounded-lg border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">3</button>
          <button className="rounded-lg border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">Вперед</button>
        </div>
      </div>
    </motion.div>
  );
}

// Вкладка Агенты
function AgentsTab({ agents }: { agents: Agent[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Агенты</h2>
          <p className="text-sm text-slate-500">Управление командой и мониторинг активности</p>
        </div>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          + Добавить агента
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-slate-500">Всего агентов</p>
          <p className="mt-1 text-2xl font-bold">5</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-slate-500">Онлайн</p>
          <p className="mt-1 text-2xl font-bold text-green-600">3</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-slate-500">Заказов за месяц</p>
          <p className="mt-1 text-2xl font-bold">87</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-slate-500">Общая выручка</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">1.65М</p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-white p-5"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
                    {agent.avatar}
                  </div>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white",
                      agent.status === "online" && "bg-green-500",
                      agent.status === "busy" && "bg-yellow-500",
                      agent.status === "offline" && "bg-slate-400"
                    )}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-xs text-slate-500">{agent.phone}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">⋮</button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Статус</span>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  agent.status === "online" && "bg-green-50 text-green-700",
                  agent.status === "busy" && "bg-yellow-50 text-yellow-700",
                  agent.status === "offline" && "bg-slate-50 text-slate-700"
                )}>
                  {agent.status === "online" ? "Онлайн" : agent.status === "busy" ? "Занят" : "Оффлайн"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Местоположение</span>
                <span className="text-slate-700">{agent.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Заказов в работе</span>
                <span className="font-medium">{agent.orders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Завершено за месяц</span>
                <span className="font-medium">{agent.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Выручка</span>
                <span className="font-medium text-purple-600">{agent.revenue}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50">
                Профиль
              </button>
              <button className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700">
                Написать
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface Report {
  period: string;
  orders: number;
  revenue: string;
  avgCheck: string;
  growth: string;
}

// Вкладка Отчёты
function ReportsTab({ reports }: { reports: Report[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Отчёты</h2>
          <p className="text-sm text-slate-500">Аналитика и статистика по агентству</p>
        </div>
        <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50">
          📥 Экспорт
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border bg-white p-5"
        >
          <p className="text-xs text-slate-500">Заказов за месяц</p>
          <p className="mt-2 text-3xl font-bold">287</p>
          <p className="mt-1 text-xs text-green-600">↑ +12% к прошлому месяцу</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-white p-5"
        >
          <p className="text-xs text-slate-500">Выручка</p>
          <p className="mt-2 text-3xl font-bold">1.42М ₽</p>
          <p className="mt-1 text-xs text-green-600">↑ +11% к прошлому месяцу</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-white p-5"
        >
          <p className="text-xs text-slate-500">Средний чек</p>
          <p className="mt-2 text-3xl font-bold">4 950 ₽</p>
          <p className="mt-1 text-xs text-slate-500">→ без изменений</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-white p-5"
        >
          <p className="text-xs text-slate-500">Конверсия</p>
          <p className="mt-2 text-3xl font-bold">68%</p>
          <p className="mt-1 text-xs text-green-600">↑ +3% к прошлому месяцу</p>
        </motion.div>
      </div>

      {/* Monthly Reports Table */}
      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <h3 className="text-sm font-semibold">Ежемесячные отчёты</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Период</th>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Заказов</th>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Выручка</th>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Средний чек</th>
              <th className="px-5 py-3 text-left font-medium text-slate-600">Рост</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reports.map((report) => (
              <tr key={report.period} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-medium">{report.period}</td>
                <td className="px-5 py-4">{report.orders}</td>
                <td className="px-5 py-4 font-medium">{report.revenue}</td>
                <td className="px-5 py-4 text-slate-600">{report.avgCheck}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    {report.growth}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-brand-600 hover:underline">Скачать</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h4 className="mb-4 text-sm font-semibold">Динамика заказов</h4>
          <div className="flex h-48 items-end justify-between gap-2 px-4">
            {[65, 78, 52, 89, 73, 95, 82, 68, 91, 77, 85, 93].map((value, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="w-6 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400"
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between px-4 text-xs text-slate-500">
            <span>Янв</span><span>Фев</span><span>Мар</span><span>Апр</span>
            <span>Май</span><span>Июн</span><span>Июл</span><span>Авг</span>
            <span>Сен</span><span>Окт</span><span>Ноя</span><span>Дек</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h4 className="mb-4 text-sm font-semibold">Структура услуг</h4>
          <div className="space-y-4">
            {[
              { name: "Кремация", value: 45, color: "bg-blue-500" },
              { name: "Похороны", value: 30, color: "bg-green-500" },
              { name: "Транспортировка", value: 15, color: "bg-yellow-500" },
              { name: "Полный пакет", value: 10, color: "bg-purple-500" },
            ].map((item) => (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Слайд 1: Мобильный агент
function MobileAgentSlide() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col bg-gradient-to-b from-slate-50 to-slate-100 p-4"
    >
      <div className="mb-3 flex items-center justify-between rounded-lg bg-red-100 px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-red-700">
          <WifiOff className="h-3.5 w-3.5" />
          <span>Оффлайн режим</span>
        </div>
        <span className="text-xs text-red-600">3 заказа в очереди</span>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border bg-white p-3">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Клиент</label>
          <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-sm">Иванов Петр Сергеевич</span>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-3">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Телефон</label>
          <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2">
            <Phone className="h-4 w-4 text-slate-400" />
            <span className="text-sm">+7 (999) 123-45-67</span>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-3">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Услуга</label>
          <select className="w-full rounded-md border bg-slate-50 px-3 py-2 text-sm">
            <option>Кремация</option>
            <option>Похороны</option>
            <option>Транспортировка</option>
          </select>
        </div>

        <div className="rounded-lg border bg-white p-3">
          <label className="mb-1.5 block text-xs font-medium text-slate-600">Адрес</label>
          <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-sm">ул. Ленина, 45</span>
          </div>
        </div>
      </div>

      <button className="mt-auto rounded-lg bg-brand-600 py-3 text-sm font-medium text-white shadow-lg shadow-brand-200 hover:bg-brand-700">
        Сохранить заказ
      </button>
    </motion.div>
  );
}

// Слайд 2: Дашборд директора
function DesktopDashboardSlide() {
  const orders = [
    { id: "#001", client: "Иванов П.С.", agent: "Алексей", status: "new", amount: "45 000" },
    { id: "#002", client: "Петрова А.И.", agent: "Мария", status: "progress", amount: "78 000" },
    { id: "#003", client: "Сидоров В.К.", agent: "Алексей", status: "done", amount: "32 000" },
  ];

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    progress: "bg-yellow-100 text-yellow-700",
    done: "bg-green-100 text-green-700",
  };

  const statusLabels: Record<string, string> = {
    new: "Новый",
    progress: "В работе",
    done: "Завершён",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col bg-white p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Заказы сегодня</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          <span>12 активных</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="rounded-l-md px-2 py-2 text-left font-medium text-slate-600">Заказ</th>
              <th className="px-2 py-2 text-left font-medium text-slate-600">Клиент</th>
              <th className="px-2 py-2 text-left font-medium text-slate-600">Агент</th>
              <th className="px-2 py-2 text-left font-medium text-slate-600">Статус</th>
              <th className="rounded-r-md px-2 py-2 text-right font-medium text-slate-600">Сумма</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-2 py-2.5 font-medium">{order.id}</td>
                <td className="px-2 py-2.5">{order.client}</td>
                <td className="px-2 py-2.5 text-slate-500">{order.agent}</td>
                <td className="px-2 py-2.5">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColors[order.status])}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-right font-medium">{order.amount} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-blue-50 p-2 text-center">
          <div className="text-lg font-bold text-blue-600">12</div>
          <div className="text-xs text-blue-600">Активных</div>
        </div>
        <div className="rounded-lg bg-green-50 p-2 text-center">
          <div className="text-lg font-bold text-green-600">8</div>
          <div className="text-xs text-green-600">Завершено</div>
        </div>
        <div className="rounded-lg bg-purple-50 p-2 text-center">
          <div className="text-lg font-bold text-purple-600">155к</div>
          <div className="text-xs text-purple-600">Выручка</div>
        </div>
      </div>
    </motion.div>
  );
}

// Слайд 3: Синхронизация
function SyncSlide() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-white p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full",
          isComplete ? "bg-green-100" : "bg-brand-100"
        )}
      >
        {isComplete ? (
          <CheckCircle className="h-10 w-10 text-green-600" />
        ) : (
          <Upload className="h-10 w-10 text-brand-600" />
        )}
      </motion.div>

      <h3 className="mt-4 text-lg font-semibold">
        {isComplete ? "Синхронизация завершена" : "Синхронизация..."}
      </h3>

      <div className="mt-4 w-full max-w-[200px]">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
          <span>{isComplete ? "3 заказа отправлено" : "Отправка заказов..."}</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className={cn("h-full rounded-full", isComplete ? "bg-green-500" : "bg-brand-500")}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className={cn("flex items-center gap-2 text-sm", progress >= 33 ? "text-green-600" : "text-slate-400")}>
          <CheckCircle className={cn("h-4 w-4", progress >= 33 ? "opacity-100" : "opacity-30")} />
          <span>Заказ #001</span>
        </div>
        <div className={cn("flex items-center gap-2 text-sm", progress >= 66 ? "text-green-600" : "text-slate-400")}>
          <CheckCircle className={cn("h-4 w-4", progress >= 66 ? "opacity-100" : "opacity-30")} />
          <span>Заказ #002</span>
        </div>
        <div className={cn("flex items-center gap-2 text-sm", progress >= 100 ? "text-green-600" : "text-slate-400")}>
          <CheckCircle className={cn("h-4 w-4", progress >= 100 ? "opacity-100" : "opacity-30")} />
          <span>Заказ #003</span>
        </div>
      </div>
    </motion.div>
  );
}
