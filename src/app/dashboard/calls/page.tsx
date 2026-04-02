"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  UserPlus,
  FileText,
  Plus,
  MoreVertical,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterDialog } from "@/components/ui/filter-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const mockCalls = [
  {
    id: 1,
    phone: "+7 (999) 123-45-67",
    caller_name: "Иванов П.С.",
    duration: 125,
    notes: "Интересует переезд офиса",
    status: "ANSWERED",
    created_at: "2026-03-20T14:30:00Z",
    crm_user: {
      id: 1,
      first_name: "Елена",
      last_name: "Петрова",
      email: "petrova@company.ru",
    },
    client: {
      id: 1,
      fio: "Иванов Петр Сергеевич",
      company_name: null,
      type: "INDIVIDUAL",
    },
    application: null,
  },
  {
    id: 2,
    phone: "+7 (495) 123-45-67",
    caller_name: null,
    duration: 0,
    notes: null,
    status: "MISSED",
    created_at: "2026-03-20T13:15:00Z",
    crm_user: null,
    client: null,
    application: null,
  },
  {
    id: 3,
    phone: "+7 (999) 987-65-43",
    caller_name: "Сидоров В.К.",
    duration: 340,
    notes: "Заказал вывоз мусора",
    status: "ANSWERED",
    created_at: "2026-03-20T11:00:00Z",
    crm_user: {
      id: 2,
      first_name: "Алексей",
      last_name: "Смирнов",
      email: "smirnov@company.ru",
    },
    client: {
      id: 3,
      fio: "Сидоров Виктор Константинович",
      company_name: null,
      type: "INDIVIDUAL",
    },
    application: {
      id: 45,
      title: "Вывоз мусора",
      status: "IN_PROGRESS",
    },
  },
  {
    id: 4,
    phone: "+7 (999) 555-44-33",
    caller_name: "ООО «Вектор»",
    duration: 45,
    notes: null,
    status: "INCOMING",
    created_at: "2026-03-19T16:45:00Z",
    crm_user: {
      id: 1,
      first_name: "Елена",
      last_name: "Петрова",
      email: "petrova@company.ru",
    },
    client: {
      id: 2,
      fio: null,
      company_name: "ООО «Вектор»",
      type: "LEGAL_ENTITY",
    },
    application: null,
  },
  {
    id: 5,
    phone: "+7 (999) 111-22-33",
    caller_name: null,
    duration: 0,
    notes: "Перезвонить завтра",
    status: "MISSED",
    created_at: "2026-03-19T10:30:00Z",
    crm_user: null,
    client: null,
    application: null,
  },
];

const statusLabels: Record<string, string> = {
  MISSED: "Пропущен",
  ANSWERED: "Принят",
  INCOMING: "Входящий",
  RINGING: "Идёт разговор",
};

