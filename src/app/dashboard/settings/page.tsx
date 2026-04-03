"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import {
  Save,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const autoLogoutOptions = [
  { value: "0", label: "Не отключать" },
  { value: "15", label: "15 минут" },
  { value: "30", label: "30 минут" },
  { value: "60", label: "1 час" },
  { value: "120", label: "2 часа" },
  { value: "240", label: "4 часа" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [autoLogout, setAutoLogout] = useState("30");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Настройки</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Управление параметрами системы
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sun className="h-5 w-5" />
              Тема оформления
            </CardTitle>
            <CardDescription>
              Выберите тему для отображения интерфейса
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <Sun className="h-6 w-6 text-amber-500" />
                <span className="text-sm font-medium">Светлая</span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <Moon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                <span className="text-sm font-medium">Тёмная</span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  theme === "system"
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <Monitor className="h-6 w-6 text-slate-500" />
                <span className="text-sm font-medium">Системная</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Текущая тема:</strong>{" "}
                {theme === "light" && "Светлая"}
                {theme === "dark" && "Тёмная"}
                {theme === "system" && "Системная (зависит от настроек вашей ОС)"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Auto Logout Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LogOut className="h-5 w-5" />
              Автоматический выход
            </CardTitle>
            <CardDescription>
              Настройте время бездействия для автоматического выхода из системы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auto-logout" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                Время бездействия
              </Label>
              <Select value={autoLogout} onValueChange={setAutoLogout}>
                <SelectTrigger id="auto-logout" className="w-full">
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  {autoLogoutOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {autoLogout === "0"
                  ? "Сессия не будет завершаться автоматически"
                  : `Автоматический выход через ${autoLogout} мин бездействия`}
              </p>
            </div>

            <Separator />

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Обратите внимание
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    При автоматическом выходе все несохранённые данные будут утеряны.
                    Рекомендуется сохранять изменения перед отходом от компьютера.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
