"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Clock,
  FileText,
  Users,
  DollarSign,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Upload,
  Download,
  Eye,
  CreditCard,
  Briefcase,
  ClipboardList,
  Files,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const mockApplication = {
  id: 47,
  title: "Переезд офиса",
  client_id: 1,
  status: "IN_PROGRESS",
  amount: "45000",
  city: "Москва",
  created_at: "2026-03-20T10:30:00Z",
  updated_at: "2026-03-21T14:00:00Z",
  manager_comment: "Клиент просит позвонить за час до начала работ",
  manager: {
    id: 1,
    first_name: "Елена",
    last_name: "Петрова",
    middle_name: "Александровна",
    email: "petrova@company.ru",
    phone: "+7 (999) 111-22-33",
  },
  supervisor: {
    id: 2,
    first_name: "Дмитрий",
    last_name: "Волков",
    middle_name: "Сергеевич",
    email: "volkov@company.ru",
    phone: "+7 (999) 222-33-44",
  },
  client: {
    id: 1,
    fio: "Иванов Петр Сергеевич",
    company_name: null,
    type: "INDIVIDUAL" as const,
    email: "ivanov@example.com",
    phone: "+7 (999) 123-45-67",
  },
};

const mockTasks = [
  {
    id: 1,
    title: "Грузчики на склад",
    service_type: "loaders",
    service_type_label: "Грузчики",
    payment_type: "cashless",
    payment_type_label: "Безнал",
    work_location: "г. Москва, ул. Ленина, д. 10",
    meeting_point: "Вход со двора",
    work_front: "Упаковка и погрузка офисной мебели",
    quantity: 4,
    start_date: "2026-03-25",
    time_from: "09:00",
    time_to: "18:00",
    rate: 500,
    payment_unit: "hour",
    customer_price: 18000,
    hours: 8,
    status: "IN_PROGRESS" as const,
    comment: "Нужны ремни для переноски",
    supervisor: {
      name: "Волков Дмитрий Сергеевич",
      phone: "+7 (999) 222-33-44",
    },
  },
  {
    id: 2,
    title: "Офисный переезд под ключ",
    service_type: "office_move",
    service_type_label: "Офисный переезд",
    payment_type: "cashless",
    payment_type_label: "Безнал",
    work_location: "г. Москва, пр. Мира, д. 25",
    meeting_point: "Пропуск на входе, обратиться к охраннику",
    work_front: "Разгрузка и расстановка мебели",
    quantity: 4,
    start_date: "2026-03-25",
    time_from: "12:00",
    time_to: "20:00",
    rate: 600,
    payment_unit: "hour",
    customer_price: 19200,
    hours: 8,
    status: "IN_PROGRESS" as const,
    comment: "",
    supervisor: {
      name: "Петрова Елена Александровна",
      phone: "+7 (999) 111-22-33",
    },
  },
];

const mockPerformers = [
  {
    id: 1,
    performer: {
      id: 1,
      first_name: "Алексей",
      last_name: "Смирнов",
      middle_name: "Владимирович",
      phone: "+7 (999) 111-22-33",
      email: "smirnov@example.com",
      city: "Москва",
      is_verified: true,
      is_active: true,
      professions: [{ id: 1, name: "Грузчик" }],
    },
    task_id: 1,
    task_title: "Грузчики на склад",
  },
  {
    id: 2,
    performer: {
      id: 2,
      first_name: "Мария",
      last_name: "Козлова",
      middle_name: "Ивановна",
      phone: "+7 (999) 222-33-44",
      email: "kozlova@example.com",
      city: "Москва",
      is_verified: true,
      is_active: true,
      professions: [{ id: 2, name: "Упаковщик" }],
    },
    task_id: 1,
    task_title: "Грузчики на склад",
  },
  {
    id: 3,
    performer: {
      id: 3,
      first_name: "Дмитрий",
      last_name: "Волков",
      middle_name: "Сергеевич",
      phone: "+7 (999) 333-44-55",
      email: "volkov@example.com",
      city: "Москва",
      is_verified: false,
      is_active: true,
      professions: [{ id: 1, name: "Грузчик" }],
    },
    task_id: 2,
    task_title: "Офисный переезд под ключ",
  },
];

