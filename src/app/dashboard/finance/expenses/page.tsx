"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  ArrowDownRight,
  User,
  FileText,
  CheckCircle2,
  Clock,
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

const mockExpenses = [
  {
    id: "EXP-001",
    date: "2026-03-19",
    amount: 15000,
    recipient: "Смирнов А.В.",
    description: "Выплата исполнителю (заявка #047)",
    paymentMethod: "Нал",
    status: "completed",
  },
  {
    id: "EXP-002",
    date: "2026-03-17",
    amount: 8500,
    recipient: "Козлова М.И.",
    description: "Выплата исполнителю (заявка #046)",
    paymentMethod: "Нал",
    status: "completed",
  },
  {
    id: "EXP-003",
    date: "2026-03-15",
    amount: 12000,
    recipient: "Волков Д.С.",
    description: "Выплата исполнителю (заявка #045)",
    paymentMethod: "Безнал",
    status: "pending",
  },
  {
    id: "EXP-004",
    date: "2026-03-12",
    amount: 6000,
    recipient: "Петрова Е.А.",
    description: "Выплата исполнителю (заявка #044)",
    paymentMethod: "Нал",
    status: "completed",
  },
  {
    id: "EXP-005",
    date: "2026-03-10",
    amount: 4500,
    recipient: "Новикова О.С.",
    description: "Выплата исполнителю (заявка #043)",
    paymentMethod: "Нал",
    status: "completed",
  },
];

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const statusLabels: Record<string, string> = {
  completed: "Проведено",
  pending: "В обработке",
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownload = () => {
    const content = `
      ОТЧЁТ ПО РАСХОДАМ
      Дата формирования: ${new Date().toLocaleDateString("ru-RU")}
      
      ${mockExpenses.map(item => `
      ID: ${item.id}
      Дата: ${item.date}
      Получатель: ${item.recipient}
      Сумма: ${formatMoney(item.amount)}
      Описание: ${item.description}
      Статус: ${statusLabels[item.status]}
      ---`).join("\n")}
      
      ИТОГО: ${formatMoney(totalExpenses)}
    `;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expenses-report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredExpenses = mockExpenses.filter(
    (item) =>
      item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalExpenses = mockExpenses.reduce((sum, item) => sum + item.amount, 0);
  const pendingExpenses = mockExpenses
    .filter((i) => i.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Расходы</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Все выплаты и расходы
          </p>
        </div>
        <Button size="icon-sm" className="bg-brand-600 text-white hover:bg-brand-700" onClick={() => router.push("/dashboard/finance/expenses/create")}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Всего расходов</p>
                <p className="text-lg font-bold text-red-600">
                  {formatMoney(totalExpenses)}
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
                <p className="text-xs text-slate-500">Проведено</p>
                <p className="text-lg font-bold">
                  {formatMoney(totalExpenses - pendingExpenses)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
                <CheckCircle2 className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">В обработке</p>
                <p className="text-lg font-bold text-yellow-600">
                  {formatMoney(pendingExpenses)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                <Clock className="h-5 w-5 text-yellow-600" />
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
            placeholder="Поиск по получателю или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Фильтры</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
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
                <TableHead>Получатель</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Способ оплаты</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead className="text-center">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    Расходы не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-brand-600">
                      {item.id}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(item.date).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{item.recipient}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 max-w-[250px] truncate">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-red-600 font-medium">
                        -{formatMoney(item.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={statusColors[item.status]}>
                        {statusLabels[item.status]}
                      </Badge>
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
