"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Circle,
  User,
  Calendar,
  Hash,
  Briefcase,
  CreditCard,
  Smartphone,
  MapPin,
  ShieldCheck,
  ShieldX,
  FileBadge,
  Star,
  Plus,
  Building2,
  Upload,
  X,
  File,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mockPerformer = {
  id: 1,
  last_name: "Смирнов",
  first_name: "Алексей",
  middle_name: "Владимирович",
  email: "smirnov@example.com",
  phone: "+7 (999) 111-22-33",
  city: "Москва",
  source: "APP",
  is_verified: true,
  is_active: true,
  professions: [{ name: "Грузчик" }, { name: "Водитель" }],
  rating: 4.8,
  orders_count: 24,
  snils: "123-456-789 00",
  inn: "770123456789",
  passport_series: "1234",
  passport_number: "567890",
  passport_issued_by: "МВД России",
  passport_issued_date: "2020-01-15",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2026-03-20T14:45:00Z",
};

const mockRequisites = [
  {
    id: 1,
    type: "CARD" as const,
    name: "Основная карта",
    is_default: true,
    card_number: "4276 3800 1234 5678",
    card_holder: "ALEKSEY SMIRNOV",
    bank_name: "Сбербанк",
  },
  {
    id: 2,
    type: "SBP" as const,
    name: "СБП",
    is_default: false,
    sbp_phone: "+7 (999) 111-22-33",
  },
  {
    id: 3,
    type: "REQUISITES" as const,
    name: "Расчетный счет",
    is_default: false,
    inn: "770123456789",
    ogrnip: "304770000000000",
    account_number: "40802810000000000000",
    bik: "044525225",
    bank_name_full: "ПАО Сбербанк",
    correspondent_account: "30101810400000000225",
  },
];

const mockNotes = [
  {
    id: 1,
    text: "Ответственный исполнитель, всегда выполняет работу в срок. Рекомендую для сложных задач.",
    created_at: "2026-03-15T10:30:00Z",
    created_by: "Александр М.",
  },
  {
    id: 2,
    text: "Предпочитает работу в утренние часы. После 18:00 старается не назначать.",
    created_at: "2026-03-10T14:20:00Z",
    created_by: "Елена К.",
  },
  {
    id: 3,
    text: "Есть свой автомобиль Газель. Может помочь с транспортировкой грузов.",
    created_at: "2026-03-05T09:15:00Z",
    created_by: "Дмитрий В.",
  },
  {
    id: 4,
    text: "Хорошо ладит с клиентами. Получил несколько положительных отзывов за прошлый месяц.",
    created_at: "2026-02-28T16:45:00Z",
    created_by: "Александр М.",
  },
  {
    id: 5,
    text: "Прошёл проверку службы безопасности. Все документы в порядке.",
    created_at: "2026-02-20T11:00:00Z",
    created_by: "Ольга С.",
  },
  {
    id: 6,
    text: "Брал отпуск с 10 по 20 февраля. На этот период не назначать новые заявки.",
    created_at: "2026-02-05T13:30:00Z",
    created_by: "Елена К.",
  },
];

const mockDocuments = [
  {
    id: 1,
    name: "Паспорт.pdf",
    type: "passport",
    size: "2.4 MB",
    uploaded_at: "2026-03-01T10:00:00Z",
    is_verified: true,
    description: "Скан паспорта (все страницы)",
  },
  {
    id: 2,
    name: "ИНН.pdf",
    type: "inn",
    size: "156 KB",
    uploaded_at: "2026-03-01T10:05:00Z",
    is_verified: true,
    description: "Свидетельство ИНН",
  },
  {
    id: 3,
    name: "СНИЛС.pdf",
    type: "snils",
    size: "98 KB",
    uploaded_at: "2026-03-02T14:30:00Z",
    is_verified: false,
    description: "",
  },
];

const mockRequests = [
  {
    id: "#047",
    title: "Переезд офиса",
    task: "Погрузка мебели",
    date: "20.03.2026",
    time: "14:30",
    status: "completed",
    amount: "5 000 ₽",
  },
  {
    id: "#046",
    title: "Складской комплекс",
    task: "Такелажные работы",
    date: "18.03.2026",
    time: "10:00",
    status: "in_progress",
    amount: "8 000 ₽",
  },
  {
    id: "#045",
    title: "Доставка контейнера",
    task: "Разгрузка контейнера",
    date: "15.03.2026",
    time: "16:45",
    status: "completed",
    amount: "12 000 ₽",
  },
  {
    id: "#044",
    title: "Ремонт квартиры",
    task: "Демонтаж старой мебели",
    date: "12.03.2026",
    time: "09:00",
    status: "completed",
    amount: "3 500 ₽",
  },
  {
    id: "#043",
    title: "Переезд квартиры",
    task: "Упаковка вещей",
    date: "10.03.2026",
    time: "11:30",
    status: "pending",
    amount: "2 000 ₽",
  },
];