const availablePerformers = [
  {
    id: 10,
    first_name: "Иван",
    last_name: "Петров",
    middle_name: "Сергеевич",
    phone: "+7 (999) 444-55-66",
    email: "petrov@example.com",
    city: "Москва",
    is_verified: true,
    is_active: true,
    professions: [{ id: 1, name: "Грузчик" }],
  },
  {
    id: 11,
    first_name: "Елена",
    last_name: "Соколова",
    middle_name: "Александровна",
    phone: "+7 (999) 555-66-77",
    email: "sokolova@example.com",
    city: "Санкт-Петербург",
    is_verified: true,
    is_active: true,
    professions: [{ id: 2, name: "Упаковщик" }],
  },
  {
    id: 12,
    first_name: "Андрей",
    last_name: "Морозов",
    middle_name: "Дмитриевич",
    phone: "+7 (999) 666-77-88",
    email: "morozov@example.com",
    city: "Москва",
    is_verified: false,
    is_active: true,
    professions: [{ id: 1, name: "Грузчик" }, { id: 3, name: "Разнорабочий" }],
  },
  {
    id: 13,
    first_name: "Ольга",
    last_name: "Новикова",
    middle_name: "Ивановна",
    phone: "+7 (999) 777-88-99",
    email: "novikova@example.com",
    city: "Казань",
    is_verified: true,
    is_active: true,
    professions: [{ id: 4, name: "Клинер" }],
  },
  {
    id: 14,
    first_name: "Сергей",
    last_name: "Лебедев",
    middle_name: "Андреевич",
    phone: "+7 (999) 888-99-00",
    email: "lebedev@example.com",
    city: "Москва",
    is_verified: true,
    is_active: true,
    professions: [{ id: 5, name: "Водитель" }],
  },
];

const mockShifts = [
  {
    id: 1,
    performer_id: 1,
    performer_name: "Смирнов А.В.",
    task_id: 1,
    date: "2026-03-25",
    hours: 8,
    amount: 4000,
    receipt_file: "receipt_001.jpg",
  },
  {
    id: 2,
    performer_id: 2,
    performer_name: "Козлова М.И.",
    task_id: 1,
    date: "2026-03-25",
    hours: 8,
    amount: 3500,
    receipt_file: null,
  },
];

const mockDocuments = [
  {
    id: 1,
    filename: "dogovor.pdf",
    original_name: "Договор оказания услуг.pdf",
    is_verified: true,
    created_at: "2026-03-20T11:00:00Z",
    type: "document",
    description: "Договор на оказание услуг",
    size: "2.4 MB",
  },
  {
    id: 2,
    filename: "schet.pdf",
    original_name: "Счет на оплату.pdf",
    is_verified: true,
    created_at: "2026-03-20T11:05:00Z",
    type: "document",
    description: "Счет на оплату №47 от 20.03.2026",
    size: "156 KB",
  },
];

