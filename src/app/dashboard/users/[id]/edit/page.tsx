"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, User, Mail, Phone, Shield } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const roles = [
  { value: "MANAGER", label: "Менеджер" },
  { value: "HEAD_OF_MANAGERS", label: "Управляющий" },
  { value: "DIRECTOR", label: "Директор" },
];

const mockUser = {
  id: 1,
  first_name: "Елена",
  last_name: "Петрова",
  email: "petrova@company.ru",
  phone: "+7 (999) 111-22-33",
  role: "MANAGER",
  is_active: true,
  managerPercent: 10,
};

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: mockUser.first_name,
    last_name: mockUser.last_name,
    email: mockUser.email,
    phone: mockUser.phone,
    role: mockUser.role,
    is_active: mockUser.is_active,
    secretCode: "123456",
    managerPercent: mockUser.managerPercent?.toString() || "",
    supervisorPercent: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/users/${params.id}`);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => router.push(`/dashboard/users/${params.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Редактирование</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {mockUser.last_name} {mockUser.first_name}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Основная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last_name">Фамилия</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  placeholder="Иванов"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name">Имя</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder="Иван"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@company.ru"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  Телефон
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+7 (999) 000-00-00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                Роль
              </Label>
              <Select
                value={formData.role}
                onValueChange={(v) =>
                  setFormData({ ...formData, role: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.role === "MANAGER" && (
              <div className="space-y-2">
                <Label htmlFor="managerPercent">Процент менеджера (%)</Label>
                <Input
                  id="managerPercent"
                  type="number"
                  value={formData.managerPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, managerPercent: e.target.value })
                  }
                  placeholder="10"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-slate-500">
                  Процент от сделки
                </p>
              </div>
            )}

            {formData.role === "HEAD_OF_MANAGERS" && (
              <div className="space-y-2">
                <Label htmlFor="supervisorPercent">Процент управляющего (%)</Label>
                <Input
                  id="supervisorPercent"
                  type="number"
                  value={formData.supervisorPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, supervisorPercent: e.target.value })
                  }
                  placeholder="5"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-slate-500">
                  Процент от сделки
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="secretCode">Секретный код</Label>
              <Input
                id="secretCode"
                type="text"
                value={formData.secretCode}
                onChange={(e) =>
                  setFormData({ ...formData, secretCode: e.target.value })
                }
                placeholder="123456"
                maxLength={6}
              />
              <p className="text-xs text-slate-500">
                6-значный код для доступа к системе
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="text-base">Активен</Label>
                <p className="text-sm text-slate-500">
                  Пользователь может войти в систему
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, is_active: v })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/users/${params.id}`)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="bg-brand-600 text-white hover:bg-brand-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
