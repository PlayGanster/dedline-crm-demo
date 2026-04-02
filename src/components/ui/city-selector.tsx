"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Крупнейшие города России (можно расширить)
const cities = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Омск",
  "Ростов-на-Дону",
  "Уфа",
  "Красноярск",
  "Воронеж",
  "Пермь",
  "Волгоград",
  "Краснодар",
  "Саратов",
  "Тюмень",
  "Тольятти",
  "Ижевск",
  "Барнаул",
  "Ульяновск",
  "Иркутск",
  "Хабаровск",
  "Ярославль",
  "Владивосток",
  "Махачкала",
  "Томск",
  "Оренбург",
  "Кемерово",
  "Новокузнецк",
  "Рязань",
  "Астрахань",
  "Пенза",
  "Липецк",
  "Киров",
  "Чебоксары",
  "Тула",
  "Калининград",
  "Курск",
  "Севастополь",
  "Сочи",
  "Ставрополь",
  "Тверь",
  "Магнитогорск",
  "Иваново",
  "Брянск",
  "Сургут",
  "Белгород",
  "Владимир",
  "Нижний Тагил",
  "Архангельск",
  "Чита",
  "Калуга",
  "Смоленск",
  "Курган",
  "Орёл",
  "Волжский",
  "Череповец",
  "Владикавказ",
  "Мурманск",
  "Подольск",
  "Грозный",
  "Петрозаводск",
  "Нальчик",
  "Йошкар-Ола",
  "Саранск",
  "Кострома",
  "Тамбов",
  "Сыктывкар",
  "Нижневартовск",
  "Новороссийск",
  "Нижнекамск",
  "Набережные Челны",
  "Энгельс",
  "Благовещенск",
  "Великий Новгород",
  "Королёв",
  "Псков",
  "Мытищи",
  "Люберцы",
  "Химки",
  "Абакан",
  "Уссурийск",
  "Каменск-Уральский",
  "Петропавловск-Камчатский",
  "Альметьевск",
  "Златоуст",
  "Салават",
  "Невинномысск",
  "Домодедово",
  "Одинцово",
  "Копейск",
  "Пятигорск",
  "Красногорск",
  "Майкоп",
  "Ессентуки",
  "Кисловодск",
  "Сергиев Посад",
  "Новочеркасск",
  "Орехово-Зуево",
  "Нефтеюганск",
  "Стерлитамак",
  "Назрань",
  "Кызыл",
  "Якутск",
  "Горно-Алтайск",
  "Магадан",
  "Южно-Сахалинск",
  "Анадырь",
  "Нарьян-Мар",
  "Салехард",
  "Ханты-Мансийск",
  "Ноябрьск",
  "Муравленко",
  "Губкинский",
  "Когалым",
  "Лангепас",
  "Мегион",
  "Нягань",
  "Покачи",
  "Пыть-Ях",
  "Радужный",
  "Советский",
  "Урай",
  "Югорск",
  "Белоярский",
  "Иркут",
].sort();

interface CitySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CitySelector({
  value,
  onChange,
  placeholder = "Выберите город",
  disabled = false,
}: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (city: string) => {
    onChange?.(city);
    setOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 font-normal"
          disabled={disabled}
        >
          <span className={cn(!value && "text-slate-500")}>
            {value || placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="hover:bg-slate-100 rounded p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск города..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>Город не найден</CommandEmpty>
            <CommandGroup>
              {cities
                .filter((city) =>
                  city.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    onSelect={() => handleSelect(city)}
                    className="flex items-center justify-between"
                  >
                    <span>{city}</span>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === city ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