export default function ApplicationProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("info");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [managerComment, setManagerComment] = useState(mockApplication.manager_comment);
  const [taskStatuses, setTaskStatuses] = useState<Record<number, string>>(
    Object.fromEntries(mockTasks.map(t => [t.id, t.status]))
  );
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<typeof mockTasks[0] | null>(null);
  const taskRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [isAddPerformerDialogOpen, setIsAddPerformerDialogOpen] = useState(false);
  const [addPerformerStep, setAddPerformerStep] = useState<1 | 2>(1);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [performerSearch, setPerformerSearch] = useState("");
  const [performerCityFilter, setPerformerCityFilter] = useState("");
  const [performerProfessionFilter, setPerformerProfessionFilter] = useState("");
  const [isAddShiftDialogOpen, setIsAddShiftDialogOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState({
    performer_id: 0,
    date: new Date().toISOString().split("T")[0],
    hours: 8,
    amount: 0,
    receipt: null as File | null,
  });
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [isUploadReceiptDialogOpen, setIsUploadReceiptDialogOpen] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploadDocumentDialogOpen, setIsUploadDocumentDialogOpen] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentDescription, setDocumentDescription] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    service_type: "loaders",
    work_front: "",
    comment: "",
    work_location: "",
    meeting_point: "",
    start_date: "",
    time_from: "09:00",
    time_to: "18:00",
    time_comment: "",
    quantity: 1,
    supervisor_type: "client",
    supervisor_name: "",
    supervisor_phone: "",
    payment_type: "cashless",
    hours: 8,
    rate: 0,
    customer_price: 0,
  });

  const application = mockApplication;
  const tasks = mockTasks;
  const performers = mockPerformers;
  const shifts = mockShifts;
  const documents = mockDocuments;

  const totalAmount = parseFloat(application.amount);
  const totalPaid = shifts.reduce((sum, s) => sum + s.amount, 0);
  const budgetRemaining = totalAmount - totalPaid;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      router.push("/dashboard/requests");
    }, 1000);
  };

  const handleSaveComment = () => {
    alert("Комментарий сохранён");
  };

  const handleToggleTaskStatus = (taskId: number, status: string) => {
    setTaskStatuses(prev => ({ ...prev, [taskId]: status }));
  };

  const handleTaskClick = (taskId: number) => {
    setActiveTab("tasks");
    setExpandedTaskId(taskId);
    setTimeout(() => {
      taskRefs.current[taskId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleOpenAddPerformerDialog = () => {
    setAddPerformerStep(1);
    setSelectedTaskId(null);
    setPerformerSearch("");
    setPerformerCityFilter("");
    setPerformerProfessionFilter("");
    setIsAddPerformerDialogOpen(true);
  };

  const handleSelectTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setAddPerformerStep(2);
  };

  const handleAddPerformer = (performerId: number) => {
    setIsAddPerformerDialogOpen(false);
    setAddPerformerStep(1);
    setSelectedTaskId(null);
  };

  const handleOpenAddShiftDialog = () => {
    setShiftForm({
      performer_id: 0,
      date: new Date().toISOString().split("T")[0],
      hours: 8,
      amount: 0,
      receipt: null,
    });
    setIsAddShiftDialogOpen(true);
  };

  const handleOpenUploadReceiptDialog = (shiftId: number) => {
    setSelectedShiftId(shiftId);
    setReceiptFile(null);
    setIsUploadReceiptDialogOpen(true);
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleUploadReceipt = () => {
    setUploadingReceipt(true);
    setTimeout(() => {
      setUploadingReceipt(false);
      setIsUploadReceiptDialogOpen(false);
      setReceiptFile(null);
      setSelectedShiftId(null);
    }, 1000);
  };

  const handleOpenUploadDocumentDialog = () => {
    setDocumentFile(null);
    setDocumentDescription("");
    setIsUploadDocumentDialogOpen(true);
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const handleUploadDocument = () => {
    setUploadingReceipt(true);
    setTimeout(() => {
      setUploadingReceipt(false);
      setIsUploadDocumentDialogOpen(false);
      setDocumentFile(null);
      setDocumentDescription("");
    }, 1000);
  };

  const getPerformerRate = (performerId: number) => {
    const performer = performers.find(p => p.performer.id === performerId);
    if (!performer || !performer.task_id) return 0;
    const task = tasks.find(t => t.id === performer.task_id);
    return task?.rate || 0;
  };

  const handleShiftPerformerChange = (performerId: number) => {
    const rate = getPerformerRate(performerId);
    setShiftForm({
      performer_id: performerId,
      date: new Date().toISOString().split("T")[0],
      hours: 8,
      amount: rate * 8,
    });
  };

  const handleShiftHoursChange = (hours: number) => {
    const rate = getPerformerRate(shiftForm.performer_id);
    const validHours = isNaN(hours) || hours < 0 ? 0 : hours;
    setShiftForm({
      ...shiftForm,
      hours: validHours,
      amount: rate * validHours,
    });
  };

  const handleAddShift = () => {
    setIsAddShiftDialogOpen(false);
  };

  const filteredPerformers = availablePerformers.filter((p) => {
    const matchesSearch = p.last_name.toLowerCase().includes(performerSearch.toLowerCase()) ||
      p.first_name.toLowerCase().includes(performerSearch.toLowerCase());
    const matchesCity = !performerCityFilter || performerCityFilter === "all" || p.city === performerCityFilter;
    const matchesProfession = !performerProfessionFilter || performerProfessionFilter === "all" ||
      p.professions.some((prof) => prof.name === performerProfessionFilter);
    return matchesSearch && matchesCity && matchesProfession;
  });

  const cities = [...new Set(availablePerformers.map((p) => p.city))];
  const professions = [...new Set(availablePerformers.flatMap((p) => p.professions.map((prof) => prof.name)))];

  const handleOpenTaskDialog = (task?: typeof mockTasks[0]) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title || "",
        service_type: task.service_type,
        work_front: task.work_front,
        comment: task.comment || "",
        work_location: task.work_location,
        meeting_point: task.meeting_point,
        start_date: task.start_date,
        time_from: task.time_from,
        time_to: task.time_to,
        time_comment: "",
        quantity: task.quantity,
        supervisor_type: "client",
        supervisor_name: task.supervisor?.name || "",
        supervisor_phone: task.supervisor?.phone || "",
        payment_type: "cashless",
        hours: task.hours,
        rate: task.rate,
        customer_price: task.customer_price,
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: "",
        service_type: "loaders",
        work_front: "",
        comment: "",
        work_location: "",
        meeting_point: "",
        start_date: new Date().toISOString().split("T")[0],
        time_from: "09:00",
        time_to: "18:00",
        time_comment: "",
        quantity: 1,
        supervisor_type: "client",
        supervisor_name: "",
        supervisor_phone: "",
        payment_type: "cashless",
        hours: 8,
        rate: 0,
        customer_price: 0,
      });
    }
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = () => {
    setIsTaskDialogOpen(false);
    setEditingTask(null);
  };

  const updateTaskForm = (field: string, value: any) => {
    setTaskForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <TooltipProvider>
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => router.push("/dashboard/requests")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Заявка №{application.id}</h1>
            <p className="text-sm text-slate-500">{application.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => router.push(`/dashboard/requests/${id}/edit`)}
          >
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

      {/* Main Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{application.title}</h2>
                <Badge variant="outline" className={statusColors[application.status]}>
                  {statusLabels[application.status]}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{application.city}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Бюджет</p>
                <p className="text-lg font-bold">{totalAmount.toLocaleString("ru-RU")} ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Выплачено</p>
                <p className="text-lg font-bold text-green-600">{totalPaid.toLocaleString("ru-RU")} ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Остаток</p>
                <p className="text-lg font-bold text-purple-600">{budgetRemaining.toLocaleString("ru-RU")} ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Исполнители</p>
                <p className="text-lg font-bold">{performers.length} чел.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-11">
          <TabsTrigger value="info" className="text-sm">
            <ClipboardList className="h-4 w-4 mr-2" />
            Информация
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-sm">
            <Briefcase className="h-4 w-4 mr-2" />
            Задачи ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="performers" className="text-sm">
            <Users className="h-4 w-4 mr-2" />
            Исполнители
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Выплаты
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-sm">
            <Files className="h-4 w-4 mr-2" />
            Документы
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Team Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Команда
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Manager */}
                <div className="p-3 rounded-lg border bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                        {application.manager.last_name[0]}
                        {application.manager.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {application.manager.last_name} {application.manager.first_name}{" "}
                        {application.manager.middle_name}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-0.5 h-5">
                        Менеджер
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Supervisor */}
                <div className="p-3 rounded-lg border bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold text-sm">
                        {application.supervisor.last_name[0]}
                        {application.supervisor.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {application.supervisor.last_name} {application.supervisor.first_name}{" "}
                        {application.supervisor.middle_name}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-0.5 h-5">
                        Управляющий
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Клиент
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-brand-100 text-brand-700 font-semibold">
                      {application.client.fio?.[0] || application.client.company_name?.[0] || "К"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {application.client.type === "INDIVIDUAL"
                        ? application.client.fio
                        : application.client.company_name}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {application.client.type === "INDIVIDUAL" ? "Физ. лицо" : "Юр. лицо"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>{application.client.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <span>{application.client.phone || "—"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Детали заявки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="text-sm text-slate-500">Создана</span>
                  <span className="text-sm font-medium">
                    {new Date(application.created_at).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                  <span className="text-sm text-slate-500">Обновлена</span>
                  <span className="text-sm font-medium">
                    {new Date(application.updated_at).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comment Card */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Комментарий менеджера
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={managerComment}
                onChange={(e) => setManagerComment(e.target.value)}
                placeholder="Введите комментарий..."
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSaveComment}>
                  Сохранить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Задачи
                </span>
                <Button size="sm" onClick={() => handleOpenTaskDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  ref={(el) => (taskRefs.current[task.id] = el)}
                  className="rounded-lg border overflow-hidden"
                >
                  {/* Task Header - Always Visible */}
                  <div
                    className="p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={
                              taskStatuses[task.id] === "COMPLETED"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : taskStatuses[task.id] === "CANCELLED"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-blue-100 text-blue-700 border-blue-200"
                            }
                          >
                            {taskStatuses[task.id] === "COMPLETED" ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Выполнено
                              </>
                            ) : taskStatuses[task.id] === "CANCELLED" ? (
                              <>
                                <X className="h-3 w-3 mr-1" />
                                Отменено
                              </>
                            ) : (
                              <>
                                <Circle className="h-3 w-3 mr-1" />
                                В работе
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.service_type_label}
                          </Badge>
                        </div>
                        <p className="font-semibold mb-1">{task.title}</p>
                        <p className="text-sm text-slate-600">{task.work_front}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
                          }}
                        >
                          {expandedTaskId === task.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="flex items-center gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon-sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleToggleTaskStatus(task.id, "IN_PROGRESS")}>
                                <Circle className="h-4 w-4 mr-2" />
                                В работе
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleTaskStatus(task.id, "COMPLETED")}>
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                Выполнено
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleTaskStatus(task.id, "CANCELLED")}>
                                <X className="h-4 w-4 mr-2 text-red-600" />
                                Отменено
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button size="icon-sm" variant="outline" onClick={(e) => {
                            e.stopPropagation();
                            handleOpenTaskDialog(task);
                          }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon-sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task Details - Expandable */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
                      expandedTaskId === task.id
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 p-4 border-t">
                      {/* Location Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="p-2 rounded bg-slate-50">
                          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                            <MapPin className="h-3 w-3" />
                            Место работы
                          </div>
                          <p className="text-sm font-medium">{task.work_location}</p>
                        </div>
                        <div className="p-2 rounded bg-slate-50">
                          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                            <Users className="h-3 w-3" />
                            Место сбора
                          </div>
                          <p className="text-sm font-medium">{task.meeting_point}</p>
                        </div>
                      </div>
                      
                      {/* Supervisor */}
                      {task.supervisor && (
                        <div className="p-2 rounded bg-blue-50 mb-3">
                          <div className="flex items-center gap-1 text-xs text-blue-600 mb-1">
                            <User className="h-3 w-3" />
                            Ответственное лицо
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{task.supervisor.name}</p>
                            <div className="flex items-center gap-1 text-xs text-blue-600">
                              <Phone className="h-3 w-3" />
                              <span>{task.supervisor.phone}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Financial Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="p-2 rounded bg-slate-50">
                          <p className="text-xs text-slate-500">Дата</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.start_date).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                        <div className="p-2 rounded bg-slate-50">
                          <p className="text-xs text-slate-500">Время</p>
                          <p className="font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.time_from} - {task.time_to}
                          </p>
                        </div>
                        <div className="p-2 rounded bg-slate-50">
                          <p className="text-xs text-slate-500">Ставка</p>
                          <p className="font-medium">{task.rate} ₽/{task.payment_unit === "hour" ? "час" : "смена"}</p>
                        </div>
                        <div className="p-2 rounded bg-brand-50 border border-brand-200">
                          <p className="text-xs text-brand-600">Цена для заказчика</p>
                          <p className="font-bold text-brand-700">{task.customer_price.toLocaleString("ru-RU")} ₽/{task.payment_unit === "hour" ? "час" : "смена"}</p>
                        </div>
                      </div>
                      {task.comment && (
                        <div className="mt-3 p-2 rounded bg-slate-50 text-sm text-slate-600">
                          <strong>Примечание:</strong> {task.comment}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performers Tab */}
        <TabsContent value="performers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Исполнители
                </span>
                <Button size="sm" onClick={handleOpenAddPerformerDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {performers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-brand-100 text-brand-700 font-semibold">
                        {p.performer.last_name[0]}
                        {p.performer.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {p.performer.last_name} {p.performer.first_name}{" "}
                        {p.performer.middle_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{p.performer.professions?.[0]?.name || "—"}</span>
                        {p.performer.is_verified && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-3 w-3" />
                              Проверен
                            </span>
                          </>
                        )}
                      </div>
                      {p.task_id && (
                        <div
                          className="flex items-center gap-1 mt-1 text-xs cursor-pointer hover:text-brand-700 transition-colors"
                          onClick={() => handleTaskClick(p.task_id)}
                        >
                          <Briefcase className="h-3 w-3 text-brand-600" />
                          <span className="text-brand-600 font-medium">
                            {p.task_title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon-sm" variant="outline" title="Просмотр">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon-sm" variant="outline" title="Email">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="icon-sm" variant="outline" title="Телефон">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-4">
          <div className="space-y-4">
            {/* Performers Shifts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Выплаты исполнителям</span>
                  <Button size="sm" onClick={handleOpenAddShiftDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить смену
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performers.length === 0 ? (
                  <p className="text-center text-slate-500 py-4">Нет прикреплённых исполнителей</p>
                ) : (
                  performers.map((p) => {
                    const performerShifts = shifts.filter(s => s.performer_id === p.performer.id);
                    const totalPerformer = performerShifts.reduce((sum, s) => sum + s.amount, 0);
                    
                    return (
                      <div key={p.performer.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-brand-100 text-brand-700 font-semibold text-sm">
                                {p.performer.last_name[0]}{p.performer.first_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{p.performer.last_name} {p.performer.first_name}</p>
                              <p className="text-sm text-slate-500">{p.performer.phone}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Выплачено</p>
                            <p className="text-lg font-bold text-green-600">{totalPerformer.toLocaleString("ru-RU")} ₽</p>
                          </div>
                        </div>

                        {performerShifts.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Смены:</p>
                            {performerShifts.map((shift) => (
                              <div key={shift.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-sm">{new Date(shift.date).toLocaleDateString("ru-RU")}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-slate-400" />
                                    <span className="text-sm">{shift.hours} ч.</span>
                                  </div>
                                  {shift.task_id && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs cursor-pointer hover:bg-brand-50"
                                      onClick={() => handleTaskClick(shift.task_id)}
                                    >
                                      <Briefcase size={12} className="mr-1" />
                                      Задача #{shift.task_id}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-sm">{shift.amount.toLocaleString("ru-RU")} ₽</span>
                                  {shift.receipt_file ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-100 text-green-700 border-green-200 cursor-pointer hover:bg-green-200"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // View receipt
                                      }}
                                    >
                                      <CheckCircle2 size={12} className="mr-1" />
                                      Чек загружен
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-yellow-100 text-yellow-700 border-yellow-200 cursor-pointer hover:bg-yellow-200"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenUploadReceiptDialog(shift.id);
                                      }}
                                    >
                                      <Upload size={12} className="mr-1" />
                                      Загрузить чек
                                    </Badge>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8"
                                  >
                                    <Trash2 size={14} className="mr-1" />
                                    Удалить
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Документы
                </span>
                <Button size="sm" onClick={handleOpenUploadDocumentDialog}>
                  <Upload className="h-4 w-4 mr-2" />
                  Загрузить
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-700 font-medium">
                    Документы не загружены
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Загрузите документы заявки
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        doc.is_verified
                          ? "border-green-200 bg-green-50/50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                              doc.is_verified
                                ? "bg-green-100"
                                : "bg-slate-100"
                            }`}
                          >
                            <FileText
                              className={`h-6 w-6 ${
                                doc.is_verified
                                  ? "text-green-600"
                                  : "text-slate-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-900">
                                {doc.original_name}
                              </span>
                              {doc.is_verified ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-700 border-green-200"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Проверен
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-700 border-yellow-200"
                                >
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Не проверен
                                </Badge>
                              )}
                            </div>
                            {doc.description && (
                              <p className="text-sm text-slate-600 mb-1">{doc.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="font-mono">{doc.size}</span>
                              <span>•</span>
                              <span>
                                {new Date(doc.created_at).toLocaleDateString(
                                  "ru-RU",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          {!doc.is_verified && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="outline"
                                  className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                >
                                  <CheckCircle size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Проверить</TooltipContent>
                            </Tooltip>
                          )}
                          {doc.is_verified && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="outline"
                                  className="h-9 w-9 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                                >
                                  <AlertCircle size={16} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Снять проверку</TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="outline"
                                className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                              >
                                <Upload size={16} className="rotate-180" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Скачать</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                variant="outline"
                                className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Удалить</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Удалить заявку?
            </DialogTitle>
            <DialogDescription>
              Вы уверены что хотите удалить &quot;{application.title}&quot;? Это действие
              нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto content-scroll">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Редактировать задачу" : "Добавить задачу"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Название вакансии */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Название вакансии</Label>
              <Input
                value={taskForm.title}
                onChange={(e) => updateTaskForm("title", e.target.value)}
                placeholder="Например: Грузчик на склад"
                className="font-medium"
              />
            </div>

            {/* 1. Что делаем? */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Briefcase className="h-4 w-4" />
                <span>Что делаем</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Тип услуги</Label>
                  <Select
                    value={taskForm.service_type}
                    onValueChange={(v) => updateTaskForm("service_type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loaders">Грузчики</SelectItem>
                      <SelectItem value="laborers">Разнорабочие</SelectItem>
                      <SelectItem value="waste_removal">Вывоз мусора</SelectItem>
                      <SelectItem value="dismantling">Демонтажные работы</SelectItem>
                      <SelectItem value="rigging">Такелажные работы</SelectItem>
                      <SelectItem value="special_equipment">Спецтехника</SelectItem>
                      <SelectItem value="office_move">Офисный переезд</SelectItem>
                      <SelectItem value="apartment_move">Квартирный переезд</SelectItem>
                      <SelectItem value="cleaning">Уборка и клининг</SelectItem>
                      <SelectItem value="cargo_transportation">Грузовые перевозки</SelectItem>
                      <SelectItem value="transport">Транспорт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Фронт работ</Label>
                  <Textarea
                    value={taskForm.work_front}
                    onChange={(e) => updateTaskForm("work_front", e.target.value)}
                    placeholder="Объём работ"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Комментарий к задаче</Label>
                  <Textarea
                    value={taskForm.comment}
                    onChange={(e) => updateTaskForm("comment", e.target.value)}
                    placeholder="Детали задачи, особые указания..."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* 2. Где делаем? */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <MapPin className="h-4 w-4" />
                <span>Где делаем</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Место проведения работ</Label>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-slate-400" />
                    <Input
                      value={taskForm.work_location}
                      onChange={(e) => updateTaskForm("work_location", e.target.value)}
                      placeholder="Адрес объекта"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Место сбора</Label>
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    <Input
                      value={taskForm.meeting_point}
                      onChange={(e) => updateTaskForm("meeting_point", e.target.value)}
                      placeholder="Где встречают"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Когда делаем? */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>Когда делаем</span>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Дата начала</Label>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <Input
                        type="date"
                        value={taskForm.start_date}
                        onChange={(e) => updateTaskForm("start_date", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Время от</Label>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <Input
                        type="time"
                        value={taskForm.time_from}
                        onChange={(e) => updateTaskForm("time_from", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Время до</Label>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <Input
                        type="time"
                        value={taskForm.time_to}
                        onChange={(e) => updateTaskForm("time_to", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Комментарий ко времени</Label>
                  <Textarea
                    value={taskForm.time_comment}
                    onChange={(e) => updateTaskForm("time_comment", e.target.value)}
                    placeholder="Например: перерыв 1 час, гибкое начало..."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* 4. Количество исполнителей */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Users className="h-4 w-4" />
                <span>Количество исполнителей</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Кол-во исполнителей</Label>
                  <Input
                    type="number"
                    min="1"
                    value={taskForm.quantity}
                    onChange={(e) => updateTaskForm("quantity", parseInt(e.target.value))}
                    className="font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* 5. Ответственное лицо */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <User className="h-4 w-4" />
                <span>Ответственное лицо</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Тип ответственного</Label>
                  <Select
                    value={taskForm.supervisor_type}
                    onValueChange={(v) => updateTaskForm("supervisor_type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Клиент</SelectItem>
                      <SelectItem value="other">Иное лицо</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {taskForm.supervisor_type === "client" ? (
                  <div className="p-3 rounded-lg bg-slate-50 border">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-brand-100 text-brand-700 font-semibold text-sm">
                          {application.client.fio?.[0] || "К"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {application.client.type === "INDIVIDUAL"
                            ? application.client.fio
                            : application.client.company_name}
                        </p>
                        <Badge variant="secondary" className="text-xs h-5">
                          {application.client.type === "INDIVIDUAL" ? "Физ. лицо" : "Юр. лицо"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="h-3 w-3" />
                      <span>{application.client.phone || "—"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">ФИО</Label>
                      <Input
                        value={taskForm.supervisor_name}
                        onChange={(e) => updateTaskForm("supervisor_name", e.target.value)}
                        placeholder="Иванов Иван Иванович"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Телефон</Label>
                      <Input
                        value={taskForm.supervisor_phone}
                        onChange={(e) => updateTaskForm("supervisor_phone", e.target.value)}
                        placeholder="+7 (999) 000-00-00"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Оплата */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <DollarSign className="h-4 w-4" />
                <span>Оплата</span>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Тип оплаты</Label>
                  <Select
                    value={taskForm.payment_type}
                    onValueChange={(v) => updateTaskForm("payment_type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cashless">Безнал</SelectItem>
                      <SelectItem value="vat">НДС</SelectItem>
                      <SelectItem value="card">На карту</SelectItem>
                      <SelectItem value="cash">На руки</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Количество часов</Label>
                  <Input
                    type="number"
                    value={taskForm.hours}
                    onChange={(e) => updateTaskForm("hours", parseInt(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Ставка для исполнителя (₽/час)</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-slate-400" />
                      <Input
                        type="number"
                        value={taskForm.rate}
                        onChange={(e) => updateTaskForm("rate", parseFloat(e.target.value))}
                        className="font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Цена для заказчика (₽/час)</Label>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-slate-400" />
                      <Input
                        type="number"
                        value={taskForm.customer_price}
                        onChange={(e) => updateTaskForm("customer_price", parseFloat(e.target.value))}
                        className="font-semibold"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Валовая маржинальность (₽)</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-green-600" />
                    <Input
                      type="number"
                      value={taskForm.customer_price - taskForm.rate}
                      disabled
                      className="font-semibold text-green-600 bg-green-50"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {taskForm.customer_price} - {taskForm.rate} = {taskForm.customer_price - taskForm.rate} ₽/час
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsTaskDialogOpen(false)}>
              Отмена
            </Button>
            <Button size="sm" onClick={handleSaveTask}>
              {editingTask ? "Сохранить" : "Добавить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Performer Dialog */}
      <Dialog open={isAddPerformerDialogOpen} onOpenChange={setIsAddPerformerDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto content-scroll">
          <DialogHeader>
            <DialogTitle>Добавить исполнителя</DialogTitle>
            <DialogDescription>
              Шаг {addPerformerStep} из 2
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Выбор задачи */}
          {addPerformerStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Выберите задачу</Label>
                <div className="grid gap-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedTaskId === task.id
                          ? "border-brand-500 bg-brand-50"
                          : "hover:bg-slate-50"
                      }`}
                      onClick={() => handleSelectTask(task.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-sm text-slate-500">{task.work_front}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            taskStatuses[task.id] === "COMPLETED"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }
                        >
                          {taskStatuses[task.id] === "COMPLETED" ? "Выполнено" : "В работе"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Выбор исполнителя */}
          {addPerformerStep === 2 && (
            <div className="space-y-4 py-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Поиск</Label>
                  <Input
                    placeholder="ФИО..."
                    value={performerSearch}
                    onChange={(e) => setPerformerSearch(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Город</Label>
                  <Select value={performerCityFilter} onValueChange={setPerformerCityFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Все города" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все города</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Профессия</Label>
                  <Select value={performerProfessionFilter} onValueChange={setPerformerProfessionFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Все профессии" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все профессии</SelectItem>
                      {professions.map((prof) => (
                        <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Performers List */}
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {filteredPerformers.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      Исполнители не найдены
                    </div>
                  ) : (
                    filteredPerformers.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-brand-100 text-brand-700 font-semibold text-sm">
                              {p.last_name[0]}{p.first_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {p.last_name} {p.first_name} {p.middle_name}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{p.professions[0]?.name || "—"}</span>
                              <span>•</span>
                              <span>{p.city}</span>
                              {p.is_verified && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600">Проверен</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddPerformer(p.id)}
                          className="bg-brand-600 text-white hover:bg-brand-700"
                        >
                          Добавить
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {addPerformerStep === 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddPerformerStep(1)}
              >
                Назад
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddPerformerDialogOpen(false)}
            >
              Отмена
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Shift Dialog */}
      <Dialog open={isAddShiftDialogOpen} onOpenChange={setIsAddShiftDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Добавить смену</DialogTitle>
            <DialogDescription>
              Добавьте информацию о выплате исполнителю
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Исполнитель</Label>
              <Select
                value={shiftForm.performer_id.toString()}
                onValueChange={(v) => handleShiftPerformerChange(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите исполнителя" />
                </SelectTrigger>
                <SelectContent>
                  {performers.map((p) => {
                    const rate = getPerformerRate(p.performer.id);
                    return (
                      <SelectItem key={p.performer.id} value={p.performer.id.toString()}>
                        {p.performer.last_name} {p.performer.first_name} ({rate} ₽/час)
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Дата</Label>
              <Input
                type="date"
                value={shiftForm.date}
                onChange={(e) => setShiftForm({ ...shiftForm, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Часов</Label>
                <Input
                  type="number"
                  min="0"
                  value={shiftForm.hours}
                  onChange={(e) => handleShiftHoursChange(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Сумма (₽)</Label>
                <Input
                  type="number"
                  value={shiftForm.amount}
                  onChange={(e) => setShiftForm({ ...shiftForm, amount: parseInt(e.target.value) })}
                  className="bg-slate-50"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Чек (необязательно)</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  shiftForm.receipt ? "border-brand-500 bg-brand-50" : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  id="shift-receipt-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setShiftForm({ ...shiftForm, receipt: file || null });
                  }}
                />
                <label htmlFor="shift-receipt-upload" className="cursor-pointer">
                  {shiftForm.receipt ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-brand-600" />
                      <p className="text-sm font-medium text-brand-700">{shiftForm.receipt.name}</p>
                      <p className="text-xs text-slate-500">{(shiftForm.receipt.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6 text-slate-400" />
                      <p className="text-sm font-medium text-slate-700">Прикрепить чек</p>
                      <p className="text-xs text-slate-500">JPG, PNG, PDF</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            {shiftForm.performer_id > 0 && (
              <div className="p-3 rounded-lg bg-slate-50 text-sm">
                <p className="text-slate-500">
                  Ставка: <span className="font-medium text-slate-700">{getPerformerRate(shiftForm.performer_id)} ₽/час</span>
                </p>
                <p className="text-slate-500">
                  Расчёт: <span className="font-medium text-slate-700">{getPerformerRate(shiftForm.performer_id)} × {shiftForm.hours || 0} = {(getPerformerRate(shiftForm.performer_id) * (shiftForm.hours || 0)).toLocaleString("ru-RU")} ₽</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddShiftDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleAddShift}
              className="bg-brand-600 text-white hover:bg-brand-700"
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Receipt Dialog */}
      <Dialog open={isUploadReceiptDialogOpen} onOpenChange={setIsUploadReceiptDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Загрузить чек</DialogTitle>
            <DialogDescription>
              Загрузите фотографию или PDF чка за смену
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Файл</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  receiptFile ? "border-brand-500 bg-brand-50" : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  id="receipt-upload"
                  className="hidden"
                  onChange={handleReceiptFileChange}
                />
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  {receiptFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="h-8 w-8 text-brand-600" />
                      <p className="text-sm font-medium text-brand-700">{receiptFile.name}</p>
                      <p className="text-xs text-slate-500">{(receiptFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-slate-400" />
                      <p className="text-sm font-medium text-slate-700">Нажмите для загрузки</p>
                      <p className="text-xs text-slate-500">JPG, PNG, PDF (макс. 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUploadReceiptDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleUploadReceipt}
              disabled={!receiptFile || uploadingReceipt}
              className="bg-brand-600 text-white hover:bg-brand-700"
            >
              {uploadingReceipt ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Загрузить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDocumentDialogOpen} onOpenChange={setIsUploadDocumentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Загрузить документ</DialogTitle>
            <DialogDescription>
              Загрузите документ заявки
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Файл</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  documentFile ? "border-brand-500 bg-brand-50" : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  id="document-upload"
                  className="hidden"
                  onChange={handleDocumentFileChange}
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  {documentFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="h-8 w-8 text-brand-600" />
                      <p className="text-sm font-medium text-brand-700">{documentFile.name}</p>
                      <p className="text-xs text-slate-500">{(documentFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-slate-400" />
                      <p className="text-sm font-medium text-slate-700">Нажмите для загрузки</p>
                      <p className="text-xs text-slate-500">JPG, PNG, PDF, DOC, DOCX</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-description">Описание</Label>
              <Textarea
                id="document-description"
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                placeholder="Описание документа..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUploadDocumentDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleUploadDocument}
              disabled={!documentFile || uploadingReceipt}
              className="bg-brand-600 text-white hover:bg-brand-700"
            >
              {uploadingReceipt ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Загрузить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}
