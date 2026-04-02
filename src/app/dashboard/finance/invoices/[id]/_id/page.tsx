"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Print, Send, FileText, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockInvoice = {
  id: "INV-001",
  number: "47",
  date: "2026-03-20",
  dueDate: "2026-04-20",
  client: "ООО «Вектор»",
  clientInn: "7701234567",
  clientKpp: "770101001",
  amount: 45000,
  status: "paid",
  items: [
    { name: "Такелажные работы", quantity: 8, unit: "час", price: 5000, total: 40000 },
    { name: "Упаковочные материалы", quantity: 10, unit: "шт", price: 500, total: 5000 },
  ],
};

const statusColors = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  draft: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusLabels = {
  paid: "Оплачен",
  pending: "Ожидает оплаты",
  overdue: "Просрочен",
  draft: "Черновик",
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();

  const handleDownload = () => {
    const content = "СЧЁТ №" + mockInvoice.number + " от " + mockInvoice.date + "\n\nКлиент: " + mockInvoice.client + "\nСумма: " + formatMoney(mockInvoice.amount) + "\nОплата до: " + mockInvoice.dueDate;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice-" + mockInvoice.number + ".txt";
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
          <Button variant="outline" size="icon-sm" onClick={() => router.push("/dashboard/finance/invoices")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Счёт №{mockInvoice.number}</h1>
            <p className="text-sm text-slate-500">от {mockInvoice.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Скачать
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Print className="h-4 w-4 mr-2" />
            Печать
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Информация о счёте</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
                <FileText className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Сумма счёта</p>
                <p className="text-2xl font-bold">{formatMoney(mockInvoice.amount)}</p>
              </div>
            </div>
            <Badge variant="outline" className={statusColors[mockInvoice.status]}>
              {statusLabels[mockInvoice.status]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Получатель
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Название</span>
            <span className="text-sm font-medium">{mockInvoice.client}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">ИНН</span>
            <span className="text-sm font-medium">{mockInvoice.clientInn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">КПП</span>
            <span className="text-sm font-medium">{mockInvoice.clientKpp}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Товары/Услуги
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Наименование</th>
                  <th className="text-center py-2 font-medium">Кол-во</th>
                  <th className="text-center py-2 font-medium">Ед.</th>
                  <th className="text-right py-2 font-medium">Цена</th>
                  <th className="text-right py-2 font-medium">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoice.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3">{item.name}</td>
                    <td className="text-center py-3">{item.quantity}</td>
                    <td className="text-center py-3">{item.unit}</td>
                    <td className="text-right py-3">{formatMoney(item.price)}</td>
                    <td className="text-right py-3 font-medium">{formatMoney(item.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-right py-3 font-semibold">ИТОГО:</td>
                  <td className="text-right py-3 font-bold text-lg">{formatMoney(mockInvoice.amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Дата выставления
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{mockInvoice.date}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Оплата до
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{mockInvoice.dueDate}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
