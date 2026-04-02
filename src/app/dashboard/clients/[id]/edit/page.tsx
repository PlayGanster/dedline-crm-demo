"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, User, Building2, Mail, Phone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyCheckButton } from "@/components/company-check/CompanyCheckButton";
import { CitySelector } from "@/components/ui/city-selector";

interface ClientFormData {
  type: "INDIVIDUAL" | "LEGAL_ENTITY";
  email?: string;
  phone?: string;
  fio?: string;
  city?: string;
  company_name?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  legal_address?: string;
  is_active: boolean;
}

const mockClient = {
  id: 1,
  type: "INDIVIDUAL" as const,
  fio: "Иванов Петр Сергеевич",
  company_name: null,
  email: "ivanov@example.com",
  phone: "+7 (999) 123-45-67",
  inn: "770123456789",
  kpp: null,
  ogrn: null,
  legal_address: "г. Москва, ул. Ленина, д. 10, кв. 50",
  is_active: true,
};

export default function ClientEditPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    type: "INDIVIDUAL",
    email: "",
    phone: "",
    fio: "",
    city: "",
    company_name: "",
    inn: "",
    kpp: "",
    ogrn: "",
    legal_address: "",
    is_active: true,
  });

  const fromPage = searchParams.get("from") || "/dashboard/clients";

  useEffect(() => {
    setLoading(true);
    setFormData({
      type: mockClient.type,
      email: mockClient.email || "",
      phone: mockClient.phone || "",
      fio: mockClient.fio || "",
      company_name: mockClient.company_name || "",
      inn: mockClient.inn || "",
      kpp: mockClient.kpp || "",
      ogrn: mockClient.ogrn || "",
      legal_address: mockClient.legal_address || "",
      is_active: mockClient.is_active,
    });
    setLoading(false);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(fromPage);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-slate-500">Загрузка...</p>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Редактирование клиента</h1>
          <p className="text-sm text-slate-500">Клиент #{id}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Основная информация */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Основная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="mb-2 block">Тип клиента</Label>
                <Tabs
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      type: v as "INDIVIDUAL" | "LEGAL_ENTITY",
                    })
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="INDIVIDUAL">
                      <User className="h-3.5 w-3.5 mr-1" />
                      Физ.
                    </TabsTrigger>
                    <TabsTrigger value="LEGAL_ENTITY">
                      <Building2 className="h-3.5 w-3.5 mr-1" />
                      Юр.
                    </TabsTrigger>
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
                    <TabsTrigger value="active">
                      Активен
                    </TabsTrigger>
                    <TabsTrigger value="inactive">
                      Не активен
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <Label className="mb-2 block">Телефон</Label>
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
          </CardContent>
        </Card>

        {/* Физическое лицо */}
        {formData.type === "INDIVIDUAL" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Данные физического лица
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fio" className="mb-2 block">ФИО</Label>
                  <Input
                    id="fio"
                    value={formData.fio}
                    onChange={(e) =>
                      setFormData({ ...formData, fio: e.target.value })
                    }
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="mb-2 block">Город</Label>
                  <CitySelector
                    value={formData.city}
                    onChange={(value) =>
                      setFormData({ ...formData, city: value })
                    }
                    placeholder="Выберите город"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Юридическое лицо */}
        {formData.type === "LEGAL_ENTITY" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Данные юридического лица
                </div>
                <CompanyCheckButton
                  inn={formData.inn}
                  companyName={formData.company_name}
                  onCompanySelect={(data) => {
                    setFormData({
                      ...formData,
                      company_name: data.company_name,
                      inn: data.inn,
                      ogrn: data.ogrn,
                      kpp: data.kpp,
                      legal_address: data.legal_address,
                    });
                  }}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Название компании</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  placeholder='ООО "Ромашка"'
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inn">ИНН</Label>
                  <Input
                    id="inn"
                    value={formData.inn}
                    onChange={(e) =>
                      setFormData({ ...formData, inn: e.target.value })
                    }
                    placeholder="7701234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpp">КПП</Label>
                  <Input
                    id="kpp"
                    value={formData.kpp}
                    onChange={(e) =>
                      setFormData({ ...formData, kpp: e.target.value })
                    }
                    placeholder="770101001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogrn">ОГРН</Label>
                  <Input
                    id="ogrn"
                    value={formData.ogrn}
                    onChange={(e) =>
                      setFormData({ ...formData, ogrn: e.target.value })
                    }
                    placeholder="1027700123456"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="legal_address">Юридический адрес</Label>
                <Textarea
                  id="legal_address"
                  value={formData.legal_address}
                  onChange={(e) =>
                    setFormData({ ...formData, legal_address: e.target.value })
                  }
                  placeholder="123456, г. Москва, ул. Ленина, д. 1"
                  rows={2}
                />
              </div>

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
                  placeholder="info@company.ru"
                />
              </div>
            </CardContent>
          </Card>
        )}

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
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  );
}
