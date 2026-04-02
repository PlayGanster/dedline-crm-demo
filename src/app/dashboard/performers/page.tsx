"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, Plus, Search, Filter, Phone, Mail, MapPin, Star, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FilterDialog } from "@/components/ui/filter-dialog";

const mockPerformers = [
  {
    id: 1,
    name: "Смирнов Алексей Владимирович",
    type: "agent",
    phone: "+7 (999) 111-22-33",
    email: "smirnov@example.com",
    location: "ул. Ленина, 45",
    rating: 4.8,
    orders: 24,
    status: "active",
    is_verified: true,
  },
  {
    id: 2,
    name: "Козлова Мария Ивановна",
    type: "agent",
    phone: "+7 (999) 222-33-44",
    email: "kozlova@example.com",
    location: "пр. Мира, 12",
    rating: 4.9,
    orders: 18,
    status: "active",
    is_verified: true,
  },
  {
    id: 3,
    name: "Волков Дмитрий Петрович",
    type: "agent",
    phone: "+7 (999) 333-44-55",
    email: "volkov@example.com",
    location: "ул. Гагарина, 8",
    rating: 4.6,
    orders: 15,
    status: "busy",
    is_verified: false,
  },
  {
    id: 4,
    name: "ООО «Ритуал-Сервис»",
    type: "partner",
    phone: "+7 (495) 123-45-67",
    email: "info@ritual-service.ru",
    location: "г. Москва, ул. Тверская, 10",
    rating: 4.7,
    orders: 42,
    status: "active",
    is_verified: true,
  },
  {
    id: 5,
    name: "ИП Петров И.С.",
    type: "partner",
    phone: "+7 (999) 444-55-66",
    email: "petrov@example.com",
    location: "г. Москва, пр. Мира, 25",
    rating: 4.5,
    orders: 31,
    status: "inactive",
    is_verified: false,
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  busy: "bg-yellow-100 text-yellow-700 border-yellow-200",
  inactive: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusLabels: Record<string, string> = {
  active: "Активен",
  busy: "Занят",
  inactive: "Не активен",
};

export default function PerformersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredPerformers = mockPerformers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);

    const matchesFilters = filters.every((filter) => {
      let value: any;
      switch (filter.columnId) {
        case "name":
          value = p.name;
          break;
        case "type":
          value = p.type === "agent" ? "Агент" : "Партнер";
          break;
        case "status":
          value = statusLabels[p.status];
          break;
        case "location":
          value = p.location;
          break;
        default:
          value = "";
      }

      if (!value) return false;

      switch (filter.operator) {
        case "contains":
          return value.toLowerCase().includes(filter.value.toLowerCase());
        case "equals":
          return value.toLowerCase() === filter.value.toLowerCase();
        case "startsWith":
          return value.toLowerCase().startsWith(filter.value.toLowerCase());
        case "endsWith":
          return value.toLowerCase().endsWith(filter.value.toLowerCase());
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  const activeFiltersCount = filters.length;

  const columns = [
    { id: "name", title: "Имя", dataType: "string" },
    { id: "type", title: "Тип", dataType: "string" },
    { id: "status", title: "Статус", dataType: "string" },
    { id: "location", title: "Локация", dataType: "string" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Исполнители</h1>
          <p className="text-xs sm:text-sm text-slate-500">Агенты и партнеры компании</p>
        </div>
        <Button
          size="icon-sm"
          className="bg-brand-600 text-white hover:bg-brand-700 flex-shrink-0"
          onClick={() => router.push("/dashboard/performers/create")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Поиск по имени или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => setIsFilterOpen(true)}
          className="relative shrink-0 sm:hidden"
        >
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(true)}
          className="relative shrink-0 hidden sm:inline-flex"
        >
          <Filter className="h-4 w-4" />
          <span className="ml-2">Фильтры</span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-500">Фильтры:</span>
          {filters.map((filter, index) => {
            const column = columns.find((c) => c.id === filter.columnId);
            return (
              <Badge
                key={index}
                variant="secondary"
                className="gap-1 pr-1 cursor-pointer text-xs"
              >
                {column?.title}: {filter.value}
                <button
                  onClick={() => {
                    const newFilters = filters.filter((_, i) => i !== index);
                    setFilters(newFilters);
                  }}
                  className="hover:bg-slate-200 rounded-full p-0.5"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => setFilters([])}
          >
            Очистить
          </Button>
        </div>
      )}

      {/* Performers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPerformers.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UserCheck className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">Исполнители не найдены</p>
              </CardContent>
            </Card>
          ) : (
            filteredPerformers.map((performer) => (
              <Card
                key={performer.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/performers/${performer.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-brand-100 text-brand-700">
                          {performer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-semibold">{performer.name}</CardTitle>
                          {performer.is_verified ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-slate-300 flex-shrink-0" />
                          )}
                        </div>
                        <Badge variant="outline" className={statusColors[performer.status]}>
                          {statusLabels[performer.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{performer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{performer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{performer.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{performer.rating}</span>
                    </div>
                    <span className="text-xs text-slate-500">{performer.orders} заказов</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      {/* Filter Dialog */}
      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        columns={columns}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
}
