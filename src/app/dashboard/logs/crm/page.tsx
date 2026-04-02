"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  FileText,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockLogs = [
  {
    id: 1,
    timestamp: "2026-03-20T15:30:00Z",
    level: "INFO",
    module: "AUTH",
    action: "LOGIN",
    user: "petrova@company.ru",
    userName: "Петрова Е.А.",
    userAvatar: "ПЕ",
    userId: 1,
    description: "Пользователь успешно вошел в систему",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    timestamp: "2026-03-20T15:25:00Z",
    level: "WARNING",
    module: "APPLICATIONS",
    action: "UPDATE",
    user: "smirnov@company.ru",
    userName: "Смирнов А.В.",
    userAvatar: "СА",
    userId: 2,
    description: "Попытка изменить заявку без прав доступа",
    ip: "192.168.1.101",
  },
  {
    id: 3,
    timestamp: "2026-03-20T15:20:00Z",
    level: "ERROR",
    module: "PAYMENTS",
    action: "CREATE",
    user: "volkov@company.ru",
    userName: "Волков Д.С.",
    userAvatar: "ВД",
    userId: 3,
    description: "Ошибка при создании транзакции: недостаточно средств",
    ip: "192.168.1.102",
  },
  {
    id: 4,
    timestamp: "2026-03-20T15:15:00Z",
    level: "INFO",
    module: "CLIENTS",
    action: "CREATE",
    user: "petrova@company.ru",
    userName: "Петрова Е.А.",
    userAvatar: "ПЕ",
    userId: 1,
    description: "Создан новый клиент: ООО «Вектор»",
    ip: "192.168.1.100",
  },
  {
    id: 5,
    timestamp: "2026-03-20T15:10:00Z",
    level: "INFO",
    module: "CALLS",
    action: "INCOMING",
    user: "system",
    userName: "Система",
    userAvatar: "СИ",
    userId: null,
    description: "Входящий звонок: +7 (999) 123-45-67",
    ip: "192.168.1.1",
  },
  {
    id: 6,
    timestamp: "2026-03-20T15:05:00Z",
    level: "WARNING",
    module: "USERS",
    action: "PASSWORD_RESET",
    user: "kozlova@company.ru",
    userName: "Козлова М.И.",
    userAvatar: "КМ",
    userId: 4,
    description: "Запрос на сброс пароля",
    ip: "192.168.1.103",
  },
  {
    id: 7,
    timestamp: "2026-03-20T15:00:00Z",
    level: "ERROR",
    module: "INTEGRATION",
    action: "API_CALL",
    user: "system",
    userName: "Система",
    userAvatar: "СИ",
    userId: null,
    description: "Ошибка API интеграции: таймаут соединения",
    ip: "192.168.1.1",
  },
  {
    id: 8,
    timestamp: "2026-03-20T14:55:00Z",
    level: "INFO",
    module: "PERFORMERS",
    action: "ASSIGN",
    user: "smirnov@company.ru",
    userName: "Смирнов А.В.",
    userAvatar: "СА",
    userId: 2,
    description: "Исполнитель назначен на заявку #047",
    ip: "192.168.1.101",
  },
];

const levelColors: Record<string, string> = {
  INFO: "bg-blue-100 text-blue-700 border-blue-200",
  WARNING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ERROR: "bg-red-100 text-red-700 border-red-200",
  DEBUG: "bg-slate-100 text-slate-700 border-slate-200",
};

const levelIcons: Record<string, any> = {
  INFO: Info,
  WARNING: AlertCircle,
  ERROR: XCircle,
  DEBUG: Clock,
};

const moduleLabels: Record<string, string> = {
  AUTH: "Авторизация",
  APPLICATIONS: "Заявки",
  CLIENTS: "Клиенты",
  PERFORMERS: "Исполнители",
  PAYMENTS: "Платежи",
  CALLS: "Звонки",
  USERS: "Пользователи",
  INTEGRATION: "Интеграция",
};

const actionLabels: Record<string, string> = {
  LOGIN: "Вход",
  LOGOUT: "Выход",
  CREATE: "Создание",
  UPDATE: "Обновление",
  DELETE: "Удаление",
  ASSIGN: "Назначение",
  INCOMING: "Входящий",
  OUTGOING: "Исходящий",
  PASSWORD_RESET: "Сброс пароля",
  API_CALL: "API запрос",
};

