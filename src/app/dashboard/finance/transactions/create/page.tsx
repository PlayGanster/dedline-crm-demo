"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, DollarSign, Building2, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TransactionCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    client: "",
    description: "",
    paymentMethod: "Безнал",
    account: "",
    documentNumber: "",
    documentDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/finance/transactions");
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon-sm" onClick={() => router.push("/dashboard/finance/transactions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Создание транзакции</h1>
          <p className="text-xs sm:text-sm text-slate-500">Добавление новой транзакции</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Тип операции</Label>
                <Tabs
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v })}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="income">Доход</TabsTrigger>
                    <TabsTrigger value="expense">Расход</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Сумма (₽)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="45000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client" className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                Клиент / Получатель
              </Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="ООО «Вектор»"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                Описание
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Оплата заявки #047"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Способ оплаты</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Безнал">Безнал</SelectItem>
                    <SelectItem value="Нал">Нал</SelectItem>
                    <SelectItem value="Карта">Карта</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentDate" className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Дата документа
                </Label>
                <Input
                  id="documentDate"
                  type="date"
                  value={formData.documentDate}
                  onChange={(e) => setFormData({ ...formData, documentDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNumber">Номер документа</Label>
              <Input
                id="documentNumber"
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                placeholder="47"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Счёт</Label>
              <Input
                id="account"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                placeholder="40702810123456789012"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" size="sm" onClick={() => router.push("/dashboard/finance/transactions")}>
            Отмена
          </Button>
          <Button type="submit" size="sm" disabled={loading} className="bg-brand-600 text-white hover:bg-brand-700">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Создание..." : "Создать"}
          </Button>
        </div>
      </form>
    </div>
  );
}
