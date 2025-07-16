"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Minus, 
  X, 
  ChevronLeft, 
  SendHorizontal, 
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WidgetForm } from "./WidgetForm";
import { WidgetEvent } from "./WidgetEvent";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  telephone: z.string().optional(),
  studyLevel: z.enum(["undergraduate", "postgraduate", "phd", "other"]).optional(),
});

type FormPhase = "form" | "verified";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

const ChatMessage = ({ content, isUser, selectedAgent }: { content: string; isUser: boolean; selectedAgent?: { name: string; role: string; avatar: string; fallback: string; } | null }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: isUser ? 0 : 1.5 }}
      className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border border-gray-200">
          <AvatarImage src={selectedAgent?.avatar || "https://github.com/shadcn.png"} alt={selectedAgent?.name || "Chat Assistant"} />
          <AvatarFallback>{selectedAgent?.fallback || "AI"}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex", isUser && "flex justify-end w-full")}>
        <div className={cn(
          "rounded p-3 inline-block",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <p className="text-sm whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

interface WidgetContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WidgetContainer = ({ isOpen, onClose }: WidgetContainerProps) => {
  const [phase, setPhase] = useState<FormPhase>("form");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showConversation, setShowConversation] = useState(false);
  const [showAgentSelection, setShowAgentSelection] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<{
    name: string;
    role: string;
    avatar: string;
    fallback: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      telephone: "",
      studyLevel: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setPhase("verified");
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
          className="absolute bottom-20 right-0 w-[500px] h-[calc(100vh-104px-24px)] bg-white rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
        >
          {/* Header Section */}
          <div className={cn(
            "relative p-6 bg-gray-950",
            phase === "verified" ? "pb-10" : "pb-12"
          )}>
            {showConversation ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setShowConversation(false)}
                          className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Back to home</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>More options</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-gray-200">
                    <AvatarImage src={selectedAgent?.avatar || "https://github.com/shadcn.png"} alt={selectedAgent?.name || "Chat Assistant"} />
                    <AvatarFallback>{selectedAgent?.fallback || "AI"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-gray-400">You are speaking with</p>
                    <p className="text-sm font-medium text-white -mt-0.5">{selectedAgent?.name || "Gecko AI"}</p>
                  </div>
                </div>

                <div className="flex">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={onClose}
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Minimize chat</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={onClose}
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Close chat</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <Image 
                    src="/gecko.svg" 
                    alt="Gecko Logo" 
                    width={48} 
                    height={48} 
                    className="mb-6"
                  />
                  <div className="flex">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={onClose}
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Minimize chat</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <p className="text-sm text-white">
                  Get quick help with any questions you have. Let us guide you through all your inquiries and give you the answers you need.
                </p>
              </>
            )}
          </div>

          <div className="relative flex-1 bg-white -mt-4 rounded-t-lg overflow-y-auto">
            <AnimatePresence mode="wait">
              {phase === "form" ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name <span aria-hidden="true" className="text-red-600">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email address <span aria-hidden="true" className="text-red-600">*</span></FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telephone number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Enter your telephone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="studyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Study level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your study level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="undergraduate">Undergraduate</SelectItem>
                              <SelectItem value="postgraduate">Postgraduate</SelectItem>
                              <SelectItem value="phd">PhD</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" size="lg">
                      Submit
                    </Button>
                  </form>
                </Form>
              ) : (
                <motion.div
                  key="verified"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col"
                >
                  {showConversation ? (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <ChatMessage
                              key={message.id}
                              content={message.content}
                              isUser={message.isUser}
                              selectedAgent={selectedAgent}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex-shrink-0 p-6 pt-0">
                        <div className="relative w-full flex items-center">
                          <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full !h-12 pr-10"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={handleSendMessage}
                            className="absolute right-2"
                          >
                            <SendHorizontal className="h-4 w-4" />
                            <span className="sr-only">Send message</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : showAgentSelection ? (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 mb-4">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setShowAgentSelection(false)}
                              className="text-gray-600 hover:text-gray-900 mt-1"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <div>
                              <h2 className="text-lg font-semibold">What can we help you with today?</h2>
                              <p className="text-sm text-muted-foreground -mt-0.5">Our agents specialise in particular topics, choose the topic you&apos;d like to discuss with us.</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <motion.button 
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.1 }}
                              onClick={() => {
                                setSelectedAgent({
                                  name: "Sarah Anderson",
                                  role: "Academic Advisor",
                                  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
                                  fallback: "SA"
                                });
                                setMessages([{
                                  id: "initial",
                                  content: "Hi Liam! I'm Sarah, your academic advisor. How can I help you with your studies today?",
                                  isUser: false
                                }]);
                                setShowAgentSelection(false);
                                setShowConversation(true);
                              }}
                              className="w-full flex items-center gap-4 bg-white hover:bg-gray-50 rounded-lg p-4 text-left border transition-colors cursor-pointer"
                            >
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" />
                                  <AvatarFallback>SA</AvatarFallback>
                                </Avatar>
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">Sarah Anderson</h3>
                                <p className="text-sm text-muted-foreground -mt-0.5">Academic Advisor</p>
                                <p className="text-xs text-muted-foreground mt-1">Specializes in course selection and academic planning</p>
                              </div>
                            </motion.button>

                            <motion.button 
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                              onClick={() => {
                                setSelectedAgent({
                                  name: "Michael Johnson",
                                  role: "Admissions Specialist",
                                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                                  fallback: "MJ"
                                });
                                setMessages([{
                                  id: "initial",
                                  content: "Hello Liam! I'm Michael, your admissions specialist. How can I assist you with your application process?",
                                  isUser: false
                                }]);
                                setShowAgentSelection(false);
                                setShowConversation(true);
                              }}
                              className="w-full flex items-center gap-4 bg-white hover:bg-gray-50 rounded-lg p-4 text-left border transition-colors cursor-pointer"
                            >
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                                  <AvatarFallback>MJ</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">Michael Johnson</h3>
                                <p className="text-sm text-muted-foreground -mt-0.5">Admissions Specialist</p>
                                <p className="text-xs text-muted-foreground mt-1">Expert in application requirements and enrollment</p>
                              </div>
                            </motion.button>

                            <motion.button 
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.3 }}
                              onClick={() => {
                                setSelectedAgent({
                                  name: "Emma Wilson",
                                  role: "Financial Aid Counselor",
                                  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                                  fallback: "EW"
                                });
                                setMessages([{
                                  id: "initial",
                                  content: "Hi Liam! I'm Emma, your financial aid counselor. How can I help you with scholarships and funding options?",
                                  isUser: false
                                }]);
                                setShowAgentSelection(false);
                                setShowConversation(true);
                              }}
                              className="w-full flex items-center gap-4 bg-white hover:bg-gray-50 rounded-lg p-4 text-left border transition-colors cursor-pointer"
                            >
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" />
                                  <AvatarFallback>EW</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">Emma Wilson</h3>
                                <p className="text-sm text-muted-foreground -mt-0.5">Financial Aid Counselor</p>
                                <p className="text-xs text-muted-foreground mt-1">Specializes in scholarships, grants, and financial planning</p>
                              </div>
                            </motion.button>

                            <motion.button 
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.4 }}
                              onClick={() => {
                                setSelectedAgent({
                                  name: "David Chen",
                                  role: "Campus Life Coordinator",
                                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                                  fallback: "DC"
                                });
                                setMessages([{
                                  id: "initial",
                                  content: "Hello Liam! I'm David, your campus life coordinator. How can I help you with housing, activities, and student life?",
                                  isUser: false
                                }]);
                                setShowAgentSelection(false);
                                setShowConversation(true);
                              }}
                              className="w-full flex items-center gap-4 bg-white hover:bg-gray-50 rounded-lg p-4 text-left border transition-colors cursor-pointer"
                            >
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                                  <AvatarFallback>DC</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">David Chen</h3>
                                <p className="text-sm text-muted-foreground -mt-0.5">Campus Life Coordinator</p>
                                <p className="text-xs text-muted-foreground mt-1">Expert in housing, activities, and student services</p>
                              </div>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Tabs defaultValue="home" className="flex flex-col h-full gap-0">
                      <div className="flex-1 overflow-y-auto">
                        <TabsContent value="home" className="mt-0">
                          <div className="space-y-4 p-6">
                            <button 
                              onClick={() => {
                                setShowAgentSelection(true);
                              }}
                              className="w-full flex items-center justify-between bg-white hover:bg-gray-50 text-foreground rounded p-4 cursor-pointer text-left border"
                            >
                              <div>
                                <h3 className="font-semibold">Start a conversation</h3>
                              </div>
                              <SendHorizontal className="w-5 h-5 text-primary" />
                            </button>

                            <div className="w-full flex flex-col gap-6 bg-white rounded p-4 text-left border">
                              <div className="space-y-1">
                                <h3 className="font-semibold text-foreground">Submit your application</h3>
                                <p className="text-sm text-muted-foreground">The deadline for applications is fast approaching. Ensure your place by applying before the 10th of July!</p>
                              </div>
                              <WidgetForm
                                trigger={<Button variant="secondary">Submit application</Button>}
                              />
                            </div>

                            <div className="w-full flex flex-col gap-6 bg-white rounded p-4 text-left border">
                              <div className="space-y-1">
                                <h3 className="font-semibold text-foreground">Register for our Open Day</h3>
                                <p className="text-sm text-muted-foreground">Our Open Day takes place on the 5th of August, reserve your place now to see what Gecko U has to offer!</p>
                              </div>
                              <WidgetEvent
                                trigger={<Button variant="secondary">Reserve your place</Button>}
                              />
                            </div>

                            <div className="relative w-full aspect-video rounded overflow-hidden">
                              <iframe
                                src="https://www.youtube.com/embed/sxf-d41_w-Y?start=2"
                                title="Campus Life Video"
                                className="w-full h-full rounded"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            </div>

                            <a 
                              href="https://geckoengage.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-between bg-white hover:bg-gray-50 text-foreground rounded p-4 cursor-pointer text-left border"
                            >
                              <div>
                                <h3 className="font-semibold">Financial aid</h3>
                              </div>
                              <ExternalLink className="w-5 h-5 text-primary" />
                            </a>
                            <a 
                              href="https://geckoengage.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-between bg-white hover:bg-gray-50 text-foreground rounded p-4 cursor-pointer text-left border"
                            >
                              <div>
                                <h3 className="font-semibold">Accommodation</h3>
                              </div>
                              <ExternalLink className="w-5 h-5 text-primary" />
                            </a>
                            <a 
                              href="https://geckoengage.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-between bg-white hover:bg-gray-50 text-foreground rounded p-4 cursor-pointer text-left border"
                            >
                              <div>
                                <h3 className="font-semibold">Campus tours</h3>
                              </div>
                              <ExternalLink className="w-5 h-5 text-primary" />
                            </a>

                          </div>
                        </TabsContent>
                        
                        {/* <TabsContent value="conversations">
                          <div className="space-y-2 p-6">
                            <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
                              <MessageSquareText className="w-4 h-4" />
                              Active conversations
                            </h2>

                            <div className="space-y-2">
                              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                <div className="flex gap-3 overflow-hidden">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>LY</AvatarFallback>
                                  </Avatar>
                                  <div className="overflow-hidden">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium truncate">Thanks so much for your patience. We&apos;ll get back to you as soon as possible.</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Liam Young</p>
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">Now</span>
                              </button>

                              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                <div className="flex gap-3 overflow-hidden">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>JU</AvatarFallback>
                                  </Avatar>
                                  <div className="overflow-hidden">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium truncate">Are there any specific questions you need help with?</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Jonny Urquhart</p>
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">2h</span>
                              </button>
                            </div>

                            <h2 className="text-sm font-semibold flex items-center gap-2 mt-8 mb-4">
                              <Archive className="w-4 h-4" />
                              Archived conversations
                            </h2>

                            <div className="space-y-2">
                              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                <div className="flex gap-3 overflow-hidden">
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                                    MC
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="font-medium truncate">Brilliant thanks Malcolm.</p>
                                    <p className="text-sm text-muted-foreground">Malcolm Christie</p>
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">2w</span>
                              </button>

                              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                <div className="flex gap-3 overflow-hidden">
                                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                                    AG
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="font-medium truncate">If there is anything else we can help with?</p>
                                    <p className="text-sm text-muted-foreground">Amy Gallacher</p>
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">12w</span>
                              </button>

                              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                <div className="flex gap-3 overflow-hidden">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CS</AvatarFallback>
                                  </Avatar>
                                  <div className="overflow-hidden">
                                    <p className="font-medium truncate">Have a great day!</p>
                                    <p className="text-sm text-muted-foreground">Cheryl Sloan</p>
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">16w</span>
                              </button>

                              <button className="w-full flex items-center justify-between bg-white hover:bg-gray-50 rounded-lg p-4 text-left border gap-5">
                                <div className="flex gap-3 overflow-hidden">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>AC</AvatarFallback>
                                  </Avatar>
                                  <div className="overflow-hidden">
                                    <div>
                                      <p className="font-medium truncate">Whatever Andrew</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Andrew Craib</p>
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">51w</span>
                              </button>
                            </div>
                          </div>
                        </TabsContent> */}
                      </div>

                      {/* <div className="flex-shrink-0 border-t bg-white p-4">
                        <TabsList className="w-full grid grid-cols-2 h-auto p-0 bg-transparent gap-2">
                          <TabsTrigger 
                            value="home"
                            className="group flex flex-col items-center data-[state=active]:bg-transparent"
                          >
                            <Home className="w-5 h-5 group-data-[state=active]:fill-current" />
                            <span className="text-sm font-medium">Home</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="conversations"
                            className="group flex flex-col items-center data-[state=active]:bg-transparent"
                          >
                            <div className="relative">
                              <MessageSquare className="w-5 h-5 group-data-[state=active]:fill-current" />
                              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] text-white w-4 h-4 flex items-center justify-center rounded-full">2</span>
                            </div>
                            <span className="text-sm font-medium">Conversations</span>
                          </TabsTrigger>
                        </TabsList>
                      </div> */}
                    </Tabs>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 