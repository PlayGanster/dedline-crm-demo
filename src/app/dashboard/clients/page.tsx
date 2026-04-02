"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, User, Eye, Pencil, Trash2, Plus, Filter, Phone, Mail, FileText } from "lucide-react";
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
import { Pagination } from "@/components/ui/pagination";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

const clientsData = [
  {
    id: 1,
    type: "INDIVIDUAL" as const,
    fio: "Иванов Петр Сергеевич",
    company_name: null,
    email: "ivanov@example.com",
    phone: "+7 (999) 123-45-67",
    inn: "770123456789",
    is_active: true,
    created_at: "2026-03-15",
  },
  {
    id: 2,
    type: "LEGAL_ENTITY" as const,
    fio: null,
    company_name: "ООО «Ритуал-Сервис»",
    email: "info@ritual-service.ru",
    phone: "+7 (495) 123-45-67",
    inn: "7701234567",
    is_active: true,
    created_at: "2026-03-10",
  },
  {
    id: 3,
    type: "INDIVIDUAL" as const,
    fio: "Петрова Анна Ивановна",
    company_name: null,
    email: "petrova@example.com",
    phone: "+7 (999) 234-56-78",
    inn: "770234567890",
    is_active: false,
    created_at: "2026-03-05",
  },
  {
    id: 4,
    type: "LEGAL_ENTITY" as const,
    fio: null,
    company_name: "ИП Смирнов А.В.",
    email: "smirnov@example.com",
    phone: "+7 (999) 345-67-89",
    inn: "7703456789",
    is_active: true,
    created_at: "2026-02-28",
  },
  {
    id: 5,
    type: "INDIVIDUAL" as const,
    fio: "Сидоров Виктор Константинович",
    company_name: null,
    email: "sidorov@example.com",
    phone: "+7 (999) 456-78-90",
    inn: "770456789012",
    is_active: true,
    created_at: "2026-02-20",
  },
];

const clientTypeLabels: Record<string, string> = {
  INDIVIDUAL: "Физ. лицо",
  LEGAL_ENTITY: "Юр. лицо",
};

const clientTypeColors: Record<string, string> = {
  INDIVIDUAL: "bg-blue-100 text-blue-700 border-blue-200",
  LEGAL_ENTITY: "bg-purple-100 text-purple-700 border-purple-200",
};

const columns = [
  { id: "name", title: "Наименование", dataType: "string" },
  { id: "email", title: "Почта", dataType: "email" },
  { id: "phone", title: "Телефон", dataType: "string" },
  { id: "inn", title: "ИНН", dataType: "string" },
  { id: "type", title: "Тип", dataType: "string" },
  { id: "is_active", title: "Статус", dataType: "boolean" },
];

