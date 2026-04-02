"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import {
  Save,
  Bell,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Clock,
  Database,
  Shield,
  Palette,
  Globe,
  Check,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState({
    // Общие
    companyName: "ООО «Дедлайн»",
    inn: "7701234567",
    kpp: "770101001",
    address: "123456, г. Москва, ул. Ленина, д. 1",
    phone: "+7 (495) 123-45-67",
    email: "info@dedline.ru",
    site: "https://dedline.ru",

    // Работа
    workStart: "09:00",
    workEnd: "18:00",
    workDays: "5",
    timezone: "Europe/Moscow",

    // Финансы
    currency: "RUB",
    ndsRate: "20",
    defaultManagerPercent: "10",
    defaultSupervisorPercent: "5",

    // Уведомления
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newApplication: true,
    newCall: true,
    newMessage: true,
    taskReminder: true,

    // Интеграции
    beelineEnabled: false,
    beelineLogin: "",
    beelinePassword: "",
    twilioEnabled: false,
    twilioSid: "",
    twilioToken: "",

    // Безопасность
    minPasswordLength: "8",
    sessionTimeout: "30",
    twoFactorAuth: false,
    ipWhitelist: "",

    // Внешний вид
    theme: theme,
    language: "ru",
    itemsPerPage: "20",
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Настройки</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Управление параметрами системы
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={loading}
          className="bg-brand-600 text-white hover:bg-brand-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="general" className="text-xs">
            <Building2 className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Общие</span>
          </TabsTrigger>
          <TabsTrigger value="work" className="text-xs">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Работа</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="text-xs">
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Финансы</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs">
            <Database className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Интеграции</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            <Shield className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Безопасность</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs">
            <Palette className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Вид</span>
          </TabsTrigger>
        </TabsList>

        {/* Общие */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Информация о компании
              </CardTitle>
              <CardDescription>
                Основные реквизиты организации
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Название компании</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => updateSetting("companyName", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inn">ИНН</Label>
                  <Input
                    id="inn"
                    value={settings.inn}
                    onChange={(e) => updateSetting("inn", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpp">КПП</Label>
                  <Input
                    id="kpp"
                    value={settings.kpp}
                    onChange={(e) => updateSetting("kpp", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Юридический адрес</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => updateSetting("address", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Контактная информация
              </CardTitle>
              <CardDescription>
                Способы связи с компанией
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => updateSetting("phone", e.target.value)}
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
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site">Сайт</Label>
                  <Input
                    id="site"
                    value={settings.site}
                    onChange={(e) => updateSetting("site", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Работа */}
        <TabsContent value="work" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Режим работы
              </CardTitle>
              <CardDescription>
                Настройки рабочего времени
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workStart">Начало рабочего дня</Label>
                  <Input
                    id="workStart"
                    type="time"
                    value={settings.workStart}
                    onChange={(e) => updateSetting("workStart", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workEnd">Конец рабочего дня</Label>
                  <Input
                    id="workEnd"
                    type="time"
                    value={settings.workEnd}
                    onChange={(e) => updateSetting("workEnd", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workDays">Рабочих дней в неделе</Label>
                  <Select
                    value={settings.workDays}
                    onValueChange={(v) => updateSetting("workDays", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 дней</SelectItem>
                      <SelectItem value="6">6 дней</SelectItem>
                      <SelectItem value="7">7 дней</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Часовой пояс</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(v) => updateSetting("timezone", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                    <SelectItem value="Europe/Samara">Самара (UTC+4)</SelectItem>
                    <SelectItem value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</SelectItem>
                    <SelectItem value="Asia/Omsk">Омск (UTC+6)</SelectItem>
                    <SelectItem value="Asia/Krasnoyarsk">Красноярск (UTC+7)</SelectItem>
                    <SelectItem value="Asia/Irkutsk">Иркутск (UTC+8)</SelectItem>
                    <SelectItem value="Asia/Yakutsk">Якутск (UTC+9)</SelectItem>
                    <SelectItem value="Asia/Vladivostok">Владивосток (UTC+10)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Финансы */}
        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Финансовые настройки
              </CardTitle>
              <CardDescription>
                Валюта, налоги и проценты
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Валюта</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(v) => updateSetting("currency", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RUB">RUB (₽)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ndsRate">Ставка НДС (%)</Label>
                  <Input
                    id="ndsRate"
                    type="number"
                    value={settings.ndsRate}
                    onChange={(e) => updateSetting("ndsRate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ставка по умолчанию</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Без НДС</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultManagerPercent">
                    Процент менеджера по умолчанию (%)
                  </Label>
                  <Input
                    id="defaultManagerPercent"
                    type="number"
                    value={settings.defaultManagerPercent}
                    onChange={(e) => updateSetting("defaultManagerPercent", e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultSupervisorPercent">
                    Процент управляющего по умолчанию (%)
                  </Label>
                  <Input
                    id="defaultSupervisorPercent"
                    type="number"
                    value={settings.defaultSupervisorPercent}
                    onChange={(e) => updateSetting("defaultSupervisorPercent", e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Уведомления */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Каналы уведомлений
              </CardTitle>
              <CardDescription>
                Выберите способы получения уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-sm">Email уведомления</p>
                    <p className="text-xs text-slate-500">
                      Получать уведомления на email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(v) => updateSetting("emailNotifications", v)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-sm">Push уведомления</p>
                    <p className="text-xs text-slate-500">
                      Браузерные push уведомления
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(v) => updateSetting("pushNotifications", v)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-sm">SMS уведомления</p>
                    <p className="text-xs text-slate-500">
                      Получать SMS на телефон
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(v) => updateSetting("smsNotifications", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Типы уведомлений</CardTitle>
              <CardDescription>
                Выберите о каких событиях получать уведомления
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="newApplication" className="flex-1 cursor-pointer">
                  <p className="text-sm font-medium">Новая заявка</p>
                </Label>
                <Switch
                  id="newApplication"
                  checked={settings.newApplication}
                  onCheckedChange={(v) => updateSetting("newApplication", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="newCall" className="flex-1 cursor-pointer">
                  <p className="text-sm font-medium">Новый звонок</p>
                </Label>
                <Switch
                  id="newCall"
                  checked={settings.newCall}
                  onCheckedChange={(v) => updateSetting("newCall", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="newMessage" className="flex-1 cursor-pointer">
                  <p className="text-sm font-medium">Новое сообщение</p>
                </Label>
                <Switch
                  id="newMessage"
                  checked={settings.newMessage}
                  onCheckedChange={(v) => updateSetting("newMessage", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="taskReminder" className="flex-1 cursor-pointer">
                  <p className="text-sm font-medium">Напоминание о задаче</p>
                </Label>
                <Switch
                  id="taskReminder"
                  checked={settings.taskReminder}
                  onCheckedChange={(v) => updateSetting("taskReminder", v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Интеграции */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4" />
                IP Телефония
              </CardTitle>
              <CardDescription>
                Настройка интеграции с телефонией
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">Билайн (Beeline)</p>
                  <p className="text-xs text-slate-500">
                    Интеграция с IP телефонией Билайн
                  </p>
                </div>
                <Switch
                  checked={settings.beelineEnabled}
                  onCheckedChange={(v) => updateSetting("beelineEnabled", v)}
                />
              </div>

              {settings.beelineEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-slate-50 border">
                  <div className="space-y-2">
                    <Label htmlFor="beelineLogin">Логин</Label>
                    <Input
                      id="beelineLogin"
                      value={settings.beelineLogin}
                      onChange={(e) => updateSetting("beelineLogin", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="beelinePassword">Пароль</Label>
                    <Input
                      id="beelinePassword"
                      type="password"
                      value={settings.beelinePassword}
                      onChange={(e) => updateSetting("beelinePassword", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">Twilio</p>
                  <p className="text-xs text-slate-500">
                    Интеграция с сервисом Twilio
                  </p>
                </div>
                <Switch
                  checked={settings.twilioEnabled}
                  onCheckedChange={(v) => updateSetting("twilioEnabled", v)}
                />
              </div>

              {settings.twilioEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg bg-slate-50 border">
                  <div className="space-y-2">
                    <Label htmlFor="twilioSid">Account SID</Label>
                    <Input
                      id="twilioSid"
                      value={settings.twilioSid}
                      onChange={(e) => updateSetting("twilioSid", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twilioToken">Auth Token</Label>
                    <Input
                      id="twilioToken"
                      type="password"
                      value={settings.twilioToken}
                      onChange={(e) => updateSetting("twilioToken", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Безопасность */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Настройки безопасности
              </CardTitle>
              <CardDescription>
                Пароли, сессии и доступ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPasswordLength">
                    Минимальная длина пароля
                  </Label>
                  <Input
                    id="minPasswordLength"
                    type="number"
                    value={settings.minPasswordLength}
                    onChange={(e) => updateSetting("minPasswordLength", e.target.value)}
                    min="6"
                    max="20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Таймаут сессии (минут)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting("sessionTimeout", e.target.value)}
                    min="5"
                    max="480"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">Двухфакторная аутентификация</p>
                  <p className="text-xs text-slate-500">
                    Дополнительная защита аккаунта
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(v) => updateSetting("twoFactorAuth", v)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">
                  Белый список IP (через запятую)
                </Label>
                <Input
                  id="ipWhitelist"
                  value={settings.ipWhitelist}
                  onChange={(e) => updateSetting("ipWhitelist", e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.1"
                />
                <p className="text-xs text-slate-500">
                  Оставьте пустым для доступа с любых IP
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Внешний вид */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Настройки интерфейса
              </CardTitle>
              <CardDescription>
                Тема, язык и отображение
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Тема</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={settings.theme === "light" ? "default" : "outline"}
                      className="h-20 flex flex-col items-center gap-2"
                      onClick={() => {
                        setTheme("light");
                        updateSetting("theme", "light");
                      }}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-xs">Светлая</span>
                    </Button>
                    <Button
                      type="button"
                      variant={settings.theme === "dark" ? "default" : "outline"}
                      className="h-20 flex flex-col items-center gap-2"
                      onClick={() => {
                        setTheme("dark");
                        updateSetting("theme", "dark");
                      }}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-xs">Тёмная</span>
                    </Button>
                    <Button
                      type="button"
                      variant={settings.theme === "system" ? "default" : "outline"}
                      className="h-20 flex flex-col items-center gap-2"
                      onClick={() => {
                        setTheme("system");
                        updateSetting("theme", "system");
                      }}
                    >
                      <Monitor className="h-6 w-6" />
                      <span className="text-xs">Системная</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Язык</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(v) => updateSetting("language", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemsPerPage">Элементов на странице</Label>
                  <Select
                    value={settings.itemsPerPage}
                    onValueChange={(v) => updateSetting("itemsPerPage", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