const moduleColors: Record<string, string> = {
  AUTH: "bg-purple-100 text-purple-700",
  APPLICATIONS: "bg-blue-100 text-blue-700",
  CLIENTS: "bg-green-100 text-green-700",
  PERFORMERS: "bg-indigo-100 text-indigo-700",
  PAYMENTS: "bg-amber-100 text-amber-700",
  CALLS: "bg-pink-100 text-pink-700",
  USERS: "bg-cyan-100 text-cyan-700",
  INTEGRATION: "bg-orange-100 text-orange-700",
};

export default function CrmLogsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [moduleFilter, setModuleFilter] = useState("ALL");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "ALL" || log.level === levelFilter;
    const matchesModule = moduleFilter === "ALL" || log.module === moduleFilter;
    return matchesSearch && matchesLevel && matchesModule;
  });

  const stats = {
    total: mockLogs.length,
    info: mockLogs.filter((l) => l.level === "INFO").length,
    warning: mockLogs.filter((l) => l.level === "WARNING").length,
    error: mockLogs.filter((l) => l.level === "ERROR").length,
  };

  const handleDownload = () => {
    const content = `ЛОГИ CRM\nДата выгрузки: ${new Date().toLocaleString("ru-RU")}\n\n` +
      mockLogs.map(log => 
        `[${log.timestamp}] ${log.level} [${log.module}] ${log.action} - ${log.description} (Пользователь: ${log.user}, IP: ${log.ip})`
      ).join("\n");
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `crm-logs-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Логи CRM</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Журнал событий системы CRM
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Экспорт
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Всего</p>
                <p className="text-lg font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Инфо</p>
                <p className="text-lg font-bold text-blue-600">{stats.info}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Предупреждения</p>
                <p className="text-lg font-bold text-yellow-600">{stats.warning}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Ошибки</p>
                <p className="text-lg font-bold text-red-600">{stats.error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Поиск по описанию, пользователю..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Уровень" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все уровни</SelectItem>
            <SelectItem value="INFO">Инфо</SelectItem>
            <SelectItem value="WARNING">Предупреждения</SelectItem>
            <SelectItem value="ERROR">Ошибки</SelectItem>
          </SelectContent>
        </Select>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Модуль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все модули</SelectItem>
            <SelectItem value="AUTH">Авторизация</SelectItem>
            <SelectItem value="APPLICATIONS">Заявки</SelectItem>
            <SelectItem value="CLIENTS">Клиенты</SelectItem>
            <SelectItem value="PERFORMERS">Исполнители</SelectItem>
            <SelectItem value="PAYMENTS">Платежи</SelectItem>
            <SelectItem value="CALLS">Звонки</SelectItem>
            <SelectItem value="USERS">Пользователи</SelectItem>
            <SelectItem value="INTEGRATION">Интеграция</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead className="w-40">Время</TableHead>
                <TableHead className="w-24">Уровень</TableHead>
                <TableHead className="w-28">Модуль</TableHead>
                <TableHead className="w-28">Действие</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead className="w-32">Пользователь</TableHead>
                <TableHead className="w-28">IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                    Логи не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const LevelIcon = levelIcons[log.level] || Info;
                  return (
                    <TableRow key={log.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-500">
                        {log.id}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(log.timestamp).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={levelColors[log.level]}>
                          <LevelIcon className="h-3 w-3 mr-1" />
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={moduleColors[log.module]}>
                          {moduleLabels[log.module]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {actionLabels[log.action] || log.action}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-[200px] truncate">
                        {log.description}
                      </TableCell>
                      <TableCell>
                        {log.userId ? (
                          <div
                            className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-600 transition-colors"
                            onClick={() => router.push(`/dashboard/users/${log.userId}`)}
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-slate-100 text-slate-700 text-xs">
                                {log.userAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{log.userName}</span>
                            <ArrowUpRight className="h-3 w-3 text-slate-400" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <User className="h-3 w-3" />
                            <span>{log.user}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 font-mono">
                        {log.ip}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
