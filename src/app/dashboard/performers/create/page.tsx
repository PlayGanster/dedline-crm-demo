"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, User, Mail, Phone, Save, MapPin, Briefcase, ShieldCheck, ShieldX, CheckCircle, FileBadge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CitySelector } from "@/components/ui/city-selector";

export default function PerformerCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("main");

  const fromPage = searchParams.get("from") || "/dashboard/performers";

  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    email: "",
    phone: "",
    city: "",
    source: "CRM" as "CRM" | "APP",
    is_active: true,
    is_verified: false,
    professions: "",
    passport_series: "",
    passport_number: "",
    passport_issued_by: "",
    passport_issued_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(fromPage);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => router.push(fromPage)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Создание исполнителя</h1>
          <p className="text-sm text-slate-500">Добавление нового исполнителя в базу</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Основная информация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="mb-2 block">Источник</Label>
                <Tabs
                  value={formData.source}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      source: v as "CRM" | "APP",
                    })
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="CRM">CRM</TabsTrigger>
                    <TabsTrigger value="APP">Приложение</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <Label className="mb-2 block">Статус</Label>
                <Tabs
                  value={formData.is_active ? "active" : "inactive"}
                  onValueChange={(v) =>
                    setFormData({ ...formData, is_active: v === "active" })
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">Активен</TabsTrigger>
                    <TabsTrigger value="inactive">Не активен</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <Label className="mb-2 block">Проверка</Label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      formData.is_verified
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }
                  >
                    {formData.is_verified ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <ShieldX className="h-3 w-3 mr-1" />
                    )}
                    {formData.is_verified ? "Проверен" : "Не проверен"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="last_name">Фамилия</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name">Отчество</Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      middle_name: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Город
                </Label>
                <CitySelector
                  value={formData.city}
                  onChange={(value) =>
                    setFormData({ ...formData, city: value })
                  }
                  placeholder="Выберите город"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professions" className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  Профессии
                </Label>
                <Input
                  id="professions"
                  value={formData.professions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      professions: e.target.value,
                    })
                  }
                  placeholder="Грузчик, Водитель"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passport Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileBadge className="h-4 w-4" />
              Паспортные данные
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passport_series">Серия паспорта</Label>
                <Input
                  id="passport_series"
                  value={formData.passport_series}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passport_series: e.target.value,
                    })
                  }
                  placeholder="1234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passport_number">Номер паспорта</Label>
                <Input
                  id="passport_number"
                  value={formData.passport_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passport_number: e.target.value,
                    })
                  }
                  placeholder="567890"
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="passport_issued_by">Кем выдан</Label>
              <Textarea
                id="passport_issued_by"
                value={formData.passport_issued_by}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passport_issued_by: e.target.value,
                  })
                }
                placeholder="МВД России"
                rows={2}
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="passport_issued_date">Дата выдачи</Label>
              <Input
                id="passport_issued_date"
                type="date"
                value={formData.passport_issued_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passport_issued_date: e.target.value,
                  })
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
            onClick={() => router.push(fromPage)}
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
            {loading ? "Создание..." : "Создать"}
          </Button>
        </div>
      </form>
    </div>
  );
}
