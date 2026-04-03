"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  Shield,
  Activity,
  Calendar,
  LogOut,
  Eye,
  EyeOff,
  X,
  KeyRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

// Мок-профиль
const MOCK_USER = {
  id: 1,
  email: "demo@dedline.ru",
  firstName: "Демо",
  lastName: "Пользователь",
  role: "DIRECTOR",
  phone: "+7 (999) 123-45-67",
  avatar: null,
  secretCode: "123456",
  isActive: true,
  createdAt: "2025-01-15T10:00:00Z",
};

const roleLabels: Record<string, string> = {
  DIRECTOR: "Директор",
  MANAGER: "Менеджер",
  SUPERVISOR: "Управляющий",
};

export default function ProfilePage() {
  const [user] = useState(MOCK_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...MOCK_USER });
  const [saving] = useState(false);
  const router = useRouter();

  const [passwords, setPasswords] = useState({
    secretCode: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    secretCode: false,
    new: false,
    confirm: false,
  });

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedUser({ ...MOCK_USER });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Мок — без backend
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (!passwords.secretCode) {
      alert("Введите секретный код");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert("Пароли не совпадают");
      return;
    }
    if (passwords.new.length < 6) {
      alert("Пароль должен быть не менее 6 символов");
      return;
    }
    // Мок — без backend
    setPasswords({ secretCode: "", new: "", confirm: "" });
    alert("Пароль успешно изменён");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Профиль</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Управление настройками вашего аккаунта
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Ваш аватар</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-foreground">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {roleLabels[user.role] || user.role}
              </p>
              <Badge variant="secondary" className="mt-2">
                <Activity className="h-3 w-3 mr-1" />
                {user.isActive ? "Онлайн" : "Неактивен"}
              </Badge>
            </div>
            <Separator className="w-full" />
            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>Дата регистрации: {new Date(user.createdAt).toLocaleDateString("ru-RU")}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <KeyRound className="h-4 w-4" />
                <span>Секретный код: {user.secretCode || "Не сгенерирован"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg">Личная информация</CardTitle>
              <CardDescription>Редактируйте свои личные данные</CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleEditToggle} disabled={saving}>
                    <X className="h-4 w-4 mr-2" />
                    Отмена
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={handleEditToggle}>
                  Редактировать
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  Имя
                </Label>
                <Input
                  id="first_name"
                  value={editedUser.firstName}
                  onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  Фамилия
                </Label>
                <Input
                  id="last_name"
                  value={editedUser.lastName}
                  onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                Телефон
              </Label>
              <Input
                id="phone"
                value={editedUser.phone || ""}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-400" />
                Роль
              </Label>
              <Input id="role" value={roleLabels[user.role] || user.role} disabled className="bg-slate-50 dark:bg-slate-800" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5" />
              Смена пароля
            </CardTitle>
            <CardDescription>Введите секретный код и новый пароль</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secret-code">Секретный код</Label>
              <div className="relative">
                <Input
                  id="secret-code"
                  type={showPasswords.secretCode ? "text" : "password"}
                  value={passwords.secretCode}
                  onChange={(e) => setPasswords({ ...passwords, secretCode: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, secretCode: !showPasswords.secretCode })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.secretCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтверждение пароля</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button className="w-full" onClick={handlePasswordChange}>
              <Lock className="h-4 w-4 mr-2" />
              Изменить пароль
            </Button>
          </CardContent>
        </Card>

        {/* Secret Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5" />
              Секретный код
            </CardTitle>
            <CardDescription>Секретный код для безопасной смены пароля</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Секретный код: <strong>{user.secretCode}</strong>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Используйте этот код при смене пароля для подтверждения личности.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
