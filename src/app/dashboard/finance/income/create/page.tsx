"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, DollarSign, Building2, FileText, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IncomeCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    client: "",
    description: "",
    paymentMethod: "Безнал",
    incomeDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/finance/income");
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon-sm" onClick={() => router.push("/dashboard/finance/income")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Добавление дохода</h1>
          <p className="text-xs sm:text-sm text-slate-500">Новое поступление средств</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              Информация о доходе
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="incomeDate" className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Дата поступления
                </Label>
                <Input
                  id="incomeDate"
                  type="date"
                  value={formData.incomeDate}
                  onChange={(e) => setFormData({ ...formData, incomeDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client" className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                Клиент
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
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" size="sm" onClick={() => router.push("/dashboard/finance/income")}>
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
