"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Print, Send, FileText, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockAct = {
  id: "ACT-001",
  number: "47",
  date: "2026-03-20",
  client: "ООО «Вектор»",
  clientInn: "7701234567",
  clientKpp: "770101001",
  amount: 45000,
  status: "signed",
  items: [
    { name: "Такелажные работы", quantity: 8, unit: "час", price: 5000, total: 40000 },
    { name: "Упаковочные материалы", quantity: 10, unit: "шт", price: 500, total: 5000 },
  ],
  signedDate: "2026-03-21",
};

const statusColors: Record<string, string> = {
  signed: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const statusLabels: Record<string, string> = {
  signed: "Подписан",
  pending: "Ожидает подписи",
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function ActDetailPage() {
  const params = useParams();
  const router = useRouter();

  const handleDownload = () => {
    const content = `АКТ ВЫПОЛНЕННЫХ РАБОТ №${mockAct.number} от ${mockAct.date}\n\nЗАКАЗЧИК: ${mockAct.client}\nИНН: ${mockAct.clientInn}\nКПП: ${mockAct.clientKpp}\n\nИТОГО: ${formatMoney(mockAct.amount)}\n\nДата подписания: ${mockAct.signedDate || "Не подписан"}\nСтатус: ${statusLabels[mockAct.status]}`;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `act-${mockAct.number}.txt`;
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
          <Button variant="outline" size="icon-sm" onClick={() => router.push("/dashboard/finance/acts")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Акт №{mockAct.number}</h1>
            <p className="text-xs sm:text-sm text-slate-500">от {mockAct.date}</p>
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
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Отправить
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Информация об акте</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
                <FileText className="h-6 w-6 text-brand-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Сумма работ</p>
                <p className="text-2xl font-bold">{formatMoney(mockAct.amount)}</p>
              </div>
            </div>
            <Badge variant="outline" className={statusColors[mockAct.status]}>
              {statusLabels[mockAct.status]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Заказчик
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Название</span>
            <span className="text-sm font-medium">{mockAct.client}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">ИНН</span>
            <span className="text-sm font-medium">{mockAct.clientInn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">КПП</span>
            <span className="text-sm font-medium">{mockAct.clientKpp}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Выполненные работы
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
                {mockAct.items.map((item, index) => (
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
                  <td className="text-right py-3 font-bold text-lg">{formatMoney(mockAct.amount)}</td>
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
              Дата акта
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{mockAct.date}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Дата подписания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{mockAct.signedDate || "—"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
