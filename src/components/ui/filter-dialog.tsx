"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterCondition {
  columnId: string;
  operator: string;
  value: string;
}

interface Column {
  id: string;
  title: string;
  dataType: string;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: Column[];
  filters: FilterCondition[];
  onApplyFilters: (filters: FilterCondition[]) => void;
}

const operatorLabels: Record<string, string> = {
  contains: "Содержит",
  equals: "Равно",
  startsWith: "Начинается с",
  endsWith: "Заканчивается на",
};

export function FilterDialog({
  open,
  onOpenChange,
  columns,
  filters: initialFilters,
  onApplyFilters,
}: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterCondition[]>(initialFilters);

  const addFilter = () => {
    if (columns.length > 0) {
      setFilters([
        ...filters,
        {
          columnId: columns[0].id,
          operator: "contains",
          value: "",
        },
      ]);
    }
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (
    index: number,
    field: keyof FilterCondition,
    value: string
  ) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setFilters([]);
    onApplyFilters([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="w-full h-full sm:w-[90vw] sm:h-auto sm:max-w-2xl sm:max-h-[80vh] flex flex-col p-0 gap-0 sm:rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50 sm:rounded-t-lg">
          <DialogTitle className="text-base font-semibold">Фильтры</DialogTitle>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                  <PlusCircle className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Нет активных фильтров
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Нажмите "Добавить фильтр", чтобы создать фильтр
                </p>
              </div>
            ) : (
              filters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg border bg-white"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Select
                      value={filter.columnId}
                      onValueChange={(value) =>
                        updateFilter(index, "columnId", value)
                      }
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Колонка" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((col) => (
                          <SelectItem key={col.id} value={col.id}>
                            {col.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filter.operator}
                      onValueChange={(value) =>
                        updateFilter(index, "operator", value)
                      }
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Оператор" />
                      </SelectTrigger>
                      <SelectContent>
                        {operatorLabels[filter.operator] && (
                          <SelectItem value={filter.operator}>
                            {operatorLabels[filter.operator]}
                          </SelectItem>
                        )}
                        {Object.entries(operatorLabels)
                          .filter(([key]) => key !== filter.operator)
                          .map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Значение"
                      value={filter.value}
                      className="h-9 w-full text-xs"
                      onChange={(e) =>
                        updateFilter(index, "value", e.target.value)
                      }
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFilter(index)}
                    className="flex-shrink-0 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 rounded-b-lg">
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={addFilter}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Добавить фильтр
            </Button>

            {filters.length > 0 && (
              <Button
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                size="sm"
                onClick={handleClear}
              >
                Очистить все
              </Button>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-1/2"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleApply}
                className="w-full sm:w-1/2 bg-brand-600 text-white hover:bg-brand-700"
                size="sm"
              >
                Применить фильтры
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
