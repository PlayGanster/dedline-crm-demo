"use client";

import { useState } from "react";
import { Search, X, CheckCircle2, User, Mail, Phone } from "lucide-react";
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

interface StaffMember {
  id: number;
  fio: string;
  email: string;
  phone: string;
}

interface StaffSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: StaffMember[];
  selectedId: number;
  onSelect: (member: StaffMember) => void;
  title: string;
}

export function StaffSelectorDialog({
  open,
  onOpenChange,
  members,
  selectedId,
  onSelect,
  title,
}: StaffSelectorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = members.filter((member) =>
    member.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone.includes(searchQuery)
  );

  const handleSelect = (member: StaffMember) => {
    onSelect(member);
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Поиск по ФИО, email или телефону..."
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

        {/* Member List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 mt-3">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <User className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Сотрудники не найдены</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    member.id === selectedId
                      ? "border-brand-500 bg-brand-50"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => handleSelect(member)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-100 text-slate-700">
                        {member.fio.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.fio}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  {member.id === selectedId && (
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
