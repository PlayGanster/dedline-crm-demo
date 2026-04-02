"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Mail, Phone, MapPin, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CitySelector } from "@/components/ui/city-selector";
import { Textarea } from "@/components/ui/textarea";
import { ClientSelectorDialog } from "@/components/ui/client-selector";
import { StaffSelectorDialog } from "@/components/ui/staff-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockApplication = {
  id: 47,
  title: "Переезд офиса",
  client_id: 1,
  manager_id: 1,
  supervisor_id: 2,
  status: "IN_PROGRESS",
  budget: "45000",
  city: "Москва",
  manager_comment: "Клиент просит позвонить за час до начала работ",
  client: {
    id: 1,
    fio: "Иванов Петр Сергеевич",
    company_name: null,
    type: "INDIVIDUAL" as const,
    email: "ivanov@example.com",
    phone: "+7 (999) 123-45-67",
  },
};

const mockClients = [
  { id: 1, fio: "Иванов Петр Сергеевич", company_name: null, type: "INDIVIDUAL" as const, email: "ivanov@example.com", phone: "+7 (999) 123-45-67" },
  { id: 2, fio: null, company_name: "ООО «Вектор»", type: "LEGAL_ENTITY" as const, email: "info@vector.ru", phone: "+7 (495) 123-45-67" },
  { id: 3, fio: "Сидоров Виктор Константинович", company_name: null, type: "INDIVIDUAL" as const, email: "sidorov@example.com", phone: "+7 (999) 987-65-43" },
];

const mockManagers = [
  { id: 1, fio: "Петрова Елена Александровна", email: "petrova@company.ru", phone: "+7 (999) 111-22-33" },
  { id: 2, fio: "Смирнов Алексей Владимирович", email: "smirnov@company.ru", phone: "+7 (999) 222-33-44" },
];

const mockSupervisors = [
  { id: 1, fio: "Волков Дмитрий Сергеевич", email: "volkov@company.ru", phone: "+7 (999) 333-44-55" },
  { id: 2, fio: "Козлова Мария Ивановна", email: "kozlova@company.ru", phone: "+7 (999) 444-55-66" },
];

export default function ApplicationEditPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("main");

  const fromPage = searchParams.get("from") || "/dashboard/requests";

  const [formData, setFormData] = useState({
    title: mockApplication.title,
    status: mockApplication.status,
    budget: mockApplication.budget,
    city: mockApplication.city,
    client_id: mockApplication.client_id,
    manager_id: mockApplication.manager_id,
    supervisor_id: mockApplication.supervisor_id,
    manager_comment: mockApplication.manager_comment,
  });

  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);

  const selectedClient = mockClients.find(c => c.id === formData.client_id) || mockApplication.client;
  const selectedManager = mockManagers.find(m => m.id === formData.manager_id) || mockManagers[0];
  const selectedSupervisor = mockSupervisors.find(s => s.id === formData.supervisor_id) || mockSupervisors[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/requests/${id}`);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => router.push(`/dashboard/requests/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Редактирование заявки</h1>
          <p className="text-sm text-slate-500">Заявка #{id}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название заявки</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Переезд офиса"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Новая</SelectItem>
                    <SelectItem value="IN_PROGRESS">В работе</SelectItem>
                    <SelectItem value="COMPLETED">Завершена</SelectItem>
                    <SelectItem value="CANCELLED">Отменена</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Депозит (предоплачено) (₽)</Label>
                <Input
                  id="deposit"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Город
              </Label>
              <CitySelector
                value={formData.city}
                onChange={(value) => setFormData({ ...formData, city: value })}
                placeholder="Выберите город"
              />
            </div>
          </CardContent>
        </Card>

        {/* Client & Team */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Клиент и команда
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Client */}
            <div className="space-y-2">
              <Label>Клиент</Label>
              <div
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsClientDialogOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={
                      selectedClient.type === "INDIVIDUAL"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }>
                      {selectedClient.type === "INDIVIDUAL"
                        ? selectedClient.fio?.[0]
                        : selectedClient.company_name?.[0] || "К"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {selectedClient.type === "INDIVIDUAL" ? selectedClient.fio : selectedClient.company_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedClient.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedClient.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Manager */}
            <div className="space-y-2">
              <Label>Менеджер</Label>
              <div
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsManagerDialogOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-100 text-slate-700">
                      {selectedManager.fio.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{selectedManager.fio}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedManager.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedManager.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supervisor */}
            <div className="space-y-2">
              <Label>Управляющий</Label>
              <div
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsSupervisorDialogOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-100 text-slate-700">
                      {selectedSupervisor.fio.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{selectedSupervisor.fio}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedSupervisor.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedSupervisor.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Selector Dialog */}
        <ClientSelectorDialog
          open={isClientDialogOpen}
          onOpenChange={setIsClientDialogOpen}
          clients={mockClients}
          selectedId={formData.client_id}
          onSelect={(client) => setFormData({ ...formData, client_id: client.id })}
        />

        {/* Manager Selector Dialog */}
        <StaffSelectorDialog
          open={isManagerDialogOpen}
          onOpenChange={setIsManagerDialogOpen}
          members={mockManagers}
          selectedId={formData.manager_id}
          onSelect={(manager) => setFormData({ ...formData, manager_id: manager.id })}
          title="Выберите менеджера"
        />

        {/* Supervisor Selector Dialog */}
        <StaffSelectorDialog
          open={isSupervisorDialogOpen}
          onOpenChange={setIsSupervisorDialogOpen}
          members={mockSupervisors}
          selectedId={formData.supervisor_id}
          onSelect={(supervisor) => setFormData({ ...formData, supervisor_id: supervisor.id })}
          title="Выберите управляющего"
        />

        {/* Manager Comment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Комментарий менеджера
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.manager_comment}
              onChange={(e) => setFormData({ ...formData, manager_comment: e.target.value })}
              placeholder="Комментарий для исполнителей..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/requests/${id}`)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="bg-brand-600 text-white hover:bg-brand-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