const typeLabels: Record<string, string> = {
  CARD: "Карта",
  SBP: "СБП",
  REQUISITES: "Реквизиты",
};

const typeIcons: Record<string, any> = {
  CARD: CreditCard,
  SBP: Smartphone,
  REQUISITES: Building2,
};

const requestStatusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  in_progress: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const requestStatusLabels: Record<string, string> = {
  completed: "Выполнено",
  in_progress: "В работе",
  pending: "Ожидает",
  cancelled: "Отменено",
};

export default function PerformerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("requisites");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVerified, setIsVerified] = useState(mockPerformer.is_verified);
  const [requisites, setRequisites] = useState(mockRequisites);
  const [isRequisiteDialogOpen, setIsRequisiteDialogOpen] = useState(false);
  const [requisiteType, setRequisiteType] = useState<"CARD" | "SBP" | "REQUISITES">("REQUISITES");
  const [newRequisite, setNewRequisite] = useState<any>({});
  const [notes, setNotes] = useState(mockNotes);
  const [newNote, setNewNote] = useState("");
  const [documents, setDocuments] = useState(mockDocuments);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadDocumentFile, setUploadDocumentFile] = useState<File | null>(null);
  const [uploadDocumentDescription, setUploadDocumentDescription] = useState("");
  const [requests] = useState(mockRequests);

  const handleVerifyDocument = (docId: number) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === docId ? { ...doc, is_verified: !doc.is_verified } : doc
      )
    );
  };

  const handleDownloadDocument = (docId: number) => {
    // Mock download
    console.log("Downloading document:", docId);
  };

  const performer = { ...mockPerformer, is_verified: isVerified };

  const handleVerify = () => setIsVerified(true);
  const handleUnverify = () => setIsVerified(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      router.push("/dashboard/performers");
    }, 1000);
  };

  const handleAddRequisite = () => {
    // Mock adding requisite
    setIsRequisiteDialogOpen(false);
    setRequisiteType("REQUISITES");
    setNewRequisite({});
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes([
      {
        id: Date.now(),
        text: newNote,
        created_at: new Date().toISOString(),
        created_by: "Администратор",
      },
      ...notes,
    ]);
    setNewNote("");
  };

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter((n) => n.id !== noteId));
  };

  const handleUploadDocument = () => {
    if (uploadDocumentFile) {
      setDocuments([
        ...documents,
        {
          id: Date.now(),
          name: uploadDocumentFile.name,
          type: "other",
          size: `${(uploadDocumentFile.size / 1024).toFixed(1)} KB`,
          uploaded_at: new Date().toISOString(),
          is_verified: false,
          description: uploadDocumentDescription,
        },
      ]);
    }
    setIsUploadDialogOpen(false);
    setUploadDocumentFile(null);
    setUploadDocumentDescription("");
  };

  const handleDeleteDocument = (docId: number) => {
    setDocuments(documents.filter((d) => d.id !== docId));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop
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
            onClick={() => router.push("/dashboard/performers")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Исполнитель</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {performer.last_name} {performer.first_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isVerified ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnverify}
              className="hidden sm:inline-flex"
            >
              <ShieldX className="h-4 w-4 mr-2" />
              Снять проверку
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleVerify}
              className="hidden sm:inline-flex bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Проверить
            </Button>
          )}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => router.push(`/dashboard/performers/${id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-3xl bg-brand-100 text-brand-700 font-semibold dark:bg-brand-900 dark:text-brand-300">
                  {performer.last_name[0]}
                  {performer.first_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 text-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500" />
                <span className="font-semibold">{performer.rating}</span>
                <span className="text-slate-500 text-sm dark:text-slate-400">
                  ({performer.orders_count} заказов)
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4">
              {/* Name and Status */}
              <div>
                <h2 className="text-2xl font-bold">
                  {performer.last_name} {performer.first_name}{" "}
                  {performer.middle_name}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">
                    {performer.professions?.map((p: any) => p.name).join(", ")}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    isVerified
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900"
                      : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  }
                >
                  {isVerified ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <Circle className="h-3 w-3 mr-1" />
                  )}
                  {isVerified ? "Проверен" : "Не проверен"}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    performer.is_active
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900"
                      : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900"
                  }
                >
                  {performer.is_active ? "Активен" : "Не активен"}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Smartphone className="h-3 w-3 mr-1" />
                  {performer.source === "APP" ? "Приложение" : "CRM"}
                </Badge>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                    <p className="text-sm font-medium truncate">
                      {performer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950">
                    <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Телефон</p>
                    <p className="text-sm font-medium">{performer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950">
                    <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Город</p>
                    <p className="text-sm font-medium">{performer.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Hash className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">ID</p>
                    <p className="text-sm font-medium">#{performer.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-11">
          <TabsTrigger value="requisites" className="text-sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Реквизиты
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-sm">
            <FileBadge className="h-4 w-4 mr-2" />
            Документы
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-sm">
            <FileText className="h-4 w-4 mr-2" />
            Заметки
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-sm">
            <Clock className="h-4 w-4 mr-2" />
            Заявки
          </TabsTrigger>
          <TabsTrigger value="info" className="text-sm">
            <User className="h-4 w-4 mr-2" />
            Информация
          </TabsTrigger>
        </TabsList>

        {/* Requisites Tab */}
        <TabsContent value="requisites" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Реквизиты</h3>
            <Button size="sm" onClick={() => setIsRequisiteDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Добавить
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              {requisites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <CreditCard className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-700 font-medium dark:text-slate-300">
                    Реквизиты не добавлены
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Добавьте реквизиты для выплат исполнителю
                  </p>
                </div>
              ) : (
                <Tabs defaultValue={requisites[0]?.type} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    {(["CARD", "SBP", "REQUISITES"] as const).map((type) => {
                      const Icon = typeIcons[type];
                      const count = requisites.filter((r) => r.type === type)
                        .length;
                      return (
                        <TabsTrigger
                          key={type}
                          value={type}
                          className="flex items-center gap-2"
                        >
                          <Icon size={16} />
                          {typeLabels[type]} ({count})
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {(["CARD", "SBP", "REQUISITES"] as const).map((type) => (
                    <TabsContent key={type} value={type} className="space-y-2 mt-4">
                      {requisites
                        .filter((r) => r.type === type)
                        .map((req) => (
                          <div
                            key={req.id}
                            className={`p-4 rounded-lg border ${
                              req.is_default
                                ? "border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-950"
                                : "bg-white dark:bg-card"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {req.is_default && (
                                  <Star
                                    size={16}
                                    className="text-brand-600 fill-brand-600 dark:text-brand-400 dark:fill-brand-400"
                                  />
                                )}
                                <span className="font-medium">
                                  {req.name || typeLabels[type]}
                                </span>
                                {req.is_default && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                                  >
                                    По умолчанию
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button size="icon-sm" variant="ghost">
                                  <Pencil size={16} />
                                </Button>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>

                            {type === "CARD" && (
                              <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                                {req.card_number && (
                                  <p>Номер карты: {req.card_number}</p>
                                )}
                                {req.card_holder && (
                                  <p>Владелец: {req.card_holder}</p>
                                )}
                                {req.bank_name && (
                                  <p>Банк: {req.bank_name}</p>
                                )}
                              </div>
                            )}

                            {type === "SBP" && (
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {req.sbp_phone && (
                                  <p>Телефон: {req.sbp_phone}</p>
                                )}
                              </div>
                            )}

                            {type === "REQUISITES" && (
                              <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                                {req.inn && <p>ИНН: {req.inn}</p>}
                                {req.ogrnip && <p>ОГРНИП: {req.ogrnip}</p>}
                                {req.account_number && (
                                  <p>Р/с: {req.account_number}</p>
                                )}
                                {req.bik && <p>БИК: {req.bik}</p>}
                                {req.bank_name_full && (
                                  <p>Банк: {req.bank_name_full}</p>
                                )}
                                {req.correspondent_account && (
                                  <p>К/с: {req.correspondent_account}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Документы</h3>
            <Button
              size="sm"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Загрузить
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <FileBadge className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-700 font-medium dark:text-slate-300">
                    Документы не загружены
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Загрузите документы исполнителя
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        doc.is_verified
                          ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50"
                          : "border-slate-200 bg-white dark:bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                              doc.is_verified
                                ? "bg-green-100 dark:bg-green-900"
                                : "bg-slate-100 dark:bg-slate-800"
                            }`}
                          >
                            <File
                              className={`h-6 w-6 ${
                                doc.is_verified
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-slate-600 dark:text-slate-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {doc.name}
                              </span>
                              {doc.is_verified ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Проверен
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800"
                                >
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Не проверен
                                </Badge>
                              )}
                            </div>
                            {doc.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{doc.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-mono">{doc.size}</span>
                              <span>•</span>
                              <span>
                                {new Date(doc.uploaded_at).toLocaleDateString(
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
                                  className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 dark:text-green-400 dark:hover:bg-green-950 dark:border-green-800"
                                  onClick={() => handleVerifyDocument(doc.id)}
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
                                  className="h-9 w-9 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:hover:bg-yellow-950 dark:border-yellow-800"
                                  onClick={() => handleVerifyDocument(doc.id)}
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
                                className="h-9 w-9 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:bg-blue-950 dark:border-blue-800"
                                onClick={() => handleDownloadDocument(doc.id)}
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
                                className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:bg-red-950 dark:border-red-800"
                                onClick={() => handleDeleteDocument(doc.id)}
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

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Заметки</h3>
            <Badge variant="secondary" className="h-7">
              {notes.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Notes List - 2/3 */}
            <Card className="lg:col-span-2">
              <CardContent className="pt-6 p-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {notes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900 dark:to-brand-950 mb-4">
                          <FileText className="h-10 w-10 text-brand-600 dark:text-brand-400" />
                        </div>
                        <p className="text-slate-700 font-semibold dark:text-slate-300">
                          Заметок пока нет
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
                          Добавьте первую заметку об исполнителе, чтобы зафиксировать важную информацию
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="group p-4 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all dark:border-slate-700 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                {note.text}
                              </p>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-all h-8 w-8 shrink-0 hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 dark:from-brand-400 dark:to-brand-500 flex items-center justify-center text-white dark:text-slate-100 text-xs font-medium shadow-sm">
                                  {note.created_by.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  {note.created_by}
                                </span>
                              </div>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {new Date(note.created_at).toLocaleDateString(
                                    "ru-RU",
                                    {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Add Note Form - 1/3 */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="note-text" className="text-sm font-medium">
                      Текст заметки
                    </Label>
                    <Textarea
                      id="note-text"
                      placeholder="Напишите что-нибудь полезное..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[280px] resize-none text-sm leading-relaxed"
                    />
                  </div>
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Заявки исполнителя</h3>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="divide-y">
                {requests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                      <Clock className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-slate-700 font-medium dark:text-slate-300">
                      Нет заявок
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      У исполнителя пока нет заявок
                    </p>
                  </div>
                ) : (
                  requests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-brand-600 dark:text-brand-400 shrink-0">
                          {req.id}
                        </span>
                        <Badge
                          className={requestStatusColors[req.status]}
                          variant="outline"
                        >
                          {requestStatusLabels[req.status]}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">
                            {req.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {req.task}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {req.date} {req.time}
                        </span>
                        <span className="text-sm font-medium">{req.amount}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Информация</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Passport Data */}
            {performer.passport_series && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileBadge className="h-5 w-5" />
                    Паспортные данные
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Серия</span>
                    <span className="text-sm font-semibold font-mono">
                      {performer.passport_series}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Номер</span>
                    <span className="text-sm font-semibold font-mono">
                      {performer.passport_number}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Meta Info */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Мета-информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    ID исполнителя
                  </span>
                  <span className="text-sm font-semibold font-mono">
                    #{performer.id}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Создан</span>
                  <span className="text-sm font-medium">
                    {new Date(performer.created_at).toLocaleDateString(
                      "ru-RU",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Обновлен</span>
                  <span className="text-sm font-medium">
                    {new Date(performer.updated_at).toLocaleDateString(
                      "ru-RU",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Requisite Dialog */}
      <Dialog open={isRequisiteDialogOpen} onOpenChange={setIsRequisiteDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Добавить реквизиты</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Выберите тип реквизитов и заполните данные
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-foreground">Тип реквизитов</Label>
              <RadioGroup
                value={requisiteType}
                onValueChange={(v) =>
                  setRequisiteType(v as "CARD" | "SBP" | "REQUISITES")
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CARD" id="card" className="dark:border-slate-600" />
                  <Label
                    htmlFor="card"
                    className="flex items-center gap-2 cursor-pointer text-foreground"
                  >
                    <CreditCard size={16} />
                    Карта
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SBP" id="sbp" className="dark:border-slate-600" />
                  <Label
                    htmlFor="sbp"
                    className="flex items-center gap-2 cursor-pointer text-foreground"
                  >
                    <Smartphone size={16} />
                    СБП
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="REQUISITES" id="requisites" className="dark:border-slate-600" />
                  <Label
                    htmlFor="requisites"
                    className="flex items-center gap-2 cursor-pointer text-foreground"
                  >
                    <Building2 size={16} />
                    Реквизиты
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {requisiteType === "CARD" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="card-name" className="text-foreground">Название</Label>
                  <Input
                    id="card-name"
                    placeholder="Основная карта"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-number" className="text-foreground">Номер карты</Label>
                  <Input
                    id="card-number"
                    placeholder="0000 0000 0000 0000"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-holder" className="text-foreground">Владелец карты</Label>
                  <Input
                    id="card-holder"
                    placeholder="IVAN IVANOV"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-bank" className="text-foreground">Название банка</Label>
                  <Input
                    id="card-bank"
                    placeholder="Сбербанк"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                  />
                </div>
              </>
            )}

            {requisiteType === "SBP" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sbp-name" className="text-foreground">Название</Label>
                  <Input
                    id="sbp-name"
                    placeholder="СБП"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sbp-phone" className="text-foreground">Номер телефона</Label>
                  <Input
                    id="sbp-phone"
                    placeholder="+7 (999) 000-00-00"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                  />
                </div>
              </>
            )}

            {requisiteType === "REQUISITES" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="req-name" className="text-foreground">Название</Label>
                  <Input
                    id="req-name"
                    placeholder="Расчетный счет"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="req-inn" className="text-foreground">ИНН</Label>
                    <Input
                      id="req-inn"
                      placeholder="7701234567"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="req-ogrnip" className="text-foreground">ОГРНИП</Label>
                    <Input
                      id="req-ogrnip"
                      placeholder="304770000000000"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="req-account" className="text-foreground">Расчетный счет</Label>
                    <Input
                      id="req-account"
                      placeholder="40802810000000000000"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="req-bik" className="text-foreground">БИК</Label>
                    <Input
                      id="req-bik"
                      placeholder="044525225"
                      className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-bank-full" className="text-foreground">Название банка</Label>
                  <Input
                    id="req-bank-full"
                    placeholder="ПАО Сбербанк"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-correspondent" className="text-foreground">Корр. счет</Label>
                  <Input
                    id="req-correspondent"
                    placeholder="30101810400000000225"
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsRequisiteDialogOpen(false);
                setRequisiteType("REQUISITES");
              }}
              className="dark:border-slate-700 dark:text-foreground"
            >
              Отмена
            </Button>
            <Button onClick={handleAddRequisite} className="bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600">
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Загрузить документ</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Загрузите документ исполнителя
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Файл</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  uploadDocumentFile ? "border-brand-500 bg-brand-50 dark:border-brand-700 dark:bg-brand-950" : "border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  id="performer-document-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setUploadDocumentFile(file || null);
                  }}
                />
                <label htmlFor="performer-document-upload" className="cursor-pointer">
                  {uploadDocumentFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                      <p className="text-sm font-medium text-brand-700 dark:text-brand-300">{uploadDocumentFile.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{(uploadDocumentFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Нажмите для загрузки</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG, PDF, DOC, DOCX</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-description" className="text-foreground">Описание</Label>
              <Textarea
                id="document-description"
                value={uploadDocumentDescription}
                onChange={(e) => setUploadDocumentDescription(e.target.value)}
                placeholder="Описание документа..."
                rows={3}
                className="dark:bg-slate-800 dark:border-slate-700 dark:text-foreground"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsUploadDialogOpen(false)} className="dark:border-slate-700 dark:text-foreground">
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleUploadDocument}
              disabled={!uploadDocumentFile}
              className="bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              Загрузить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-white dark:bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              Удалить исполнителя?
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Вы уверены что хотите удалить {performer.last_name}{" "}
              {performer.first_name}? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
              className="dark:border-slate-700 dark:text-foreground"
            >
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}
