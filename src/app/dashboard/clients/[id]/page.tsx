"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  Building2,
  Calendar,
  Clock,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

const mockClient = {
  id: 1,
  type: "INDIVIDUAL" as const,
  fio: "Иванов Петр Сергеевич",
  company_name: null,
  email: "ivanov@example.com",
  phone: "+7 (999) 123-45-67",
  inn: "770123456789",
  kpp: null,
  ogrn: null,
  legal_address: "г. Москва, ул. Ленина, д. 10, кв. 50",
  is_active: true,
  created_at: "2026-03-15T10:30:00Z",
  updated_at: "2026-03-20T14:45:00Z",
};

const mockOrders = [
  { id: "#047", title: "Разработка сайта", date: "20.03.2026", status: "new", amount: "45 000 ₽" },
  { id: "#042", title: "Настройка рекламы", date: "18.03.2026", status: "progress", amount: "25 000 ₽" },
  { id: "#038", title: "Техподдержка", date: "15.03.2026", status: "done", amount: "12 000 ₽" },
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

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const client = mockClient;
  const fullName =
    client.type === "INDIVIDUAL" ? client.fio : client.company_name;

  const handleDeleteClient = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      router.push("/dashboard/clients");
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => router.push("/dashboard/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Клиент</h1>
            <p className="text-sm text-slate-500">{fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border bg-white overflow-hidden">
        {/* Profile Section */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-100 text-brand-600 shrink-0">
              {client.type === "INDIVIDUAL" ? (
                <User className="h-8 w-8" />
              ) : (
                <Building2 className="h-8 w-8" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  className={
                    client.type === "INDIVIDUAL"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }
                >
                  {client.type === "INDIVIDUAL" ? "Физ. лицо" : "Юр. лицо"}
                </Badge>
                <Badge
                  className={
                    client.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full inline-block mr-1.5 ${
                      client.is_active ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {client.is_active ? "Активен" : "Не активен"}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">Клиент #{client.id}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Контакты
              </h3>
              <div className="space-y-2">
                {client.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Документы
              </h3>
              <div className="space-y-2">
                {client.inn && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 w-12">ИНН</span>
                    <span className="font-medium">{client.inn}</span>
                  </div>
                )}
                {client.kpp && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 w-12">КПП</span>
                    <span className="font-medium">{client.kpp}</span>
                  </div>
                )}
                {client.ogrn && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 w-12">ОГРН</span>
                    <span className="font-medium">{client.ogrn}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Адрес
              </h3>
              {client.legal_address ? (
                <p className="text-sm">{client.legal_address}</p>
              ) : (
                <p className="text-sm text-slate-400">Не указан</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="rounded-xl border bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Информация
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-sm font-bold text-slate-600">#</span>
            </div>
            <div>
              <p className="text-xs text-slate-500">ID</p>
              <p className="text-sm font-medium">{client.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Calendar className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Создан</p>
              <p className="text-sm font-medium">
                {new Date(client.created_at).toLocaleDateString("ru-RU")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Clock className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Обновлен</p>
              <p className="text-sm font-medium">
                {new Date(client.updated_at).toLocaleDateString("ru-RU")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Clock className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Время</p>
              <p className="text-sm font-medium">
                {new Date(client.created_at).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Последние заявки
          </h3>
          <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50">
            Все
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="divide-y">
          {mockOrders.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Нет заявок
            </div>
          ) : (
            mockOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-medium text-brand-600 shrink-0">{order.id}</span>
                  <Badge className={statusColors[order.status]} variant="outline">
                    {statusLabels[order.status]}
                  </Badge>
                  <span className="text-sm truncate">{order.title}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm text-slate-500">{order.date}</span>
                  <span className="text-sm font-medium">{order.amount}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteClient}
        title="Удалить клиента?"
        description={`Вы уверены что хотите удалить ${fullName}? Это действие нельзя отменить.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
