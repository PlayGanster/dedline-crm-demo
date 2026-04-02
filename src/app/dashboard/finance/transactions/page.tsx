"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  MoreVertical,
  FileText,
  User,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
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

const mockTransactions = [
  {
    id: "TRX-001",
    date: "2026-03-20",
    type: "income",
    amount: 45000,
    client: "ООО «Вектор»",
    description: "Оплата заявки #047",
    status: "completed",
  },
  {
    id: "TRX-002",
    date: "2026-03-19",
    type: "expense",
    amount: 15000,
    client: "Смирнов А.В.",
    description: "Выплата исполнителю",
    status: "completed",
  },
  {
    id: "TRX-003",
    date: "2026-03-18",
    type: "income",
    amount: 78000,
    client: "Иванов П.С.",
    description: "Оплата заявки #046",
    status: "pending",
  },
  {
    id: "TRX-004",
    date: "2026-03-17",
    type: "expense",
    amount: 8500,
    client: "Козлова М.И.",
    description: "Выплата исполнителю",
    status: "completed",
  },
  {
    id: "TRX-005",
    date: "2026-03-16",
    type: "income",
    amount: 32000,
    client: "ООО «Ромашка»",
    description: "Оплата заявки #045",
    status: "completed",
  },
  {
    id: "TRX-006",
    date: "2026-03-15",
    type: "expense",
    amount: 12000,
    client: "Волков Д.С.",
    description: "Выплата исполнителю",
    status: "failed",
  },
];

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  failed: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels: Record<string, string> = {
  completed: "Проведена",
  pending: "В обработке",
  failed: "Отклонена",
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function TransactionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownload = (trx: typeof mockTransactions[0]) => {
    const content = `
      ЧЕК №${trx.id}
      Дата: ${trx.date}
      Сумма: ${formatMoney(trx.amount)}
      Клиент: ${trx.client}
      Описание: ${trx.description}
      Статус: ${statusLabels[trx.status]}
    `;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `check-${trx.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredTransactions = mockTransactions.filter(
    (trx) =>
      trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalIncome = mockTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = mockTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Транзакции</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            История всех транзакций
          </p>
        </div>
        <Button size="icon-sm" className="bg-brand-600 text-white hover:bg-brand-700" onClick={() => router.push("/dashboard/finance/transactions/create")}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Доходы</p>
                <p className="text-lg font-bold text-green-600">
                  {formatMoney(totalIncome)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Расходы</p>
                <p className="text-lg font-bold text-red-600">
                  {formatMoney(totalExpense)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Баланс</p>
                <p className="text-lg font-bold">
                  {formatMoney(totalIncome - totalExpense)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                <FileText className="h-5 w-5 text-brand-600" />
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
            placeholder="Поиск по транзакциям..."
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
                <TableHead>ID</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Клиент/Исполнитель</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead className="text-center">Статус</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                    Транзакции не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((trx) => (
                  <TableRow key={trx.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-brand-600">
                      {trx.id}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(trx.date).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {trx.type === "income" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={trx.type === "income" ? "text-green-600" : "text-red-600"}>
                          {trx.type === "income" ? "Доход" : "Расход"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {trx.type === "income" ? (
                          <Building2 className="h-4 w-4 text-slate-400" />
                        ) : (
                          <User className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-sm">{trx.client}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 max-w-[200px] truncate">
                      {trx.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={trx.type === "income" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {trx.type === "income" ? "+" : "-"}{formatMoney(trx.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={statusColors[trx.status]}>
                        {statusLabels[trx.status]}
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
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/finance/transactions/id/${trx.id}`)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Детали
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(trx)}>
                            <Download className="h-4 w-4 mr-2" />
                            Скачать чек
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
