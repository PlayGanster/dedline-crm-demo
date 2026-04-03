"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const notifications = [
  { id: 1, title: "Новый заказ #047", description: "Иванов Петр Сергеевич", time: "2 мин назад", type: "order", read: false },
  { id: 2, title: "Заказ #046 обновлён", description: "Мария К. изменила статус", time: "5 мин назад", type: "update", read: false },
  { id: 3, title: "Документы загружены", description: "Дмитрий В. загрузил акты", time: "12 мин назад", type: "document", read: false },
  { id: 4, title: "Новый клиент", description: "Сидоров Виктор Константинович", time: "1 час назад", type: "client", read: true },
  { id: 5, title: "Заказ #045 завершён", description: "Успешно выполнен", time: "2 часа назад", type: "complete", read: true },
];

const typeColors: Record<string, string> = {
  order: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  update: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  document: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  client: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  complete: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const typeLabels: Record<string, string> = {
  order: "Заказ",
  update: "Обновление",
  document: "Документ",
  client: "Клиент",
  complete: "Завершено",
};

export default function NotificationsPage() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-foreground">Уведомления</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount} новых уведомлений
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button size="sm" className="bg-brand-600 text-white hover:bg-brand-700 w-full sm:w-auto justify-center">
            <Check className="h-4 w-4" />
            <span className="ml-2">Прочитать все</span>
          </Button>
          <Button size="sm" variant="outline" className="w-full sm:w-auto justify-center border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-foreground">
            <Trash2 className="h-4 w-4" />
            <span className="ml-2">Очистить</span>
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              Нет уведомлений
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-colors ${
                  notification.read 
                    ? "bg-white dark:bg-card" 
                    : "bg-slate-50 dark:bg-card"
                } hover:bg-slate-100 dark:hover:bg-accent/50 cursor-pointer`}
              >
                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full shrink-0 ${typeColors[notification.type]}`}>
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900 dark:text-foreground truncate">{notification.title}</span>
                    {!notification.read && (
                      <Badge variant="secondary" className="text-xs">Новое</Badge>
                    )}
                    <Badge className={typeColors[notification.type]}>{typeLabels[notification.type]}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{notification.description}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
