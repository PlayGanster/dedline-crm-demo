"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  X,
  MessageSquare,
  Plus,
  Check,
  Clock,
  MoreVertical,
  Reply,
  FileIcon,
  MusicIcon,
  Search,
  Phone,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ChatUser {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string | null;
  role: string;
  email: string;
  online: boolean;
}

interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
  is_read?: boolean;
  reply_to?: {
    id: number;
    content: string;
    sender_name: string;
  };
  sender: {
    first_name: string;
    last_name: string;
  };
  attachments?: {
    id: number;
    filename: string;
    original_name: string;
    mime_type: string;
    size: number;
    url?: string;
  }[];
}

interface Attachment {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
}

interface Chat {
  id: number;
  user: ChatUser;
  lastMessage: {
    id: number;
    content: string;
    created_at: string;
  } | null;
  updated_at: string;
  unreadCount?: number;
}

const mockChats: Chat[] = [
  {
    id: 1,
    user: {
      id: 2,
      first_name: "Алексей",
      last_name: "Смирнов",
      email: "smirnov@company.ru",
      role: "manager",
      online: true,
    },
    lastMessage: {
      id: 1,
      content: "Договорились, до встречи!",
      created_at: "2026-03-20T15:30:00Z",
    },
    updated_at: "2026-03-20T15:30:00Z",
    unreadCount: 2,
  },
  {
    id: 2,
    user: {
      id: 3,
      first_name: "Елена",
      last_name: "Петрова",
      email: "petrova@company.ru",
      role: "manager",
      online: false,
    },
    lastMessage: {
      id: 2,
      content: "Отправила документы на почту",
      created_at: "2026-03-20T14:00:00Z",
    },
    updated_at: "2026-03-20T14:00:00Z",
  },
  {
    id: 3,
    user: {
      id: 4,
      first_name: "Дмитрий",
      last_name: "Волков",
      email: "volkov@company.ru",
      role: "supervisor",
      online: true,
    },
    lastMessage: {
      id: 3,
      content: "Нужно обсудить заявку #047",
      created_at: "2026-03-19T18:00:00Z",
    },
    updated_at: "2026-03-19T18:00:00Z",
    unreadCount: 1,
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender_id: 2,
    content: "Привет! Как дела с переездом?",
    created_at: "2026-03-20T15:00:00Z",
    is_read: true,
    sender: { first_name: "Алексей", last_name: "Смирнов" },
  },
  {
    id: 2,
    sender_id: 1,
    content: "Привет! Всё хорошо, уже упаковываем вещи",
    created_at: "2026-03-20T15:05:00Z",
    is_read: true,
    sender: { first_name: "Вы", last_name: "" },
  },
  {
    id: 3,
    sender_id: 2,
    content: "Отлично! Во сколько быть?",
    created_at: "2026-03-20T15:10:00Z",
    is_read: true,
    sender: { first_name: "Алексей", last_name: "Смирнов" },
  },
  {
    id: 4,
    sender_id: 1,
    content: "К 9 утра завтра",
    created_at: "2026-03-20T15:15:00Z",
    is_read: true,
    sender: { first_name: "Вы", last_name: "" },
  },
  {
    id: 5,
    sender_id: 2,
    content: "Договорились, до встречи!",
    created_at: "2026-03-20T15:30:00Z",
    is_read: false,
    sender: { first_name: "Алексей", last_name: "Смирнов" },
  },
];

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [attachmentViewerOpen, setAttachmentViewerOpen] = useState(false);
  const [currentAttachments, setCurrentAttachments] = useState<any[]>([]);
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if ((!newMessage.trim() && pendingFiles.length === 0) || !selectedChat) return;

    const attachments = pendingFiles.map((file, index) => ({
      id: Date.now() + index,
      filename: file.name,
      original_name: file.name,
      mime_type: file.type || "application/octet-stream",
      size: file.size,
      url: URL.createObjectURL(file),
    }));

    const newMsg: Message = {
      id: Date.now(),
      sender_id: 1,
      content: newMessage,
      created_at: new Date().toISOString(),
      is_read: false,
      sender: { first_name: "Вы", last_name: "" },
      attachments: attachments.length > 0 ? attachments : undefined,
      reply_to: replyToMessage
        ? {
            id: replyToMessage.id,
            content: replyToMessage.content,
            sender_name: `${replyToMessage.sender.first_name} ${replyToMessage.sender.last_name}`,
          }
        : undefined,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setPendingFiles([]);
    setReplyToMessage(null);

    // Обновляем последний сообщение в чате
    setChats(
      chats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              lastMessage: {
                id: newMsg.id,
                content: newMsg.content,
                created_at: newMsg.created_at,
              },
              updated_at: newMsg.created_at,
            }
          : chat
      )
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setPendingFiles([...pendingFiles, ...selectedFiles]);
    }
    e.target.value = "";
  };

  const handleOpenAttachment = (attachments: any[], index: number) => {
    setCurrentAttachments(attachments);
    setCurrentAttachmentIndex(index);
    setAttachmentViewerOpen(true);
  };

  const filteredChats = chats.filter((chat) =>
    `${chat.user.first_name} ${chat.user.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Список чатов */}
      <Card className="w-80 flex flex-col bg-white dark:bg-card border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-foreground">Чаты</h1>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => {
                setShowNewChatDialog(true);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat?.id === chat.id
                    ? "bg-slate-100 dark:bg-accent"
                    : "hover:bg-slate-50 dark:hover:bg-accent/50"
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {chat.user.last_name[0]}
                    {chat.user.first_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-foreground truncate">
                      {chat.user.last_name} {chat.user.first_name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(chat.lastMessage?.created_at || "")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.lastMessage?.content}
                    </p>
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Окно чата */}
      <Card className="flex-1 flex flex-col bg-white dark:bg-card border-border">
        {selectedChat ? (
          <>
            {/* Заголовок чата */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {selectedChat.user.last_name[0]}
                    {selectedChat.user.first_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {selectedChat.user.last_name} {selectedChat.user.first_name}
                  </p>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedChat.user.online
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                      }`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.user.online ? "Онлайн" : "Офлайн"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon-sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="icon-sm" variant="outline">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon-sm" variant="outline">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Профиль</DropdownMenuItem>
                    <DropdownMenuItem>Уведомления</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                      Заблокировать
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Сообщения */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender_id === 1 ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-100 text-slate-700 text-xs dark:bg-slate-800 dark:text-slate-300">
                        {message.sender.last_name[0]}
                        {message.sender.first_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[70%] ${
                        message.sender_id === 1
                          ? "items-end"
                          : "items-start"
                      } flex flex-col gap-2`}
                    >
                      {/* Ответ на сообщение */}
                      {message.reply_to && (
                        <div
                          className="flex items-start gap-2 p-2 bg-slate-100 dark:bg-accent rounded-lg border-l-2 border-brand-600 cursor-pointer hover:bg-slate-200 dark:hover:bg-accent/80 transition-colors"
                          onClick={() => {
                            const el = document.getElementById(
                              `message-${message.reply_to?.id}`
                            );
                            if (el) {
                              el.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                            }
                          }}
                        >
                          <Reply
                            size={14}
                            className="text-brand-600 mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-brand-600 mb-0.5">
                              {message.reply_to.sender_name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-muted-foreground line-clamp-2">
                              {message.reply_to.content}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Сообщение */}
                      {message.content && (
                        <div
                          id={`message-${message.id}`}
                          className={`px-4 py-2 rounded-lg ${
                            message.sender_id === 1
                              ? "bg-brand-600 text-white"
                              : "bg-slate-100 dark:bg-accent text-slate-900 dark:text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      )}

                      {/* Вложения */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className={`grid gap-2 ${
                          message.attachments.length === 1 ? 'grid-cols-1' :
                          message.attachments.length === 2 ? 'grid-cols-2' :
                          'grid-cols-2 sm:grid-cols-3'
                        }`}>
                          {message.attachments.map((att, idx) => {
                            const isImage = att.mime_type?.startsWith('image/');
                            const isVideo = att.mime_type?.startsWith('video/');
                            const isAudio = att.mime_type?.startsWith('audio/');

                            if (isImage) {
                              return (
                                <div
                                  key={att.id}
                                  onClick={() => handleOpenAttachment(message.attachments!, idx)}
                                  className="relative group cursor-pointer overflow-hidden rounded-lg"
                                >
                                  <img
                                    src={att.url}
                                    alt={att.original_name}
                                    className="max-w-[200px] max-h-[200px] object-cover rounded-lg hover:opacity-90 transition-opacity"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-2">
                                    <div className="bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                      {formatFileSize(att.size)}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (isVideo) {
                              return (
                                <div
                                  key={att.id}
                                  onClick={() => handleOpenAttachment(message.attachments!, idx)}
                                  className="relative cursor-pointer"
                                >
                                  <video
                                    src={att.url}
                                    controls
                                    className="max-w-[200px] max-h-[200px] object-cover rounded-lg"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg pointer-events-none">
                                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                                      <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1" />
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (isAudio) {
                              return (
                                <div key={att.id} className="flex items-center gap-3 p-3 bg-white dark:bg-accent rounded-lg min-w-[200px]">
                                  <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center">
                                    <MusicIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-foreground truncate">{att.original_name}</p>
                                    <p className="text-xs text-slate-500 dark:text-muted-foreground">{formatFileSize(att.size)}</p>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <a
                                key={att.id}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-white dark:bg-accent rounded-lg min-w-[200px] hover:bg-slate-50 dark:hover:bg-accent/80 transition-colors"
                              >
                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                  <FileIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 dark:text-foreground truncate">{att.original_name}</p>
                                  <p className="text-xs text-slate-500 dark:text-muted-foreground">{formatFileSize(att.size)}</p>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {/* Время и статус */}
                      <div
                        className={`flex items-center gap-1 text-xs text-muted-foreground`}
                      >
                        <span>{formatTime(message.created_at)}</span>
                        {message.sender_id === 1 && (
                          <div className="flex items-center gap-0.5">
                            {message.is_read ? (
                              <>
                                <Check
                                  size={14}
                                  className="text-blue-500"
                                />
                                <Check
                                  size={14}
                                  className="text-blue-500 -ml-3"
                                />
                              </>
                            ) : (
                              <Check size={14} className="text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Зона загрузки файлов */}
            {pendingFiles.length > 0 && (
              <div className="border-t p-4 bg-slate-50 dark:bg-accent">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
                  {pendingFiles.map((file, index) => {
                    const isImage = file.type?.startsWith("image/");
                    const isVideo = file.type?.startsWith("video/");
                    const isAudio = file.type?.startsWith("audio/");
                    const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

                    return (
                      <div
                        key={index}
                        className="relative group bg-white dark:bg-card rounded-lg border border-border overflow-hidden"
                      >
                        {isImage ? (
                          <div className="relative aspect-square">
                            <img
                              src={previewUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() =>
                                  setPendingFiles(pendingFiles.filter((_, i) => i !== index))
                                }
                                className="bg-white dark:bg-card rounded-full p-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-square flex flex-col items-center justify-center p-4">
                            {isVideo ? (
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : isAudio ? (
                              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center mb-2">
                                <MusicIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-2">
                                <FileIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                              </div>
                            )}
                            <p className="text-xs text-slate-500 dark:text-muted-foreground text-center truncate w-full px-2">{file.name}</p>
                            <p className="text-xs text-slate-500 dark:text-muted-foreground">{formatFileSize(file.size)}</p>
                            <button
                              onClick={() =>
                                setPendingFiles(pendingFiles.filter((_, i) => i !== index))
                              }
                              className="absolute top-2 right-2 bg-white/80 dark:bg-card/80 rounded-full p-1 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-sm text-slate-500 dark:text-muted-foreground">
                    Выбрано файлов: {pendingFiles.length}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPendingFiles([])}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Очистить все
                  </Button>
                </div>
              </div>
            )}

            {/* Ответ на сообщение */}
            {replyToMessage && (
              <div className="border-t p-3 bg-slate-50 dark:bg-accent">
                <div className="flex items-start gap-2">
                  <Reply size={14} className="text-brand-600 dark:text-brand-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400">
                      {replyToMessage.sender.first_name}{" "}
                      {replyToMessage.sender.last_name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-muted-foreground line-clamp-2">
                      {replyToMessage.content}
                    </p>
                  </div>
                  <button
                    onClick={() => setReplyToMessage(null)}
                    className="text-slate-400 dark:text-muted-foreground hover:text-slate-600 dark:hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Ввод сообщения */}
            <div className="flex items-center gap-2 p-4 border-t border-border">
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip,.rar,.mp3,.mp4"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0"
              >
                <Paperclip size={20} />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Введите сообщение..."
                className="flex-1"
              />
              {pendingFiles.length > 0 && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setPendingFiles([])}
                >
                  <X size={16} />
                </Button>
              )}
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={
                  !newMessage.trim() && pendingFiles.length === 0
                }
                className="shrink-0 bg-brand-600 text-white hover:bg-brand-700"
              >
                <Send size={20} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Выберите чат для начала общения</p>
            </div>
          </div>
        )}
      </Card>

      {/* Диалог нового чата */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent className="max-w-md bg-white dark:bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Новый чат</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {mockChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-accent cursor-pointer"
                  onClick={() => {
                    setSelectedChat(chat);
                    setShowNewChatDialog(false);
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {chat.user.last_name[0]}
                      {chat.user.first_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {chat.user.last_name} {chat.user.first_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-muted-foreground">{chat.user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Button
            variant="outline"
            onClick={() => setShowNewChatDialog(false)}
            className="w-full"
          >
            Закрыть
          </Button>
        </DialogContent>
      </Dialog>

      {/* Диалог просмотра вложений */}
      <Dialog open={attachmentViewerOpen} onOpenChange={setAttachmentViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold truncate">
              {currentAttachments[currentAttachmentIndex]?.original_name}
            </h3>
          </div>
          <div className="p-4 max-h-[calc(90vh-80px)] overflow-y-auto">
            {currentAttachments.length > 1 ? (
              <Carousel
                opts={{
                  startIndex: currentAttachmentIndex,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {currentAttachments.map((att, index) => {
                    const isImage = att.mime_type?.startsWith('image/');
                    const isVideo = att.mime_type?.startsWith('video/');

                    return (
                      <CarouselItem key={att.id}>
                        <div className="flex items-center justify-center min-h-[400px]">
                          {isImage ? (
                            <img
                              src={att.url}
                              alt={att.original_name}
                              className="max-h-[60vh] object-contain"
                            />
                          ) : isVideo ? (
                            <video
                              src={att.url}
                              controls
                              className="max-h-[60vh] object-contain"
                            />
                          ) : (
                            <div className="text-center">
                              <FileIcon className="h-24 w-24 mx-auto text-slate-300 dark:text-muted-foreground mb-4" />
                              <p className="font-medium text-foreground">{att.original_name}</p>
                              <p className="text-sm text-slate-500 dark:text-muted-foreground">{formatFileSize(att.size)}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => window.open(att.url, '_blank')}
                              >
                                Открыть файл
                              </Button>
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                {currentAttachments.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
            ) : currentAttachments.length === 1 ? (
              <div className="flex items-center justify-center min-h-[400px]">
                {currentAttachments[0].mime_type?.startsWith('image/') ? (
                  <img
                    src={currentAttachments[0].url}
                    alt={currentAttachments[0].original_name}
                    className="max-h-[60vh] object-contain"
                  />
                ) : currentAttachments[0].mime_type?.startsWith('video/') ? (
                  <video
                    src={currentAttachments[0].url}
                    controls
                    className="max-h-[60vh] object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <FileIcon className="h-24 w-24 mx-auto text-slate-300 dark:text-muted-foreground mb-4" />
                    <p className="font-medium text-foreground">{currentAttachments[0].original_name}</p>
                    <p className="text-sm text-slate-500 dark:text-muted-foreground">{formatFileSize(currentAttachments[0].size)}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => window.open(currentAttachments[0].url, '_blank')}
                    >
                      Открыть файл
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