export default function ClientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [deleteClient, setDeleteClient] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredClients = clientsData.filter((client) => {
    const matchesSearch =
      client.fio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.inn?.includes(searchQuery) ||
      client.phone?.includes(searchQuery);

    const matchesFilters = filters.every((filter) => {
      let value: any;
      switch (filter.columnId) {
        case "name":
          value = client.type === "INDIVIDUAL" ? client.fio : client.company_name;
          break;
        case "email":
          value = client.email;
          break;
        case "phone":
          value = client.phone;
          break;
        case "inn":
          value = client.inn;
          break;
        case "type":
          value = clientTypeLabels[client.type];
          break;
        case "is_active":
          value = client.is_active ? "Активен" : "Не активен";
          break;
        default:
          value = "";
      }

      if (!value) return false;

      switch (filter.operator) {
        case "contains":
          return value.toLowerCase().includes(filter.value.toLowerCase());
        case "equals":
          return value.toLowerCase() === filter.value.toLowerCase();
        case "startsWith":
          return value.toLowerCase().startsWith(filter.value.toLowerCase());
        case "endsWith":
          return value.toLowerCase().endsWith(filter.value.toLowerCase());
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredClients.length / pageSize);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeFiltersCount = filters.length;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Клиенты</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Список всех клиентов компании
          </p>
        </div>
        <Button
          size="icon-sm"
          className="bg-brand-600 text-white hover:bg-brand-700 flex-shrink-0"
          onClick={() => router.push("/dashboard/clients/create")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-3">
        <Input
          placeholder="Поиск по ФИО, компании, email или ИНН..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-9"
        />
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
          <span className="ml-2">Фильтры</span>
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

      {/* Active Filters Display */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-500">Фильтры:</span>
          {filters.map((filter, index) => {
            const column = columns.find((c) => c.id === filter.columnId);
            return (
              <Badge
                key={index}
                variant="secondary"
                className="gap-1 pr-1 cursor-pointer text-xs"
              >
                {column?.title}: {filter.value}
                <button
                  onClick={() => {
                    const newFilters = filters.filter((_, i) => i !== index);
                    setFilters(newFilters);
                  }}
                  className="hover:bg-slate-200 rounded-full p-0.5"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => setFilters([])}
          >
            Очистить
          </Button>
        </div>
      )}

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Наименование</TableHead>
              <TableHead>Почта</TableHead>
              <TableHead className="text-center">Телефон</TableHead>
              <TableHead className="text-center">ИНН</TableHead>
              <TableHead className="text-center">Тип</TableHead>
              <TableHead className="text-center">Статус</TableHead>
              <TableHead className="w-32 text-center">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                  Клиенты не найдены
                </TableCell>
              </TableRow>
            ) : (
              paginatedClients.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                >
                  <TableCell className="font-medium text-brand-600">
                    {client.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {client.type === "INDIVIDUAL"
                          ? client.fio || "—"
                          : client.company_name || "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {clientTypeLabels[client.type]}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]">{client.email || "—"}</TableCell>
                  <TableCell className="text-center">{client.phone || "—"}</TableCell>
                  <TableCell className="text-center font-mono text-sm">{client.inn || "—"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={clientTypeColors[client.type]}>
                      {clientTypeLabels[client.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={
                        client.is_active
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }
                    >
                      {client.is_active ? "Активен" : "Не активен"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/clients/${client.id}`);
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
                          router.push(`/dashboard/clients/${client.id}/edit`);
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
                          setDeleteClient({
                            id: client.id,
                            name: client.type === "INDIVIDUAL" ? client.fio : client.company_name
                          });
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginatedClients.length === 0 ? (
          <div className="text-center py-8 text-slate-500 rounded-lg border">
            Клиенты не найдены
          </div>
        ) : (
          paginatedClients.map((client) => (
            <div
              key={client.id}
              className="rounded-lg border bg-white p-3 sm:p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex items-center justify-center h-12 w-12 rounded-full flex-shrink-0 ${
                    client.type === "INDIVIDUAL"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {client.type === "INDIVIDUAL" ? (
                    <User className="h-6 w-6" />
                  ) : (
                    <Building2 className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base truncate">
                    {client.type === "INDIVIDUAL"
                      ? client.fio || "—"
                      : client.company_name || "—"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <Badge className={clientTypeColors[client.type]} variant="outline">
                      {clientTypeLabels[client.type]}
                    </Badge>
                    <Badge
                      className={
                        client.is_active
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                      variant="outline"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full inline-block mr-1.5 ${
                          client.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {client.is_active ? "Активен" : "Не активен"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-700">{client.phone}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-700 truncate">{client.email}</span>
                  </div>
                )}
                {client.inn && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-700">ИНН: {client.inn}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3 flex gap-2">
                {/* Buttons for < 400px - icons only */}
                <Button variant="outline" size="icon-sm" className="flex-1 max-[400px]:inline-flex hidden">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon-sm" className="flex-1 max-[400px]:inline-flex hidden">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="flex-1 max-[400px]:inline-flex hidden text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setDeleteClient({
                    id: client.id,
                    name: client.type === "INDIVIDUAL" ? client.fio : client.company_name
                  })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* Buttons for >= 400px - with text */}
                <Button variant="outline" size="sm" className="flex-1 min-[400px]:inline-flex hidden">
                  <Eye className="h-4 w-4" />
                  <span className="ml-1 text-xs">Просмотр</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 min-[400px]:inline-flex hidden">
                  <Pencil className="h-4 w-4" />
                  <span className="ml-1 text-xs">Ред.</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-[400px]:inline-flex hidden text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setDeleteClient({
                    id: client.id,
                    name: client.type === "INDIVIDUAL" ? client.fio : client.company_name
                  })}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-1 text-xs">Удал.</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        pageSize={pageSize}
        totalItems={filteredClients.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Filter Dialog */}
      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        columns={columns}
        filters={filters}
        onApplyFilters={setFilters}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={!!deleteClient}
        onOpenChange={(open) => !open && setDeleteClient(null)}
        onConfirm={() => {
          setIsDeleting(true);
          setTimeout(() => {
            setIsDeleting(false);
            setDeleteClient(null);
          }, 1000);
        }}
        itemName={deleteClient?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
