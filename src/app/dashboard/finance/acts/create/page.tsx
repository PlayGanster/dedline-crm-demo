"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, DollarSign, Building2, FileText, Calendar, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export default function ActCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    clientInn: "",
    clientKpp: "",
    actDate: new Date().toISOString().split("T")[0],
    items: [{ name: "", quantity: 1, unit: "шт", price: 0 }] as ActItem[],
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, unit: "шт", price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: keyof ActItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const total = formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/finance/acts");
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon-sm" onClick={() => router.push("/dashboard/finance/acts")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Создание акта</h1>
          <p className="text-xs sm:text-sm text-slate-500">Акт выполненных работ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Реквизиты заказчика</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client" className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                Заказчик
              </Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="ООО «Вектор»"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientInn">ИНН</Label>
                <Input
                  id="clientInn"
                  value={formData.clientInn}
                  onChange={(e) => setFormData({ ...formData, clientInn: e.target.value })}
                  placeholder="7701234567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientKpp">КПП</Label>
                <Input
                  id="clientKpp"
                  value={formData.clientKpp}
                  onChange={(e) => setFormData({ ...formData, clientKpp: e.target.value })}
                  placeholder="770101001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actDate" className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Дата акта
                </Label>
                <Input
                  id="actDate"
                  type="date"
                  value={formData.actDate}
                  onChange={(e) => setFormData({ ...formData, actDate: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Выполненные работы
              </span>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-4 space-y-2">
                  <Label className="text-xs">Наименование</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="Такелажные работы"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-xs">Кол-во</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-xs">Ед.</Label>
                  <Select
                    value={item.unit}
                    onValueChange={(v) => updateItem(index, "unit", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="шт">шт</SelectItem>
                      <SelectItem value="час">час</SelectItem>
                      <SelectItem value="услуга">услуга</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 space-y-2">
                  <Label className="text-xs">Цена (₽)</Label>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <span className="text-sm text-slate-500 mr-4">Итого:</span>
                <span className="text-lg font-bold">{total.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" size="sm" onClick={() => router.push("/dashboard/finance/acts")}>
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
