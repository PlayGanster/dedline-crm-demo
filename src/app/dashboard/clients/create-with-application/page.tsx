"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, User, Building2, Mail, Phone, MapPin, MessageSquare, DollarSign, FileText, Users, Search, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CitySelector } from "@/components/ui/city-selector";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyCheckButton } from "@/components/company-check/CompanyCheckButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '7') {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  }
  return phone;
};

const mockManagers = [
  { id: 1, fio: "Петрова Елена Александровна", email: "petrova@company.ru", phone: "+7 (999) 111-22-33" },
  { id: 2, fio: "Смирнов Алексей Владимирович", email: "smirnov@company.ru", phone: "+7 (999) 222-33-44" },
];

const mockSupervisors = [
  { id: 1, fio: "Волков Дмитрий Сергеевич", email: "volkov@company.ru", phone: "+7 (999) 333-44-55" },
  { id: 2, fio: "Козлова Мария Ивановна", email: "kozlova@company.ru", phone: "+7 (999) 444-55-66" },
];

export default function ClientWithApplicationCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const fromPage = searchParams.get("from") || "/dashboard/clients";
  const phoneParam = searchParams.get("phone") || "";
  const notesParam = searchParams.get("notes") || "";

  const [clientData, setClientData] = useState({
    type: "INDIVIDUAL" as "INDIVIDUAL" | "LEGAL_ENTITY",
    fio: "",
    company_name: "",
    email: "",
    phone: phoneParam ? formatPhone(phoneParam) : "",
    city: "",
    inn: "",
    kpp: "",
    ogrn: "",
    legal_address: "",
    is_active: true,
  });

  const [applicationData, setApplicationData] = useState({
    title: "",
    status: "NEW",
    budget: "",
    city: "",
    manager_comment: notesParam,
  });

  const [managerId, setManagerId] = useState(1);
  const [supervisorId, setSupervisorId] = useState(1);
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);
  const [isSupervisorDialogOpen, setIsSupervisorDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedManager = mockManagers.find(m => m.id === managerId) || mockManagers[0];
  const selectedSupervisor = mockSupervisors.find(s => s.id === supervisorId) || mockSupervisors[0];

  const filteredManagers = mockManagers.filter(manager =>
    manager.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSupervisors = mockSupervisors.filter(supervisor =>
    supervisor.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supervisor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (step === 1) {
      const isValid = clientData.type === "INDIVIDUAL" 
        ? clientData.fio && clientData.phone 
        : clientData.company_name && clientData.phone;
      if (isValid) {
        setStep(2);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.push(fromPage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Имитация создания
    setTimeout(() => {
      setLoading(false);
      router.push(fromPage);
    }, 1000);
  };

  const isClientValid = clientData.type === "INDIVIDUAL" 
    ? clientData.fio && clientData.phone 
    : clientData.company_name && clientData.phone;

  const isApplicationValid = applicationData.title;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Создание клиента и заявки</h1>
          <p className="text-sm text-slate-500">Шаг {step} из 2</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          step === 1 ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"
        }`}>
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${
            step === 1 ? "bg-brand-600 text-white" : "bg-slate-300"
          }`}>
            1
          </div>
          <span className="text-sm font-medium">Клиент</span>
        </div>
        <div className="w-8 h-px bg-slate-300" />
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          step === 2 ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"
        }`}>
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${
            step === 2 ? "bg-brand-600 text-white" : "bg-slate-300"
          }`}>
            2
          </div>
          <span className="text-sm font-medium">Заявка</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            {/* Client Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Основная информация</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2 block">Тип клиента</Label>
                    <Tabs
                      value={clientData.type}
                      onValueChange={(v) =>
                        setClientData({
                          ...clientData,
                          type: v as "INDIVIDUAL" | "LEGAL_ENTITY",
                        })
                      }
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="INDIVIDUAL">
                          <User className="h-3.5 w-3.5 mr-1" />
                          Физ.
                        </TabsTrigger>
                        <TabsTrigger value="LEGAL_ENTITY">
                          <Building2 className="h-3.5 w-3.5 mr-1" />
                          Юр.
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div>
                    <Label className="mb-2 block">Статус</Label>
                    <Tabs
                      value={clientData.is_active ? "active" : "inactive"}
                      onValueChange={(v) =>
                        setClientData({ ...clientData, is_active: v === "active" })
                      }
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="active">Активен</TabsTrigger>
                        <TabsTrigger value="inactive">Не активен</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div>
                    <Label className="mb-2 block">Телефон</Label>
                    <Input
                      type="tel"
                      value={clientData.phone}
                      onChange={(e) =>
                        setClientData({ ...clientData, phone: e.target.value })
                      }
                      placeholder="+7 (999) 000-00-00"
                    />
                  </div>
                </div>

                {notesParam && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-blue-800">Комментарий из звонка:</p>
                        <p className="text-sm text-blue-700 mt-1">{notesParam}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Individual/Entity Details */}
            {clientData.type === "INDIVIDUAL" ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Данные физического лица
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fio" className="mb-2 block">ФИО</Label>
                      <Input
                        id="fio"
                        value={clientData.fio}
                        onChange={(e) =>
                          setClientData({ ...clientData, fio: e.target.value })
                        }
                        placeholder="Иванов Иван Иванович"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="mb-2 block">Город</Label>
                      <CitySelector
                        id="city"
                        value={clientData.city}
                        onChange={(value) =>
                          setClientData({ ...clientData, city: value })
                        }
                        placeholder="Выберите город"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Данные юридического лица
                    </div>
                    <CompanyCheckButton
                      inn={clientData.inn}
                      companyName={clientData.company_name}
                      onCompanySelect={(data) => {
                        setClientData({
                          ...clientData,
                          company_name: data.company_name,
                          inn: data.inn,
                          ogrn: data.ogrn,
                          kpp: data.kpp,
                          legal_address: data.legal_address,
                        });
                      }}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Название компании</Label>
                    <Input
                      id="company_name"
                      value={clientData.company_name}
                      onChange={(e) =>
                        setClientData({ ...clientData, company_name: e.target.value })
                      }
                      placeholder='ООО "Ромашка"'
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inn">ИНН</Label>
                      <Input
                        id="inn"
                        value={clientData.inn}
                        onChange={(e) =>
                          setClientData({ ...clientData, inn: e.target.value })
                        }
                        placeholder="7701234567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kpp">КПП</Label>
                      <Input
                        id="kpp"
                        value={clientData.kpp}
                        onChange={(e) =>
                          setClientData({ ...clientData, kpp: e.target.value })
                        }
                        placeholder="770101001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ogrn">ОГРН</Label>
                      <Input
                        id="ogrn"
                        value={clientData.ogrn}
                        onChange={(e) =>
                          setClientData({ ...clientData, ogrn: e.target.value })
                        }
                        placeholder="1027700123456"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="legal_address">Юридический адрес</Label>
                    <Textarea
                      id="legal_address"
                      value={clientData.legal_address}
                      onChange={(e) =>
                        setClientData({ ...clientData, legal_address: e.target.value })
                      }
                      placeholder="123456, г. Москва, ул. Ленина, д. 1"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientData.email}
                      onChange={(e) =>
                        setClientData({ ...clientData, email: e.target.value })
                      }
                      placeholder="info@company.ru"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {step === 2 && (
          <>
            {/* Application Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Информация о заявке
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notesParam && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-blue-800">Комментарий из звонка:</p>
                        <p className="text-sm text-blue-700 mt-1">{notesParam}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="app-title">Название заявки</Label>
                  <Input
                    id="app-title"
                    value={applicationData.title}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, title: e.target.value })
                    }
                    placeholder="Например: Переезд офиса"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Статус</Label>
                    <Select
                      value={applicationData.status}
                      onValueChange={(v) =>
                        setApplicationData({ ...applicationData, status: v })
                      }
                    >
                      <SelectTrigger className="h-9">
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
                  <div>
                    <Label className="mb-2 block">Депозит (предоплачено) (₽)</Label>
                    <Input
                      type="number"
                      value={applicationData.budget}
                      onChange={(e) =>
                        setApplicationData({ ...applicationData, budget: e.target.value })
                      }
                      placeholder="45000"
                      className="h-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="app-city" className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    Город
                  </Label>
                  <CitySelector
                    id="app-city"
                    value={applicationData.city}
                    onChange={(value) =>
                      setApplicationData({ ...applicationData, city: value })
                    }
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
                  <div className="p-3 rounded-lg border bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={
                          clientData.type === "INDIVIDUAL"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }>
                          {clientData.type === "INDIVIDUAL"
                            ? clientData.fio?.[0]
                            : clientData.company_name?.[0] || "К"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {clientData.type === "INDIVIDUAL" ? clientData.fio : clientData.company_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1 truncate">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            {clientData.phone}
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
                    onClick={() => {
                      setSearchQuery("");
                      setIsManagerDialogOpen(true);
                    }}
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
                    onClick={() => {
                      setSearchQuery("");
                      setIsSupervisorDialogOpen(true);
                    }}
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
                  value={applicationData.manager_comment}
                  onChange={(e) =>
                    setApplicationData({ ...applicationData, manager_comment: e.target.value })
                  }
                  placeholder="Дополнительный комментарий..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
          >
            {step === 1 ? "Отмена" : "Назад"}
          </Button>
          {step === 1 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              disabled={!isClientValid}
              className="bg-brand-600 text-white hover:bg-brand-700"
            >
              Далее
            </Button>
          ) : (
            <Button
              type="submit"
              size="sm"
              disabled={loading || !isApplicationValid}
              className="bg-brand-600 text-white hover:bg-brand-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Создание..." : "Создать"}
            </Button>
          )}
        </div>
      </form>

      {/* Manager Dialog */}
      <Dialog open={isManagerDialogOpen} onOpenChange={setIsManagerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Выберите менеджера</DialogTitle>
          </DialogHeader>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <div className="max-h-[400px] overflow-auto space-y-2">
            {filteredManagers.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Пользователи не найдены</p>
            ) : (
              filteredManagers.map((manager) => (
                <div
                  key={manager.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    setManagerId(manager.id);
                    setIsManagerDialogOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-100 text-slate-700">
                        {manager.fio.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{manager.fio}</p>
                      <p className="text-sm text-slate-500">{manager.email}</p>
                    </div>
                  </div>
                  {managerId === manager.id && (
                    <CheckCircle2 size={20} className="text-brand-600" />
                  )}
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManagerDialogOpen(false)}>
              Отмена
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supervisor Dialog */}
      <Dialog open={isSupervisorDialogOpen} onOpenChange={setIsSupervisorDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Выберите управляющего</DialogTitle>
          </DialogHeader>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Поиск по имени или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <div className="max-h-[400px] overflow-auto space-y-2">
            {filteredSupervisors.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Пользователи не найдены</p>
            ) : (
              filteredSupervisors.map((supervisor) => (
                <div
                  key={supervisor.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    setSupervisorId(supervisor.id);
                    setIsSupervisorDialogOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-100 text-slate-700">
                        {supervisor.fio.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{supervisor.fio}</p>
                      <p className="text-sm text-slate-500">{supervisor.email}</p>
                    </div>
                  </div>
                  {supervisorId === supervisor.id && (
                    <CheckCircle2 size={20} className="text-brand-600" />
                  )}
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSupervisorDialogOpen(false)}>
              Отмена
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