const statusColors: Record<string, string> = {
  MISSED: "bg-red-100 text-red-700 border-red-200",
  ANSWERED: "bg-green-100 text-green-700 border-green-200",
  INCOMING: "bg-blue-100 text-blue-700 border-blue-200",
  RINGING: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const formatDuration = (seconds?: number) => {
  if (!seconds || seconds === 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function CallsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isActionsDialogOpen, setIsActionsDialogOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<typeof mockCalls[0] | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const filteredCalls = mockCalls.filter((call) =>
    call.phone.includes(searchQuery) ||
    call.caller_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.client?.fio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.client?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFiltersCount = filters.length;

  const columns = [
    { id: "phone", title: "Телефон", dataType: "string" },
    { id: "client_info", title: "Клиент", dataType: "string" },
    { id: "crm_user", title: "Принял", dataType: "string" },
    { id: "duration", title: "Длительность", dataType: "string" },
    { id: "status", title: "Статус", dataType: "string" },
    { id: "created_at", title: "Дата звонка", dataType: "date" },
  ];

  const handleOpenNoteDialog = (call: typeof mockCalls[0]) => {
    setSelectedCall(call);
    setNoteText(call.notes || "");
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    setTimeout(() => {
      setIsSavingNote(false);
      setIsNoteDialogOpen(false);
      setSelectedCall(null);
      setNoteText("");
    }, 500);
  };

  const handleOpenActionsDialog = (call: typeof mockCalls[0]) => {
    setSelectedCall(call);
    setIsActionsDialogOpen(true);
  };

  const handleCreateClient = () => {
    if (selectedCall) {
      const params = new URLSearchParams({
        phone: selectedCall.phone.replace(/\D/g, ''),
        notes: selectedCall.notes || '',
      });
      router.push(`/dashboard/clients/create?${params.toString()}`);
      setIsActionsDialogOpen(false);
    }
  };

  const handleCreateApplication = () => {
    if (selectedCall) {
      const params = new URLSearchParams({
        phone: selectedCall.phone.replace(/\D/g, ''),
        notes: selectedCall.notes || '',
      });
      if (selectedCall.client?.id) {
        params.set('client_id', selectedCall.client.id.toString());
      }
      router.push(`/dashboard/requests/create?${params.toString()}`);
      setIsActionsDialogOpen(false);
    }
  };

  const handleConvertToClientAndApplication = () => {
    if (selectedCall) {
      const params = new URLSearchParams({
        phone: selectedCall.phone.replace(/\D/g, ''),
        notes: selectedCall.notes || '',
      });
      router.push(`/dashboard/clients/create-with-application?${params.toString()}`);
      setIsActionsDialogOpen(false);
    }
  };

  const handleGoToClient = () => {
    if (selectedCall?.client) {
      router.push(`/dashboard/clients/${selectedCall.client.id}`);
      setIsActionsDialogOpen(false);
    }
  };

  const handleGoToApplication = () => {
    if (selectedCall?.application) {
      router.push(`/dashboard/requests/${selectedCall.application.id}`);
      setIsActionsDialogOpen(false);
    }
  };

  const stats = {
    total: mockCalls.length,
    missed: mockCalls.filter((c) => c.status === "MISSED").length,
    answered: mockCalls.filter((c) => c.status === "ANSWERED").length,
    incoming: mockCalls.filter((c) => c.status === "INCOMING").length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Входящие звонки</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            История входящих звонков
          </p>
        </div>
        <Button
          size="icon-sm"
          className="bg-brand-600 text-white hover:bg-brand-700 flex-shrink-0"
          onClick={() => router.push("/dashboard/calls/create")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Phone className="h-5 w-5 text-slate-600" />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Принято</p>
                <p className="text-lg font-bold text-green-600">{stats.answered}</p>
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
                <p className="text-xs text-slate-500">Пропущено</p>
                <p className="text-lg font-bold text-red-600">{stats.missed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Входящие</p>
                <p className="text-lg font-bold text-blue-600">{stats.incoming}</p>
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
            placeholder="Поиск по телефону, клиенту..."
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
              <TableHead>Телефон</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Принял</TableHead>
              <TableHead className="text-center">Длительность</TableHead>
              <TableHead className="text-center">Статус</TableHead>
              <TableHead className="text-center">Дата звонка</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                  Звонки не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell className="font-medium text-brand-600">
                    {call.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{call.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {call.client ? (
                      <div>
                        <p className="text-sm font-medium">
                          {call.client.type === "LEGAL_ENTITY"
                            ? call.client.company_name
                            : call.client.fio}
                        </p>
                        {call.caller_name && (
                          <p className="text-xs text-slate-500">{call.caller_name}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Не определён</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {call.crm_user ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-slate-100 text-slate-700 text-xs">
                            {call.crm_user.last_name[0]}
                            {call.crm_user.first_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:block">
                          <p className="text-sm font-medium">
                            {call.crm_user.last_name} {call.crm_user.first_name}
                          </p>
                          <p className="text-xs text-slate-500">{call.crm_user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-sm">{formatDuration(call.duration)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={statusColors[call.status]}
                    >
                      {statusLabels[call.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm text-slate-500">
                    {new Date(call.created_at).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        title="Быстрые действия"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenActionsDialog(call);
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        title="Комментарий"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenNoteDialog(call);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
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

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Комментарий к звонку
            </DialogTitle>
            <DialogDescription>
              {selectedCall?.phone} — {new Date(selectedCall?.created_at || "").toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Заметка</Label>
              <Textarea
                id="note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Добавьте комментарий к звонку..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsNoteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleSaveNote}
              disabled={isSavingNote}
              className="bg-brand-600 text-white hover:bg-brand-700"
            >
              {isSavingNote ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Actions Dialog */}
      <Dialog open={isActionsDialogOpen} onOpenChange={setIsActionsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Быстрые действия</DialogTitle>
            <DialogDescription>
              {selectedCall?.phone}
              {selectedCall?.caller_name && ` — ${selectedCall.caller_name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {!selectedCall?.client ? (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleCreateClient}
                >
                  <User className="h-4 w-4 mr-2" />
                  Создать клиента
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleConvertToClientAndApplication}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Клиент + Заявка
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCreateApplication}
              >
                <FileText className="h-4 w-4 mr-2" />
                Создать заявку
              </Button>
            )}
            {selectedCall?.client && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleGoToClient}
              >
                <User className="h-4 w-4 mr-2" />
                Перейти к клиенту
              </Button>
            )}
            {selectedCall?.application && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleGoToApplication}
              >
                <FileText className="h-4 w-4 mr-2" />
                Перейти к заявке
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsActionsDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
