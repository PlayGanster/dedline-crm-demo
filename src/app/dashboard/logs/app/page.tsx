"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Code, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AppLogsPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Логи APP</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Журнал событий мобильного приложения
          </p>
        </div>
      </div>

      {/* WIP Card */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <Code className="h-10 w-10 text-amber-600" />
            </div>
            <CardTitle className="text-xl">В разработке</CardTitle>
            <CardDescription className="text-base">
              Страница логов мобильного приложения находится в разработке
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <Clock className="h-4 w-4" />
              <span>Ожидаемое время готовности: скоро</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Функционал в тестировании</span>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-slate-500 text-center">
                В будущем здесь будет отображаться история событий мобильного приложения:
              </p>
              <ul className="mt-2 text-xs text-slate-600 space-y-1">
                <li>• Синхронизация данных</li>
                <li>• Push-уведомления</li>
                <li>• Ошибки приложения</li>
                <li>• Действия пользователей</li>
                <li>• API запросы</li>
              </ul>
            </div>

            <Button
              className="w-full"
              onClick={() => router.push("/dashboard/logs/crm")}
            >
              Перейти к логам CRM
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
