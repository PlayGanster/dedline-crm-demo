"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  ArrowUpRight,
  Building2,
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

const mockIncome = [
  {
    id: "INC-001",
    date: "2026-03-20",
    amount: 45000,
    client: "ООО «Вектор»",
    description: "Оплата заявки #047",
    paymentMethod: "Безнал",
    status: "completed",
  },
  {
    id: "INC-002",
    date: "2026-03-18",
    amount: 78000,
    client: "Иванов П.С.",
    description: "Оплата заявки #046",
    paymentMethod: "Нал",
    status: "pending",
  },
  {
    id: "INC-003",
    date: "2026-03-15",
    amount: 32000,
    client: "ООО «Ромашка»",
    description: "Оплата заявки #045",
    paymentMethod: "Безнал",
    status: "completed",
  },
  {
    id: "INC-004",
    date: "2026-03-12",
    amount: 15000,
    client: "Сидоров В.К.",
    description: "Оплата заявки #044",
    paymentMethod: "Нал",
    status: "completed",
  },
  {
    id: "INC-005",
    date: "2026-03-10",
    amount: 12000,
    client: "Кузнецова Е.П.",
    description: "Оплата заявки #043",
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

export default function IncomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleDownload = () => {
    const content = `
      ОТЧЁТ ПО ДОХОДАМ
      Дата формирования: ${new Date().toLocaleDateString("ru-RU")}
      
      ${mockIncome.map(item => `
      ID: ${item.id}
      Дата: ${item.date}
      Клиент: ${item.client}
      Сумма: ${formatMoney(item.amount)}
      Описание: ${item.description}
      Статус: ${statusLabels[item.status]}
      ---`).join("\n")}
      
      ИТОГО: ${formatMoney(totalIncome)}
    `;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `income-report-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredIncome = mockIncome.filter(
    (item) =>
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalIncome = mockIncome.reduce((sum, item) => sum + item.amount, 0);
  const pendingIncome = mockIncome
    .filter((i) => i.status === "pending")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Доходы</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Все поступления средств
          </p>
        </div>
        <Button size="icon-sm" className="bg-brand-600 text-white hover:bg-brand-700" onClick={() => router.push("/dashboard/finance/income/create")}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Всего доходов</p>
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
                <p className="text-xs text-slate-500">Проведено</p>
                <p className="text-lg font-bold">
                  {formatMoney(totalIncome - pendingIncome)}
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
                  {formatMoney(pendingIncome)}
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
            placeholder="Поиск по клиенту или описанию..."
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
                <TableHead>Клиент</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Способ оплаты</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead className="text-center">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncome.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    Доходы не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredIncome.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-brand-600">
                      {item.id}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(item.date).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{item.client}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 max-w-[200px] truncate">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-medium">
                        +{formatMoney(item.amount)}
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
