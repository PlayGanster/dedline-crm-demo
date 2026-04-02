"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Send, FileText, Building2, Calendar, DollarSign, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockTransaction = {
  id: "TRX-001",
  date: "2026-03-20",
  type: "income",
  amount: 45000,
  client: "ООО «Вектор»",
  clientInn: "7701234567",
  description: "Оплата заявки #047",
  status: "completed",
  paymentMethod: "Безнал",
  account: "40702810123456789012",
  documentNumber: "47",
  documentDate: "2026-03-20",
};

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

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const handleDownload = () => {
    const content = `ТРАНЗАКЦИЯ №${mockTransaction.id}\n\nДата: ${mockTransaction.date}\nСумма: ${formatMoney(mockTransaction.amount)}\nКлиент: ${mockTransaction.client}\nИНН: ${mockTransaction.clientInn}\nОписание: ${mockTransaction.description}\nСтатус: ${statusLabels[mockTransaction.status]}\n\nСчёт: ${mockTransaction.account}\nДокумент №${mockTransaction.documentNumber} от ${mockTransaction.documentDate}`;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transaction-${mockTransaction.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => router.push("/dashboard/finance/transactions")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Транзакция {mockTransaction.id}</h1>
            <p className="text-xs sm:text-sm text-slate-500">{mockTransaction.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Скачать
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Печать
          </Button>
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Отправить
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Информация о транзакции</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                mockTransaction.type === "income" ? "bg-green-50" : "bg-red-50"
              }`}>
                <DollarSign className={`h-6 w-6 ${
                  mockTransaction.type === "income" ? "text-green-600" : "text-red-600"
                }`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{mockTransaction.type === "income" ? "Доход" : "Расход"}</p>
                <p className="text-2xl font-bold">{mockTransaction.type === "income" ? "+" : "-"}{formatMoney(mockTransaction.amount)}</p>
              </div>
            </div>
            <Badge variant="outline" className={statusColors[mockTransaction.status]}>
              {statusLabels[mockTransaction.status]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Контрагент
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Название</span>
              <span className="text-sm font-medium">{mockTransaction.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">ИНН</span>
              <span className="text-sm font-medium">{mockTransaction.clientInn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Счёт</span>
              <span className="text-sm font-medium font-mono">{mockTransaction.account}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Документ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Номер</span>
              <span className="text-sm font-medium">№{mockTransaction.documentNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Дата</span>
              <span className="text-sm font-medium">{mockTransaction.documentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Способ оплаты</span>
              <Badge variant="outline">{mockTransaction.paymentMethod}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Описание
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{mockTransaction.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
