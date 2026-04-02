"use client";

import { useState } from "react";
import { Search, X, CheckCircle2, User, Building2, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Client {
  id: number;
  fio: string | null;
  company_name: string | null;
  type: "INDIVIDUAL" | "LEGAL_ENTITY";
  email: string;
  phone: string;
}

interface ClientSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  selectedId: number;
  onSelect: (client: Client) => void;
}

export function ClientSelectorDialog({
  open,
  onOpenChange,
  clients,
  selectedId,
  onSelect,
}: ClientSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "INDIVIDUAL" | "LEGAL_ENTITY">("all");

  const filteredClients = clients.filter((client) => {
    const name = client.type === "INDIVIDUAL" ? client.fio : client.company_name;
    const matchesSearch = name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSelect = (client: Client) => {
    onSelect(client);
    onOpenChange(false);
    setSearchQuery("");
    setTypeFilter("all");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Выберите клиента</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Поиск по ФИО, названию, email или телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                typeFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setTypeFilter("all");
              }}
            >
              Все
            </div>
            <div
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                typeFilter === "INDIVIDUAL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setTypeFilter("INDIVIDUAL");
              }}
            >
              Физ. лица
            </div>
            <div
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                typeFilter === "LEGAL_ENTITY"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setTypeFilter("LEGAL_ENTITY");
              }}
            >
              Юр. лица
            </div>
          </div>
        </div>

        {/* Client List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 mt-3">
            {filteredClients.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <User className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Клиенты не найдены</p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    client.id === selectedId
                      ? "border-brand-500 bg-brand-50"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => handleSelect(client)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={
                        client.type === "INDIVIDUAL"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }>
                        {client.type === "INDIVIDUAL"
                          ? client.fio?.[0]
                          : client.company_name?.[0] || "К"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {client.type === "INDIVIDUAL" ? client.fio : client.company_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  {client.id === selectedId && (
                    <CheckCircle2 className="h-5 w-5 text-brand-600" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
