// src/components/AIAssistant.tsx
"use client"

import React from "react" // Import React as a value
import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Maximize2, Minimize2, CornerUpLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Rnd } from "react-rnd"
import { api } from "@/services/api"; // Import your API service
import type { AIChat } from "@/types";   // Import AIChat type
// import { useApi } from "@/hooks/use-api"; // Uncomment if you use this for user ID

const DEFAULT_SIZE = { width: 400, height: 600 };

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
  return { x: 20, y: 20 }; // Default for SSR or non-browser environments
};

const getDefaultButtonPosition = () => {
  if (typeof window !== "undefined") {
    return { x: window.innerWidth - 80, y: window.innerHeight - 80 };
  }
  return { x: 0, y: 0 }; // Default
};

export function AIAssistant() {
  const [aiChats, setAiChats] = useState<AIChat[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For API call in progress
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(getDefaultChatWindowPosition());
  const [size, setSize] = useState(DEFAULT_SIZE);

  // Rnd max dimensions
  const [maxRndWidth, setMaxRndWidth] = useState(typeof window !== "undefined" ? window.innerWidth - 40 : 1200);
  const [maxRndHeight, setMaxRndHeight] = useState(typeof window !== "undefined" ? window.innerHeight - 40 : 800);

  // TODO: Get actual user ID from your authentication context
  // const { currentUserDetail } = useApi();
  // const currentUserId = currentUserDetail?._id || "anonymous-user"; // Example
  const currentUserId = "user-id-placeholder"; // Replace this placeholder

  // Effect for Rnd max dimensions on window resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setMaxRndWidth(Math.max(DEFAULT_SIZE.width, window.innerWidth - 40));
      setMaxRndHeight(Math.max(DEFAULT_SIZE.height, window.innerHeight - 40));
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load/save position and size from/to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPosition = localStorage.getItem("aiAssistantPosition");
      const savedSize = localStorage.getItem("aiAssistantSize");
      if (savedPosition) {
        try {
          setPosition(JSON.parse(savedPosition));
        } catch (e) { console.error("Failed to parse saved position", e); }
      } else {
        setPosition(getDefaultChatWindowPosition());
      }
      if (savedSize) {
        try {
          setSize(JSON.parse(savedSize));
        } catch (e) { console.error("Failed to parse saved size", e); }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aiAssistantPosition", JSON.stringify(position));
      localStorage.setItem("aiAssistantSize", JSON.stringify(size));
    }
  }, [position, size]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChats]);

  const toggleOpen = () => {
    setIsOpen(prevIsOpen => {
      const nextIsOpen = !prevIsOpen;
      if (nextIsOpen && !isMinimized) {
        // If opening and not minimized, ensure position is default if not set
        const savedPositionRaw = typeof window !== "undefined" ? localStorage.getItem("aiAssistantPosition") : null;
        if (!savedPositionRaw) {
          setPosition(getDefaultChatWindowPosition());
        }
      }
      if (nextIsOpen) setIsMinimized(false); // Always unminimize when opening
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
    const currentQuestionText = question;

    // 1. Optimistic UI Update
    const optimisticUserMessage: AIChat = {
      _id: `client-msg-${Date.now()}`,
      userId: currentUserId,
      question: currentQuestionText,
      answer: "...", // Placeholder for AI's response
      type: "qa",
      createdAt: new Date(),
    };
    setAiChats((prevChats) => [...prevChats, optimisticUserMessage]);
    setQuestion("");

    try {
      // 2. Prepare the payload for the API
      const apiHistory: Array<{ content: string; role: "system" | "user" | "assistant" }> = [
        {
          content: "你是一个帮助我学习代码的助手，回复内容可以用markdown格式，特别是代码部分",
          role: "system" as const,
        }
      ];

      // Take previous chats, excluding the one we just optimistically added.
      // Filter by ID is safer than relying on array position if operations become more complex.
      const historySourceChats = aiChats.filter(chat => chat._id !== optimisticUserMessage._id).slice(-10); // Get last 10 from actual past

      historySourceChats.forEach(chatEntry => {
        apiHistory.push({ content: chatEntry.question, role: "user" as const });
        if (chatEntry.answer && chatEntry.answer !== "...") { // Ensure real answer
          apiHistory.push({ content: chatEntry.answer, role: "assistant" as const });
        }
      });

      const requestPayload = {
        history: apiHistory,
        question: currentQuestionText,
      };

      // 3. Call the API
      const response = await api.ai.chat(requestPayload); // Make sure api.ai.chat is defined in your api.ts

      // 4. Process the API response and update the UI
      if (response.answer && response.answer.length > 0 && response.answer[0].message) {
        const aiAnswerContent = response.answer[0].message.content;
        setAiChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === optimisticUserMessage._id
              ? { ...chat, answer: aiAnswerContent }
              : chat
          )
        );
      } else {
        console.warn("AI response was not in the expected format or was empty.");
        setAiChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === optimisticUserMessage._id
              ? { ...chat, answer: "Sorry, I couldn't get a response." }
              : chat
          )
        );
      }
    } catch (error) {
      console.error("Failed to send question to AI or process response:", error);
      setAiChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === optimisticUserMessage._id
            ? { ...chat, answer: `Error: ${error instanceof Error ? error.message : "Unknown error"}` }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Rnd
        position={getDefaultButtonPosition()} // Button position should not be draggable by default
        disableDragging={true} // Ensure the button itself is not draggable
        enableResizing={false}
        style={{ zIndex: 1000 }} // Ensure button is on top
      >
        <Button
          onClick={toggleOpen}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          aria-label="Open AI Assistant"
          style={{ touchAction: "none" }} // Good for mobile to prevent page scroll
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
      onDragStop={(_e, d) => { setPosition({ x: d.x, y: d.y }); }}
      onResizeStop={(_e, _direction, ref, _delta, newPosition) => {
        setSize({
          width: Number.parseInt(ref.style.width, 10),
          height: Number.parseInt(ref.style.height, 10),
        });
        setPosition(newPosition);
      }}
      minWidth={300}
      minHeight={isMinimized ? 60 : 200}
      maxWidth={maxRndWidth}
      maxHeight={maxRndHeight}
      dragHandleClassName="drag-handle" // Class for the draggable header
      enableResizing={!isMinimized}
      bounds="window" // Restrict dragging to within the window
      style={{
        zIndex: 1000, // Ensure chat window is on top
        transition: isMinimized ? "height 0.2s ease-out" : "none", // Smooth minimize
        display: 'flex', // Added for RND flexbox compatibility
        flexDirection: 'column' // Added for RND flexbox compatibility
      }}
    >
      <div className="bg-background border border-border rounded-lg shadow-xl overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="drag-handle flex items-center justify-between p-3 border-b border-border bg-muted/40 cursor-move">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {/* Use a real image source or a more distinct fallback */}
              <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold">AI Assistant</h3>
              {!isMinimized && <p className="text-xs text-muted-foreground">How can I help you today?</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetToDefault} title="Reset position & size">
              <CornerUpLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMinimize} title={isMinimized ? "Maximize" : "Minimize"}>
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleOpen} title="Close Assistant">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content and Form - only shown if not minimized */}
        {!isMinimized && (
          <>
            <div className="p-3 overflow-y-auto overflow-x-hidden custom-scrollbar flex-grow space-y-4">
              {aiChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Bot className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Welcome!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask me anything about coding, or for help with your projects.
                  </p>
                </div>
              ) : (
                aiChats.map((chat) => (
                  <React.Fragment key={chat._id}>
                    {/* User's Question */}
                    <div className="flex justify-end">
                      <div className="bg-card border text-card-foreground rounded-lg p-3 break-words max-w-[80%] shadow">
                        {(() => {
                          // 对 chat.question 进行反转义处理
                          let processedContent = chat.question;
                          try {
                            // 尝试将字面上的 \\n, \\t, \\" 等转换回 \n, \t, "
                            // 注意：JSON.parse 可以很好地处理这些标准的JSON字符串转义
                            // 为了安全，我们只在它看起来像一个JSON编码过的字符串时（首尾是引号）才尝试
                            // 但更简单直接的方式是字符串替换
                            processedContent = processedContent
                              .replace(/\\n/g, '\n')    // 将 '\\n' 替换为实际换行符
                              .replace(/\\t/g, '\t')    // 将 '\\t' 替换为实际制表符
                              .replace(/\\"/g, '"')     // 将 '\\"' 替换为实际引号
                              .replace(/\\\\/g, '\\');  // 将 '\\\\' 替换为实际反斜杠 (如果需要处理其他转义)

                          } catch (e) {
                            console.error("Failed to unescape user question, using original:", e);
                            // 如果解析失败，保持原始内容，虽然不太可能因为我们用的是 replace
                          }

                          // console.log("User question for MarkdownRenderer (processed):", JSON.stringify(processedContent));
                          // console.log("User question directly (processed):", processedContent);

                          return <MarkdownRenderer content={processedContent} />;
                        })()}
                      </div>
                    </div>
                    {/* AI's Answer */}
                    {chat.answer === "..." ? (
                      <div className="flex items-start gap-2 self-start">
                        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                          <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex gap-1.5 items-center">
                            <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    ) : chat.answer && (
                      <div className="flex items-start gap-2 self-start">
                        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                          <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 markdown-content overflow-hidden w-full max-w-[90%] shadow">
                          <MarkdownRenderer content={chat.answer} />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))
              )}
              <div ref={messagesEndRef} /> {/* For auto-scrolling */}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendQuestion}
              className="border-t border-border p-3 bg-background sticky bottom-0"
            >
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Ask a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                  aria-label="Ask a question"
                />
                <Button type="submit" size="icon" disabled={!question.trim() || isLoading} aria-label="Send question">
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