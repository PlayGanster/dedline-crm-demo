"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  User,
  Pencil,
  Trash2,
  Eye,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  XCircle,
  MoreVertical,
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
import { FilterDialog } from "@/components/ui/filter-dialog";

const mockUsers = [
  {
    id: 1,
    first_name: "Елена",
    last_name: "Петрова",
    email: "petrova@company.ru",
    phone: "+7 (999) 111-22-33",
    role: "MANAGER",
    managerPercent: 10,
    is_active: true,
    created_at: "2026-01-15",
  },
  {
    id: 2,
    first_name: "Алексей",
    last_name: "Смирнов",
    email: "smirnov@company.ru",
    phone: "+7 (999) 222-33-44",
    role: "MANAGER",
    managerPercent: 8,
    is_active: true,
    created_at: "2026-01-20",
  },
  {
    id: 3,
    first_name: "Дмитрий",
    last_name: "Волков",
    email: "volkov@company.ru",
    phone: "+7 (999) 333-44-55",
    role: "HEAD_OF_MANAGERS",
    supervisorPercent: 5,
    is_active: true,
    created_at: "2025-12-01",
  },
  {
    id: 4,
    first_name: "Иван",
    last_name: "Иванов",
    email: "ivanov@company.ru",
    phone: "+7 (999) 555-66-77",
    role: "DIRECTOR",
    is_active: true,
    created_at: "2025-10-01",
  },
];

const roleLabels: Record<string, string> = {
  MANAGER: "Менеджер",
  HEAD_OF_MANAGERS: "Управляющий",
  DIRECTOR: "Директор",
};

const roleColors: Record<string, string> = {
  MANAGER: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800",
  HEAD_OF_MANAGERS: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-800",
  DIRECTOR: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800",
};

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const columns = [
    { id: "id", title: "ID", dataType: "number" },
    { id: "full_name", title: "ФИО", dataType: "string" },
    { id: "email", title: "Email", dataType: "string" },
    { id: "phone", title: "Телефон", dataType: "string" },
    { id: "role", title: "Роль", dataType: "string" },
    { id: "is_active", title: "Статус", dataType: "string" },
  ];

  const filteredUsers = mockUsers.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFiltersCount = filters.length;

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.is_active).length,
    inactive: mockUsers.filter((u) => !u.is_active).length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Пользователи</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Все пользователи системы
          </p>
        </div>
        <Button
          size="icon-sm"
          className="bg-brand-600 text-white hover:bg-brand-700"
          onClick={() => router.push("/dashboard/users/create")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-card">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Всего</p>
                <p className="text-lg font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Активны</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Не активны</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Поиск по имени, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(true)}
          className="relative shrink-0"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Фильтры</span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-white dark:bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-700">
                <TableHead className="text-slate-900 dark:text-foreground">ID</TableHead>
                <TableHead className="text-slate-900 dark:text-foreground">ФИО</TableHead>
                <TableHead className="text-slate-900 dark:text-foreground">Email</TableHead>
                <TableHead className="text-slate-900 dark:text-foreground">Телефон</TableHead>
                <TableHead className="text-slate-900 dark:text-foreground">Роль</TableHead>
                <TableHead className="text-slate-900 dark:text-foreground text-center">Статус</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500 dark:text-slate-400">
                    Пользователи не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <TableCell className="font-medium text-brand-600 dark:text-brand-400">
                      {user.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                            {user.last_name[0]}
                            {user.first_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {user.last_name} {user.first_name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColors[user.role]}>
                        <Shield className="h-3 w-3 mr-1" />
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          user.is_active
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
                            : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
                        }
                      >
                        {user.is_active ? "Активен" : "Не активен"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="dark:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="dark:bg-card dark:border-slate-700">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/users/${user.id}`)
                            }
                            className="dark:text-foreground dark:focus:bg-slate-800"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Просмотр
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/users/${user.id}/edit`)
                            }
                            className="dark:text-foreground dark:focus:bg-slate-800"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 dark:text-red-400 dark:focus:bg-slate-800">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        columns={columns}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
}
