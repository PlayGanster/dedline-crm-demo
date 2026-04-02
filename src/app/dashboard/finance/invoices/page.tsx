"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  MoreVertical,
  FileText,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockInvoices = [
  {
    id: "INV-001",
    number: "47",
    date: "2026-03-20",
    dueDate: "2026-04-20",
    client: "ООО «Вектор»",
    amount: 45000,
    status: "paid",
  },
  {
    id: "INV-002",
    number: "46",
    date: "2026-03-18",
    dueDate: "2026-04-18",
    client: "Иванов П.С.",
    amount: 78000,
    status: "pending",
  },
  {
    id: "INV-003",
    number: "45",
    date: "2026-03-15",
    dueDate: "2026-04-15",
    client: "ООО «Ромашка»",
    amount: 32000,
    status: "paid",
  },
  {
    id: "INV-004",
    number: "44",
    date: "2026-03-12",
    dueDate: "2026-04-12",
    client: "Сидоров В.К.",
    amount: 15000,
    status: "overdue",
  },
  {
    id: "INV-005",
    number: "43",
    date: "2026-03-10",
    dueDate: "2026-04-10",
    client: "Кузнецова Е.П.",
    amount: 12000,
    status: "draft",
  },
];

const statusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  draft: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusLabels: Record<string, string> = {
  paid: "Оплачен",
  pending: "Ожидает оплаты",
  overdue: "Просрочен",
  draft: "Черновик",
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function InvoicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownload = (inv: typeof mockInvoices[0]) => {
    const content = `
      СЧЁТ НА ОПЛАТУ №${inv.number} от ${inv.date}
      Клиент: ${inv.client}
      Сумма: ${formatMoney(inv.amount)}
      Оплата до: ${inv.dueDate}
      Статус: ${statusLabels[inv.status]}
    `;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `schet-${inv.number}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredInvoices = mockInvoices.filter(
    (inv) =>
      inv.number.includes(searchQuery) ||
      inv.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockInvoices.length,
    paid: mockInvoices.filter((i) => i.status === "paid").length,
    pending: mockInvoices.filter((i) => i.status === "pending").length,
    overdue: mockInvoices.filter((i) => i.status === "overdue").length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Счета</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Выставленные счета на оплату
          </p>
        </div>
        <Button size="icon-sm" className="bg-brand-600 text-white hover:bg-brand-700" onClick={() => router.push("/dashboard/finance/invoices/create")}>
          <Plus className="h-4 w-4" />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Оплачено</p>
                <p className="text-lg font-bold text-green-600">{stats.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Ожидает</p>
                <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
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
                <p className="text-xs text-slate-500">Просрочено</p>
                <p className="text-lg font-bold text-red-600">{stats.overdue}</p>
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
            placeholder="Поиск по номеру или клиенту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Фильтры</span>
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Экспорт</span>
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Оплата до</TableHead>
                <TableHead className="text-center">Статус</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    Счета не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-brand-600">
                      #{inv.number}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(inv.date).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{inv.client}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatMoney(inv.amount)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(inv.dueDate).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={statusColors[inv.status]}>
                        {statusLabels[inv.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/finance/invoices/id/${inv.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Просмотр
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Отправить
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(inv)}>
                            <Download className="h-4 w-4 mr-2" />
                            Скачать PDF
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
    </div>
  );
}
