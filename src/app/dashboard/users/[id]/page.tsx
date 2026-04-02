"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Shield, Calendar, CheckCircle2, XCircle, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const mockUser = {
  id: 1,
  first_name: "Елена",
  last_name: "Петрова",
  email: "petrova@company.ru",
  phone: "+7 (999) 111-22-33",
  role: "MANAGER",
  is_active: true,
  created_at: "2026-01-15",
  last_login: "2026-03-20T14:30:00Z",
  managerPercent: 10,
};

const mockUserApplications = [
  {
    id: "#047",
    title: "Переезд офиса",
    client: "ООО «Вектор»",
    amount: "45 000 ₽",
    status: "NEW",
    created_at: "2026-03-20",
  },
  {
    id: "#042",
    title: "Такелажные работы",
    client: "Иванов П.С.",
    amount: "78 000 ₽",
    status: "IN_PROGRESS",
    created_at: "2026-03-18",
  },
  {
    id: "#038",
    title: "Упаковка вещей",
    client: "Сидоров В.К.",
    amount: "25 000 ₽",
    status: "COMPLETED",
    created_at: "2026-03-15",
  },
];

const mockUserLogs = [
  {
    id: 1,
    timestamp: "2026-03-20T15:30:00Z",
    level: "INFO",
    module: "AUTH",
    moduleLabel: "Авторизация",
    action: "LOGIN",
    actionLabel: "Вход в систему",
    description: "Пользователь успешно вошел в систему",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    timestamp: "2026-03-20T15:15:00Z",
    level: "INFO",
    module: "CLIENTS",
    moduleLabel: "Клиенты",
    action: "CREATE",
    actionLabel: "Создание",
    description: "Создан новый клиент: ООО «Вектор»",
    ip: "192.168.1.100",
  },
  {
    id: 3,
    timestamp: "2026-03-20T14:55:00Z",
    level: "INFO",
    module: "PERFORMERS",
    moduleLabel: "Исполнители",
    action: "ASSIGN",
    actionLabel: "Назначение",
    description: "Исполнитель назначен на заявку #047",
    ip: "192.168.1.100",
  },
  {
    id: 4,
    timestamp: "2026-03-20T14:30:00Z",
    level: "INFO",
    module: "APPLICATIONS",
    moduleLabel: "Заявки",
    action: "UPDATE",
    actionLabel: "Обновление",
    description: "Обновлена заявка #042",
    ip: "192.168.1.100",
  },
  {
    id: 5,
    timestamp: "2026-03-20T14:00:00Z",
    level: "INFO",
    module: "CALLS",
    moduleLabel: "Звонки",
    action: "OUTGOING",
    actionLabel: "Исходящий звонок",
    description: "Исходящий звонок: +7 (999) 123-45-67",
    ip: "192.168.1.100",
  },
];

const roleLabels: Record<string, string> = {
  MANAGER: "Менеджер",
  HEAD_OF_MANAGERS: "Управляющий",
  DIRECTOR: "Директор",
};

const roleColors: Record<string, string> = {
  MANAGER: "bg-blue-100 text-blue-700 border-blue-200",
  HEAD_OF_MANAGERS: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DIRECTOR: "bg-red-100 text-red-700 border-red-200",
};

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

const levelColors: Record<string, string> = {
  INFO: "bg-blue-100 text-blue-700 border-blue-200",
  WARNING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ERROR: "bg-red-100 text-red-700 border-red-200",
};

const moduleColors: Record<string, string> = {
  AUTH: "bg-purple-100 text-purple-700",
  APPLICATIONS: "bg-blue-100 text-blue-700",
  CLIENTS: "bg-green-100 text-green-700",
  PERFORMERS: "bg-indigo-100 text-indigo-700",
  CALLS: "bg-pink-100 text-pink-700",
  PAYMENTS: "bg-amber-100 text-amber-700",
  USERS: "bg-cyan-100 text-cyan-700",
  INTEGRATION: "bg-orange-100 text-orange-700",
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => router.push("/dashboard/users")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold">
            {mockUser.last_name} {mockUser.first_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            ID: {mockUser.id} • {roleLabels[mockUser.role]}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/users/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </div>
      </div>

      {/* Main Info */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Профиль</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="bg-brand-100 text-brand-700 text-2xl">
                {mockUser.last_name[0]}
                {mockUser.first_name[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-bold">
              {mockUser.last_name} {mockUser.first_name}
            </h2>
            <Badge variant="outline" className={`mt-2 ${roleColors[mockUser.role]}`}>
              <Shield className="h-3 w-3 mr-1" />
              {roleLabels[mockUser.role]}
            </Badge>
            {mockUser.role === "MANAGER" && mockUser.managerPercent && (
              <div className="mt-2 text-sm text-slate-600">
                Процент: {mockUser.managerPercent}%
              </div>
            )}
            <div className="mt-4">
              <Badge
                variant="outline"
                className={
                  mockUser.is_active
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }
              >
                {mockUser.is_active ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Активен
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Не активен
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Контактная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border">
                  <Mail className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium">{mockUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border">
                  <Phone className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Телефон</p>
                  <p className="font-medium">{mockUser.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border">
                  <Shield className="h-5 w-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Роль</p>
                  <p className="font-medium">{roleLabels[mockUser.role]}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Дата регистрации</p>
                  <p className="font-medium">
                    {new Date(mockUser.created_at).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Последний вход</p>
                  <p className="font-medium">
                    {new Date(mockUser.last_login).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Applications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Заявки пользователя
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockUserApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{app.title}</p>
                    <p className="text-xs text-slate-500">{app.client} • {app.created_at}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{app.amount}</p>
                  <Badge variant="outline" className={statusColors[app.status]}>
                    {statusLabels[app.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Logs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Последние действия
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/logs/crm`)}
            >
              Все логи
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockUserLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Badge variant="outline" className={levelColors[log.level]}>
                    {log.level}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={moduleColors[log.module]}>
                      {log.moduleLabel}
                    </Badge>
                    <span className="text-sm font-medium">{log.actionLabel}</span>
                  </div>
                  <p className="text-sm text-slate-600">{log.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span>{new Date(log.timestamp).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</span>
                    <span>•</span>
                    <span className="font-mono">{log.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
