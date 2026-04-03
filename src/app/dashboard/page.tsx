"use client";

import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  DollarSign,
  Phone,
  UserCheck,
  Plus,
  GripVertical,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700 border-yellow-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels: Record<string, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершена",
  CANCELLED: "Отменена",
};

const columnConfig: Record<string, { title: string; icon: any; color: string; accent: string }> = {
  TODO: { title: "К выполнению", icon: AlertCircle, color: "bg-slate-100 dark:bg-slate-800", accent: "bg-slate-500/10 dark:bg-slate-500/20" },
  IN_PROGRESS: { title: "В работе", icon: Clock, color: "bg-yellow-100 dark:bg-yellow-900/20", accent: "bg-yellow-500/10 dark:bg-yellow-500/20" },
  DONE: { title: "Выполнено", icon: CheckCircle2, color: "bg-green-100 dark:bg-green-900/20", accent: "bg-green-500/10 dark:bg-green-500/20" },
  CANCELLED: { title: "Отменено", icon: XCircle, color: "bg-red-100 dark:bg-red-900/20", accent: "bg-red-500/10 dark:bg-red-500/20" },
};

const formatMoney = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(num);
};

const formatDuration = (seconds: number) => {
  if (!seconds || seconds === 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Draggable Task Component
const DraggableTask = ({ task, columnId }: { task: any; columnId: string }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task, columnId },
  });

  const statusColor = columnId === "TODO" ? "bg-slate-500" :
    columnId === "IN_PROGRESS" ? "bg-yellow-500" :
    columnId === "DONE" ? "bg-green-500" : "bg-red-500";

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing transition-all bg-white dark:bg-card dark:border-slate-700 ${
        isDragging ? "opacity-50 scale-105 shadow-lg" : "opacity-100"
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${statusColor} text-white`}>
                {columnConfig[columnId].title}
              </span>
            </div>
            <p className="font-medium text-sm line-clamp-2 text-slate-900 dark:text-foreground">{task.title}</p>
            <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(task.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Droppable Column Component
const DroppableColumn = ({
  columnId,
  title,
  icon: Icon,
  tasks,
}: {
  columnId: string;
  title: string;
  icon: any;
  tasks: any[];
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  const config = columnConfig[columnId];

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 transition-all min-h-[400px] ${
        isOver ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-card"
      }`}
    >
      <div className={`p-3 ${config.color} border-b flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.accent}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <Badge variant="secondary" className="text-xs font-semibold">
          {tasks.length}
        </Badge>
      </div>
      <div className="p-2 space-y-2">
        {tasks.map((task) => (
          <DraggableTask key={task.id} task={task} columnId={columnId} />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
            <span>Нет задач</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data — без backend
const MOCK_STATS = { clients: 156, performers: 48, applications: 234, revenue: 4850000 };

const MOCK_REVENUE: Record<string, { name: string; income: number; expense: number }[]> = {
  week: [
    { name: "Пн", income: 45000, expense: 12000 },
    { name: "Вт", income: 62000, expense: 18000 },
    { name: "Ср", income: 38000, expense: 9000 },
    { name: "Чт", income: 71000, expense: 22000 },
    { name: "Пт", income: 55000, expense: 15000 },
  ],
  month: [
    { name: "Нед 1", income: 185000, expense: 62000 },
    { name: "Нед 2", income: 210000, expense: 78000 },
    { name: "Нед 3", income: 195000, expense: 55000 },
    { name: "Нед 4", income: 240000, expense: 91000 },
  ],
  year: [
    { name: "Янв", income: 520000, expense: 180000 },
    { name: "Фев", income: 610000, expense: 210000 },
    { name: "Мар", income: 740000, expense: 250000 },
    { name: "Апр", income: 680000, expense: 195000 },
    { name: "Май", income: 820000, expense: 280000 },
    { name: "Июн", income: 750000, expense: 230000 },
    { name: "Июл", income: 690000, expense: 210000 },
    { name: "Авг", income: 880000, expense: 310000 },
    { name: "Сен", income: 920000, expense: 290000 },
    { name: "Окт", income: 870000, expense: 260000 },
    { name: "Ноя", income: 950000, expense: 320000 },
    { name: "Дек", income: 1100000, expense: 380000 },
  ],
};

const MOCK_TASKS = {
  TODO: [
    { id: 101, title: "Подготовить коммерческое предложение для ООО «Альфа»", created_at: "2026-04-01T09:00:00Z" },
    { id: 102, title: "Обзвонить базу клиентов по новой услуге", created_at: "2026-04-02T10:00:00Z" },
  ],
  IN_PROGRESS: [
    { id: 103, title: "Согласовать договор с ИП Петров", created_at: "2026-03-31T14:00:00Z" },
    { id: 104, title: "Подготовить отчёт за март", created_at: "2026-03-30T11:00:00Z" },
  ],
  DONE: [
    { id: 105, title: "Провести встречу с командой", created_at: "2026-03-28T09:00:00Z" },
    { id: 106, title: "Отправить счёт ООО «Бета»", created_at: "2026-03-27T16:00:00Z" },
  ],
  CANCELLED: [
    { id: 107, title: "Отменённая задача — тест", created_at: "2026-03-25T08:00:00Z" },
  ],
};

const MOCK_APPLICATIONS = [
  { id: 1001, title: "Разработка CRM для ООО «Гамма»", client: { company_name: "ООО «Гамма»", fio: null }, amount: 350000, status: "NEW" },
  { id: 1002, title: "Интеграция телефонии", client: { company_name: null, fio: "Иванов И.И." }, amount: 120000, status: "IN_PROGRESS" },
  { id: 1003, title: "Настройка аналитики", client: { company_name: "ООО «Дельта»", fio: null }, amount: 85000, status: "COMPLETED" },
  { id: 1004, title: "Миграция данных", client: { company_name: "ИП Сидоров", fio: null }, amount: 200000, status: "IN_PROGRESS" },
  { id: 1005, title: "Аудит безопасности", client: { company_name: "ООО «Эпсилон»", fio: null }, amount: 150000, status: "NEW" },
];

const MOCK_PERFORMERS = [
  { id: 201, name: "Алексей Смирнов", avatar: "АС", orders: 24, earnings: 480000 },
  { id: 202, name: "Мария Козлова", avatar: "МК", orders: 19, earnings: 395000 },
  { id: 203, name: "Дмитрий Волков", avatar: "ДВ", orders: 17, earnings: 340000 },
  { id: 204, name: "Елена Новикова", avatar: "ЕН", orders: 15, earnings: 310000 },
  { id: 205, name: "Сергей Морозов", avatar: "СМ", orders: 12, earnings: 265000 },
];

const MOCK_CALLS = [
  { id: 301, phone: "+7 (999) 111-22-33", status: "ANSWERED", duration: 245, direction: "INCOMING", created_at: "2026-04-03T14:30:00Z", client: { fio: "Петров П.П.", company_name: null } },
  { id: 302, phone: "+7 (999) 444-55-66", status: "MISSED", duration: 0, direction: "INCOMING", created_at: "2026-04-03T13:15:00Z", client: { fio: null, company_name: "ООО «Зета»" } },
  { id: 303, phone: "+7 (999) 777-88-99", status: "ANSWERED", duration: 120, direction: "OUTGOING", created_at: "2026-04-03T11:00:00Z", client: { fio: "Козлова А.В.", company_name: null } },
  { id: 304, phone: "+7 (999) 222-33-44", status: "ANSWERED", duration: 380, direction: "INCOMING", created_at: "2026-04-03T09:45:00Z", client: { fio: null, company_name: "ИП Иванов" } },
  { id: 305, phone: "+7 (999) 555-66-77", status: "MISSED", duration: 0, direction: "OUTGOING", created_at: "2026-04-02T17:30:00Z", client: { fio: "Смирнов В.В.", company_name: null } },
];

export default function DashboardPage() {
  const [stats] = useState(MOCK_STATS);
  const [chartPeriod, setChartPeriod] = useState<"week" | "month" | "year">("month");
  const [revenueData, setRevenueData] = useState(MOCK_REVENUE.month);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [recentApplications] = useState(MOCK_APPLICATIONS);
  const [topPerformers] = useState(MOCK_PERFORMERS);
  const [recentCalls] = useState(MOCK_CALLS);
  const [loading] = useState(false);

  // Обновляем график при смене периода
  useEffect(() => {
    setRevenueData(MOCK_REVENUE[chartPeriod]);
  }, [chartPeriod]);

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = Object.values(tasks)
      .flat()
      .find((t: any) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (Object.keys(columnConfig).includes(overId)) {
      setTasks((prev: any) => {
        const newTasks: any = { ...prev };
        const sourceColumn = Object.keys(newTasks).find((key) =>
          newTasks[key].some((t: any) => t.id === activeId)
        );

        if (sourceColumn && sourceColumn !== overId) {
          const task = newTasks[sourceColumn].find((t: any) => t.id === activeId);
          newTasks[sourceColumn] = newTasks[sourceColumn].filter(
            (t: any) => t.id !== activeId
          );
          newTasks[overId] = [...newTasks[overId], task];
        }

        return newTasks;
      });
    }
  };

  const handleDragEnd = () => {
    setActiveTask(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-foreground">Клиенты</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients}</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 dark:text-slate-400">всего</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-foreground">Исполнители</CardTitle>
            <UserCheck className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.performers}</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 dark:text-slate-400">всего</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-foreground">Заявки</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 dark:text-slate-400">всего</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-foreground">Доход</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(stats.revenue)}</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 dark:text-slate-400">всего</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Доходы и расходы
              </span>
              <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as any)}>
                <TabsList className="grid grid-cols-3 h-8">
                  <TabsTrigger value="week" className="text-xs">Неделя</TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">Месяц</TabsTrigger>
                  <TabsTrigger value="year" className="text-xs">Год</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%" key={chartPeriod}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} className="dark:text-slate-400" />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `${value / 1000}к`} className="dark:text-slate-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#1e293b" }}
                    itemStyle={{ color: "#1e293b" }}
                    formatter={(value: number) => formatMoney(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Доход"
                    isAnimationActive={true}
                    animationDuration={750}
                    animationEasing="ease-in-out"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                    name="Расход"
                    isAnimationActive={true}
                    animationDuration={750}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Client Types Pie Chart */}
        <Card className="bg-white dark:bg-card">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 dark:text-foreground">Типы клиентов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Физ. лица", value: 65, color: "#8b5cf6" },
                      { name: "Юр. лица", value: 35, color: "#3b82f6" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {[{ name: "Физ. лица", value: 65, color: "#8b5cf6" }, { name: "Юр. лица", value: 35, color: "#3b82f6" }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {[{ name: "Физ. лица", color: "#8b5cf6" }, { name: "Юр. лица", color: "#3b82f6" }].map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Задачи
            </span>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(columnConfig).map(([key, config]) => (
                <DroppableColumn
                  key={key}
                  columnId={key}
                  title={config.title}
                  icon={config.icon}
                  tasks={tasks[key as keyof typeof tasks] || []}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <Card className="shadow-lg rotate-3 scale-105">
                  <CardContent className="p-3">
                    <p className="font-medium text-sm">{activeTask.title}</p>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>

      {/* Recent Activity Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card className="bg-white dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base text-slate-900 dark:text-foreground">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Последние заявки
              </span>
              <Button variant="outline" size="sm">
                Все заявки
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                      <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-foreground">{app.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {app.client?.company_name || app.client?.fio || 'Клиент'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-foreground">
                      {app.amount ? formatMoney(app.amount) : '—'}
                    </p>
                    <Badge variant="outline" className={statusColors[app.status]}>
                      {statusLabels[app.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-white dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base text-slate-900 dark:text-foreground">
              <span className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Лучшие исполнители
              </span>
              <Button variant="outline" size="sm">
                Все
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-brand-100 text-brand-700 text-sm font-medium dark:bg-brand-900 dark:text-brand-300">
                          {performer.avatar || performer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 text-white text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-foreground">{performer.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{performer.orders} заказов</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">{formatMoney(performer.earnings)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calls */}
      <Card className="bg-white dark:bg-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base text-slate-900 dark:text-foreground">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Последние звонки
            </span>
            <Button variant="outline" size="sm">
              Все звонки
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    call.status === "ANSWERED" ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                  }`}>
                    <Phone className={`h-5 w-5 ${
                      call.status === "ANSWERED" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-foreground">{call.phone}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {call.caller_name || call.client?.company_name || call.client?.fio || "Не определён"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    call.status === "ANSWERED" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {call.status === "ANSWERED" ? "Принят" : "Пропущен"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDuration(call.duration)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
