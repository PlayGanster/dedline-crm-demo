"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Loader2,
  CheckCircle2,
  X,
  Building,
  ChevronRight,
  MapPin,
  Scale,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CompanySearchResult {
  inn: string;
  ogrn: string;
  kpp?: string;
  company_name: string;
  legal_address?: string;
  status?: string;
  employees?: string;
  revenue?: string;
}

interface CompanyCheckButtonProps {
  inn?: string;
  companyName?: string;
  onCompanySelect?: (data: {
    company_name: string;
    inn: string;
    ogrn: string;
    kpp?: string;
    legal_address?: string;
  }) => void;
}

// Mock данные для демонстрации
const mockCompanies: CompanySearchResult[] = [
  {
    inn: "7701234567",
    ogrn: "1027700123456",
    kpp: "770101001",
    company_name: 'ООО "Ромашка"',
    legal_address: "123456, г. Москва, ул. Ленина, д. 1",
    status: "Действующая",
    employees: "50-100",
    revenue: "125 млн ₽",
  },
  {
    inn: "7702345678",
    ogrn: "1027700234567",
    kpp: "770201001",
    company_name: 'ООО "Вектор"',
    legal_address: "123457, г. Москва, пр. Мира, д. 10",
    status: "Действующая",
    employees: "10-50",
    revenue: "45 млн ₽",
  },
  {
    inn: "7703456789",
    ogrn: "1027700345678",
    kpp: "770301001",
    company_name: 'АО "Технологии"',
    legal_address: "123458, г. Москва, ул. Тверская, д. 5",
    status: "Действующая",
    employees: "100-500",
    revenue: "890 млн ₽",
  },
];

export function CompanyCheckButton({
  inn,
  companyName,
  onCompanySelect,
}: CompanyCheckButtonProps) {
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanySearchResult | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchLoading(true);

    setTimeout(() => {
      const results = mockCompanies.filter(
        (c) =>
          c.inn.includes(query) ||
          c.company_name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.length > 0 ? results : mockCompanies);
      setSelectedCompany(null);
      setSearchLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (open) {
      const initialValue = inn || companyName || "";
      setQuery(initialValue);
      if (initialValue.trim()) {
        setTimeout(() => {
          handleSearch();
        }, 100);
      }
    } else {
      setSearchResults([]);
      setSelectedCompany(null);
    }
  }, [open]);

  const handleCompanyClick = (company: CompanySearchResult) => {
    setSelectedCompany(company);
  };

  const handleFillData = () => {
    if (selectedCompany && onCompanySelect) {
      onCompanySelect({
        company_name: selectedCompany.company_name,
        inn: selectedCompany.inn,
        ogrn: selectedCompany.ogrn,
        kpp: selectedCompany.kpp,
        legal_address: selectedCompany.legal_address,
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon-sm">
          <Building2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent hideClose className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-none !max-w-[1100px] !min-w-[900px] max-h-[85vh] p-0 gap-0 flex flex-col translate-x-[-50%] translate-y-[-50%] rounded-xl shadow-2xl border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b bg-gradient-to-r from-brand-600 to-brand-700 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-white">
                  Проверка контрагента
                </DialogTitle>
                <p className="text-xs text-white/70 mt-0.5">
                  Поиск по базе юридических лиц
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b bg-slate-50">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введите ИНН или название компании..."
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-9 border-slate-200 focus:border-brand-500 focus:ring-brand-500"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={searchLoading || !query.trim()}
              size="sm"
              className="h-9 px-4 bg-brand-600 hover:bg-brand-700"
            >
              {searchLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Найти"
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Company List */}
          <div className="w-80 border-r bg-slate-50/50">
            <div className="px-4 py-3 border-b bg-white">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Результаты поиска
              </p>
            </div>
            <ScrollArea className="h-[450px]">
              <div className="p-3 space-y-2">
                {searchLoading && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
                    <span className="text-sm text-slate-500 mt-3">
                      Поиск компаний...
                    </span>
                  </div>
                )}

                {searchResults.length > 0 && !searchLoading && (
                  <div className="space-y-2">
                    {searchResults.map((company) => {
                      const isSelected = selectedCompany?.inn === company.inn;
                      return (
                        <div
                          key={company.inn}
                          className={`group p-3.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "bg-brand-50 border-brand-200 shadow-sm"
                              : "bg-white border-slate-200 hover:border-brand-300 hover:shadow-sm"
                          }`}
                          onClick={() => handleCompanyClick(company)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-md flex-shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-brand-100"
                                  : "bg-slate-100 group-hover:bg-brand-50"
                              }`}
                            >
                              <Building2
                                className={`h-4 w-4 transition-colors ${
                                  isSelected
                                    ? "text-brand-600"
                                    : "text-slate-600 group-hover:text-brand-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-slate-900 line-clamp-2">
                                {company.company_name}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  ИНН: {company.inn}
                                </span>
                              </div>
                              {company.status && (
                                <Badge
                                  variant="secondary"
                                  className="mt-2 h-5 text-xs bg-green-100 text-green-700 border-green-200"
                                >
                                  {company.status}
                                </Badge>
                              )}
                            </div>
                            {isSelected && (
                              <ChevronRight className="h-4 w-4 text-brand-600 flex-shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!searchLoading && searchResults.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-4">
                      <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      Ничего не найдено
                    </p>
                    <p className="text-xs text-slate-500 mt-1 text-center">
                      Введите ИНН или название компании для поиска
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Company Details */}
          <div className="flex-1 bg-white">
            <ScrollArea className="h-[450px]">
              <div className="p-6">
                {selectedCompany ? (
                  <div className="space-y-5">
                    {/* Company Header */}
                    <div className="flex items-start justify-between gap-4 pb-5 border-b">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">
                          {selectedCompany.company_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <Badge className="bg-brand-100 text-brand-700 border-brand-200 font-mono text-xs">
                            ИНН: {selectedCompany.inn}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs border-slate-300"
                          >
                            ОГРН: {selectedCompany.ogrn}
                          </Badge>
                          {selectedCompany.kpp && (
                            <Badge
                              variant="outline"
                              className="font-mono text-xs border-slate-300"
                            >
                              КПП: {selectedCompany.kpp}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={handleFillData}
                        size="sm"
                        className="gap-2 bg-brand-600 hover:bg-brand-700 shadow-sm"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Заполнить
                      </Button>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-slate-200 shadow-sm">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                              <Building className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Юридический адрес
                              </p>
                              <p className="text-sm font-medium text-slate-900 mt-1">
                                {selectedCompany.legal_address || "—"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 shadow-sm">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                              <Scale className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Статус
                              </p>
                              <p className="text-sm font-medium text-slate-900 mt-1">
                                {selectedCompany.status || "—"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 shadow-sm">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                              <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Сотрудники
                              </p>
                              <p className="text-sm font-medium text-slate-900 mt-1">
                                {selectedCompany.employees || "—"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 shadow-sm">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                              <MapPin className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Выручка
                              </p>
                              <p className="text-sm font-medium text-slate-900 mt-1">
                                {selectedCompany.revenue || "—"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-50 mb-6">
                      <Building2 className="h-10 w-10 text-brand-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Выберите компанию
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 text-center max-w-xs">
                      Кликните на компанию в списке слева, чтобы просмотреть
                      подробную информацию
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Данные предоставлены из открытых источников
            </p>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
