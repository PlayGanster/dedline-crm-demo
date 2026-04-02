"use client";

import { useState } from "react";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Phone,
  UserCheck,
  Plus,
  Trash2,
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
  LineChart,
  Line,
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

// Mock данные
const statsData = {
  clients: 156,
  clientsChange: 12,
  performers: 48,
  performersChange: 5,
  applications: 89,
  applicationsChange: -3,
  revenue: 1250000,
  revenueChange: 8,
};

const revenueData = {
  week: [
    { name: "Пн", income: 120000, expense: 45000 },
    { name: "Вт", income: 180000, expense: 62000 },
    { name: "Ср", income: 150000, expense: 51000 },
    { name: "Чт", income: 220000, expense: 78000 },
    { name: "Пт", income: 195000, expense: 67000 },
    { name: "Сб", income: 95000, expense: 32000 },
    { name: "Вс", income: 75000, expense: 25000 },
  ],
  month: [
    { name: "Неделя 1", income: 850000, expense: 320000 },
    { name: "Неделя 2", income: 920000, expense: 380000 },
    { name: "Неделя 3", income: 780000, expense: 290000 },
    { name: "Неделя 4", income: 1100000, expense: 450000 },
  ],
  year: [
    { name: "Янв", income: 3200000, expense: 1200000 },
    { name: "Фев", income: 2800000, expense: 1100000 },
    { name: "Мар", income: 3500000, expense: 1400000 },
    { name: "Апр", income: 3100000, expense: 1250000 },
    { name: "Май", income: 2900000, expense: 1150000 },
    { name: "Июн", income: 3400000, expense: 1350000 },
  ],
};

const clientTypeData = [
  { name: "Физ. лица", value: 65, color: "#8b5cf6" },
  { name: "Юр. лица", value: 35, color: "#3b82f6" },
];

const mockTasks = {
  TODO: [
    { id: "1", title: "Подготовить документы для ООО Вектор", date: "25.03" },
    { id: "2", title: "Согласовать время переезда", date: "25.03" },
    { id: "3", title: "Найти исполнителей на выходные", date: "26.03" },
  ],
  IN_PROGRESS: [
    { id: "4", title: "Переезд офиса на Ленина 45", date: "24.03" },
    { id: "5", title: "Такелажные работы", date: "24.03" },
  ],
  DONE: [
    { id: "6", title: "Разгрузка контейнера", date: "23.03" },
    { id: "7", title: "Упаковка вещей", date: "22.03" },
    { id: "8", title: "Демонтаж мебели", date: "21.03" },
  ],
  CANCELLED: [
    { id: "9", title: "Вывоз мусора (отменён)", date: "20.03" },
  ],
};

const mockRecentApplications = [
  { id: "#047", title: "Переезд офиса", client: "ООО «Вектор»", amount: "45 000 ₽", status: "NEW" },
  { id: "#046", title: "Такелажные работы", client: "Иванов П.С.", amount: "78 000 ₽", status: "IN_PROGRESS" },
  { id: "#045", title: "Разгрузка контейнера", client: "ООО «Ромашка»", amount: "32 000 ₽", status: "COMPLETED" },
  { id: "#044", title: "Демонтаж мебели", client: "Сидоров В.К.", amount: "15 000 ₽", status: "COMPLETED" },
  { id: "#043", title: "Упаковка вещей", client: "Кузнецова Е.П.", amount: "12 000 ₽", status: "NEW" },
];

const mockRecentCalls = [
  { id: 1, phone: "+7 (999) 123-45-67", client: "Иванов П.С.", duration: 125, status: "ANSWERED" },
  { id: 2, phone: "+7 (495) 123-45-67", client: null, duration: 0, status: "MISSED" },
  { id: 3, phone: "+7 (999) 987-65-43", client: "Сидоров В.К.", duration: 340, status: "ANSWERED" },
  { id: 4, phone: "+7 (999) 555-44-33", client: "ООО «Вектор»", duration: 45, status: "ANSWERED" },
  { id: 5, phone: "+7 (999) 111-22-33", client: null, duration: 0, status: "MISSED" },
];

const mockTopPerformers = [
  { id: 1, name: "Смирнов А.В.", orders: 24, earnings: "96 000 ₽", avatar: "СА" },
  { id: 2, name: "Козлова М.И.", orders: 18, earnings: "63 000 ₽", avatar: "КМ" },
  { id: 3, name: "Волков Д.С.", orders: 15, earnings: "52 500 ₽", avatar: "ВД" },
  { id: 4, name: "Петрова Е.А.", orders: 12, earnings: "42 000 ₽", avatar: "ПЕ" },
  { id: 5, name: "Новикова О.С.", orders: 10, earnings: "35 000 ₽", avatar: "НО" },
];

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

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDuration = (seconds: number) => {
  if (seconds === 0) return "—";
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
              <span className="text-xs text-slate-500 dark:text-slate-400">{task.date}</span>
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

export default function DashboardPage() {
  const [stats] = useState(statsData);
  const [chartPeriod, setChartPeriod] = useState<"week" | "month" | "year">("month");
  const [tasks, setTasks] = useState(mockTasks);
  const [activeTask, setActiveTask] = useState<any>(null);

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
            <div className="text-2xl font-bold">{statsData.clients}</div>
            <div className="flex items-center gap-1 text-xs">
              {statsData.clientsChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={statsData.clientsChange > 0 ? "text-green-600" : "text-red-600"}>
                {statsData.clientsChange > 0 ? "+" : ""}{statsData.clientsChange}%
              </span>
              <span className="text-slate-500 dark:text-slate-400">за месяц</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-foreground">Исполнители</CardTitle>
            <UserCheck className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.performers}</div>
            <div className="flex items-center gap-1 text-xs">
              {statsData.performersChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={statsData.performersChange > 0 ? "text-green-600" : "text-red-600"}>
                {statsData.performersChange > 0 ? "+" : ""}{statsData.performersChange}%
              </span>
              <span className="text-slate-500 dark:text-slate-400">за месяц</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-foreground">Заявки</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.applications}</div>
            <div className="flex items-center gap-1 text-xs">
              {statsData.applicationsChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={statsData.applicationsChange > 0 ? "text-green-600" : "text-red-600"}>
                {statsData.applicationsChange > 0 ? "+" : ""}{statsData.applicationsChange}%
              </span>
              <span className="text-slate-500 dark:text-slate-400">за месяц</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900 dark:text-foreground">Доход</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(statsData.revenue)}</div>
            <div className="flex items-center gap-1 text-xs">
              {statsData.revenueChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={statsData.revenueChange > 0 ? "text-green-600" : "text-red-600"}>
                {statsData.revenueChange > 0 ? "+" : ""}{statsData.revenueChange}%
              </span>
              <span className="text-slate-500 dark:text-slate-400">за месяц</span>
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
                <AreaChart data={revenueData[chartPeriod]}>
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
                    data={clientTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {clientTypeData.map((entry, index) => (
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
              {clientTypeData.map((item) => (
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
                  tasks={tasks[key as keyof typeof tasks]}
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
              {mockRecentApplications.map((app) => (
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
                      <p className="text-xs text-slate-500 dark:text-slate-400">{app.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-foreground">{app.amount}</p>
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
              {mockTopPerformers.map((performer, index) => (
                <div
                  key={performer.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-brand-100 text-brand-700 text-sm font-medium dark:bg-brand-900 dark:text-brand-300">
                          {performer.avatar}
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
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">{performer.earnings}</p>
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
            {mockRecentCalls.map((call) => (
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
                      {call.client || "Не определён"}
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
