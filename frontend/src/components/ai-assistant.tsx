"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Maximize2, Minimize2, CornerUpLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Spinner } from "@/components/ui/spinner"
import { Rnd } from "react-rnd"
import { mockAIChats } from "@/data/mock-data"

const DEFAULT_SIZE = { width: 400, height: 600 }; // 你代码中更新的尺寸

const getDefaultChatWindowPosition = () => {
  if (typeof window !== "undefined") {
    const margin = 20;
    const x = window.innerWidth - DEFAULT_SIZE.width - margin;
    const y = window.innerHeight - DEFAULT_SIZE.height - margin;
    return {
      x: Math.max(margin, x),
      y: Math.max(margin, y)
    };
  }
  return { x: 20, y: 20 };
};

const getDefaultButtonPosition = () => {
  if (typeof window !== "undefined") {
    return { x: window.innerWidth - 80, y: window.innerHeight - 80 };
  }
  return { x: 0, y: 0 };
};

export function AIAssistant() {
  const [aiChats, setAiChats] = useState(mockAIChats);
  const [apiLoading, setApiLoading] = useState({ aiChats: false });
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(getDefaultChatWindowPosition());
  const [size, setSize] = useState(DEFAULT_SIZE);
  
  // 新增: State for Rnd max dimensions
  const [maxRndWidth, setMaxRndWidth] = useState(typeof window !== "undefined" ? window.innerWidth - 100 : 900);
  const [maxRndHeight, setMaxRndHeight] = useState(typeof window !== "undefined" ? window.innerHeight - 100 : 700);

  // const isInitialMount = useRef(true); // 如果移除JS overflow修复，这个可能也不需要了
  // const originalHtmlOverflow = useRef<{ x: string; y: string } | null>(null); // 同上

  // Effect to update max Rnd dimensions on window resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setMaxRndWidth(Math.max(DEFAULT_SIZE.width, window.innerWidth - 100)); // 确保不小于最小宽度
      setMaxRndHeight(Math.max(DEFAULT_SIZE.height, window.innerHeight - 100)); // 确保不小于最小高度
       // 可选：如果希望默认位置也响应resize，可以在这里重新计算并设置
       // if (!localStorage.getItem("aiAssistantPosition")) { // 仅当没有用户拖动历史时
       //   setPosition(getDefaultChatWindowPosition());
       // }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPosition = localStorage.getItem("aiAssistantPosition");
      const savedSize = localStorage.getItem("aiAssistantSize");
      if (savedPosition) {
        setPosition(JSON.parse(savedPosition));
      } else {
        setPosition(getDefaultChatWindowPosition());
      }
      if (savedSize) setSize(JSON.parse(savedSize));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aiAssistantPosition", JSON.stringify(position));
      localStorage.setItem("aiAssistantSize", JSON.stringify(size));
    }
  }, [position, size]);

  // 移除了之前用于修复HTML overflow的useEffect，假设全局CSS方案会解决
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const htmlEl = document.documentElement;
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;
  //   } else {
  //     if (!isOpen) { 
  //       // ...之前的JS overflow修复逻辑...
  //     } else { 
  //       // ...
  //     }
  //   }
  // }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(prevIsOpen => {
      const nextIsOpen = !prevIsOpen;
      if (nextIsOpen) { 
        setIsMinimized(false);
        const savedPositionRaw = localStorage.getItem("aiAssistantPosition");
        if (!savedPositionRaw) {
            setPosition(getDefaultChatWindowPosition());
        }
      }
      return nextIsOpen;
    });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const resetToDefault = () => {
    setPosition(getDefaultChatWindowPosition());
    setSize(DEFAULT_SIZE);
    if (typeof window !== "undefined") {
        localStorage.removeItem("aiAssistantPosition");
        localStorage.removeItem("aiAssistantSize");
    }
  };

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const newChat = {
        _id: `ai-chat-${Date.now()}`,
        userId: "user-current",
        question: question,
        answer:
          "I'm processing your question. This is a mock response that would normally come from the AI backend.",
        type: "qa" as "qa" | "code_review" | "optimization",
        createdAt: new Date(),
      };
      setAiChats((prev) => [newChat, ...prev]);
      setQuestion("");
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to ask AI:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChats]);


  if (!isOpen) {
    return (
      <Rnd
        position={getDefaultButtonPosition()}
        disableDragging={true}
        enableResizing={false}
        style={{ zIndex: 40 }}
      >
        <Button
          onClick={toggleOpen}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          style={{ touchAction: "none" }}
        >
          <Bot className="h-6 w-6" />
        </Button>
      </Rnd>
    );
  }

  return (
    <Rnd
      position={position}
      size={isMinimized ? { width: size.width, height: 60 } : size}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: Number.parseInt(ref.style.width),
          height: Number.parseInt(ref.style.height),
        });
        setPosition(position);
      }}
      minWidth={300} // 你可以根据需要调整 RND 窗口的最小尺寸
      minHeight={isMinimized ? 60 : 200} // 例如最小高度200
      maxWidth={maxRndWidth}   // 使用 state 中的值
      maxHeight={maxRndHeight}  // 使用 state 中的值
      dragHandleClassName="drag-handle"
      enableResizing={!isMinimized}
      bounds="window"
      style={{
        zIndex: 50,
        transition: isMinimized ? "height 0.2s ease" : "none",
      }}
    >
      <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30 drag-handle cursor-move">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium">AI Assistant</h3>
              {!isMinimized && <p className="text-xs text-muted-foreground">Ask me anything</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetToDefault} title="Reset position">
              <CornerUpLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMinimize}>
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleOpen}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content and Form */}
        {!isMinimized && (
          <>
            <div
              className="p-3 overflow-y-auto overflow-x-hidden custom-scrollbar flex-grow"
            >
              {/* Chat messages */}
              {apiLoading.aiChats ? (
                <div className="flex items-center justify-center h-full">
                  <Spinner size="md" /> <span className="ml-2">Loading chats...</span>
                </div>
              ) : aiChats.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Bot className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask me anything about coding, development, or technical questions.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {aiChats.map((chat) => (
                    <div key={chat._id} className="flex flex-col gap-3">
                      <div className="flex gap-2 max-w-[80%] self-end">
                        <div className="bg-primary text-primary-foreground rounded-lg p-3 break-words">
                          <p>{chat.question}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 max-w-[90%] self-start">
                        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 markdown-content overflow-hidden w-full">
                          <MarkdownRenderer content={chat.answer} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                     <div className="flex gap-2 max-w-[90%] self-start">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce delay-100"></div>
                          <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            <form
              onSubmit={handleSendQuestion}
              className="border-t border-border p-3 bg-background"
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!question.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Rnd>
  );
}