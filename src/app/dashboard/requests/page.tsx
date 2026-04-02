"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterDialog } from "@/components/ui/filter-dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

const mockApplications = [
  {
    id: "#047",
    title: "Переезд офиса",
    client_id: 1,
    client_name: "ООО «Вектор»",
    status: "NEW",
    amount: "45000",
    performers_count: 2,
    city: "Москва",
    created_at: "2026-03-20T10:30:00Z",
    tasks: [{ quantity: 4 }],
    performers: [],
  },
  {
    id: "#046",
    title: "Такелажные работы",
    client_id: 2,
    client_name: "Иванов Петр Сергеевич",
    status: "IN_PROGRESS",
    amount: "78000",
    performers_count: 4,
    city: "Санкт-Петербург",
    created_at: "2026-03-18T14:00:00Z",
    tasks: [{ quantity: 6 }],
    performers: [{ id: 1 }, { id: 2 }],
  },
  {
    id: "#045",
    title: "Разгрузка контейнера",
    client_id: 3,
    client_name: "ООО «Ромашка»",
    status: "COMPLETED",
    amount: "32000",
    performers_count: 3,
    city: "Казань",
    created_at: "2026-03-15T09:00:00Z",
    tasks: [{ quantity: 3 }],
    performers: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  {
    id: "#044",
    title: "Демонтаж мебели",
    client_id: 4,
    client_name: "Сидоров Виктор Константинович",
    status: "CANCELLED",
    amount: "15000",
    performers_count: 2,
    city: "Екатеринбург",
    created_at: "2026-03-12T11:30:00Z",
    tasks: [{ quantity: 2 }],
    performers: [],
  },
  {
    id: "#043",
    title: "Упаковка вещей",
    client_id: 5,
    client_name: "Кузнецова Елена Павловна",
    status: "NEW",
    amount: "12000",
    performers_count: 2,
    city: "Новосибирск",
    created_at: "2026-03-10T16:00:00Z",
    tasks: [{ quantity: 2 }],
    performers: [],
  },
];

const statusLabels: Record<string, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершена",
  CANCELLED: "Отменена",
};

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700 border-yellow-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export default function ApplicationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteApplication, setDeleteApplication] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredApplications = mockApplications.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFiltersCount = filters.length;

  const columns = [
    { id: "title", title: "Название", dataType: "string" },
    { id: "client_name", title: "Клиент", dataType: "string" },
    { id: "status", title: "Статус", dataType: "string" },
    { id: "city", title: "Город", dataType: "string" },
    { id: "amount", title: "Сумма", dataType: "string" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Заявки</h1>
          <p className="text-xs sm:text-sm text-slate-500">Управление заявками клиентов</p>
        </div>
        <Button
          size="icon-sm"
          className="bg-brand-600 text-white hover:bg-brand-700 flex-shrink-0"
          onClick={() => router.push("/dashboard/requests/create")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Поиск по названию, клиенту или ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setIsFilterOpen(true)}
          className="relative shrink-0 sm:hidden"
        >
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(true)}
          className="relative shrink-0 hidden sm:inline-flex"
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
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Город</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead className="text-center">Исполнители</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="w-32 text-center">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-slate-500">
                  Заявки не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((app) => (
                <TableRow
                  key={app.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => router.push(`/dashboard/requests/${app.id.replace("#", "")}`)}
                >
                  <TableCell className="font-medium text-brand-600">
                    {app.id}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{app.title}</p>
                  </TableCell>
                  <TableCell>{app.client_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {app.city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[app.status]}>
                      {statusLabels[app.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {parseInt(app.amount).toLocaleString("ru-RU")} ₽
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-3 w-3 text-slate-400" />
                      <span className="text-sm">
                        {app.performers.length} / {app.tasks?.reduce((sum, t) => sum + t.quantity, 0) || app.performers_count}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(app.created_at).toLocaleDateString("ru-RU")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/requests/${app.id.replace("#", "")}`);
                        }}
                        title="Просмотр"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/requests/${app.id.replace("#", "")}/edit`);
                        }}
                        title="Редактировать"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteApplication({ id: app.id, name: app.title });
                        }}
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Filter Dialog */}
      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        columns={columns}
        filters={filters}
        onApplyFilters={setFilters}
      />

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={!!deleteApplication}
        onOpenChange={(open) => !open && setDeleteApplication(null)}
        onConfirm={() => {
          setIsDeleting(true);
          setTimeout(() => {
            setIsDeleting(false);
            setDeleteApplication(null);
          }, 1000);
        }}
        itemName={deleteApplication?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
