"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import type { AIChat } from "@/types"
import { mockAIChats } from "@/data/mock-data"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [question, setQuestion] = useState("")
  const [aiChats, setAiChats] = useState<AIChat[]>(mockAIChats)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || isLoading) return

    setIsLoading(true)

    // 模拟AI回答延迟
    setTimeout(() => {
      const newChat: AIChat = {
        _id: `ai-chat-${Date.now()}`,
        userId: "user-current",
        question: question,
        answer: generateMockAnswer(question),
        type: "qa",
        createdAt: new Date(),
      }

      setAiChats([...aiChats, newChat])
      setQuestion("")
      setIsLoading(false)
    }, 1500)
  }

  // 模拟AI回答生成
  const generateMockAnswer = (question: string): string => {
    // 简单的问答模拟
    if (question.toLowerCase().includes("react")) {
      return "# React\n\nReact is a JavaScript library for building user interfaces. It allows you to create reusable UI components and efficiently update the DOM when your data changes.\n\n```jsx\nfunction Welcome() {\n  return <h1>Hello, world!</h1>;\n}\n```\n\nReact uses a virtual DOM to optimize rendering performance. It's maintained by Facebook and has a large community of developers."
    } else if (question.toLowerCase().includes("typescript")) {
      return "# TypeScript\n\nTypeScript is a strongly typed programming language that builds on JavaScript. It adds static types to JavaScript, which can help prevent bugs and improve developer productivity.\n\n```typescript\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n```\n\nTypeScript is developed and maintained by Microsoft. It compiles down to plain JavaScript, so it can run anywhere JavaScript runs."
    } else {
      return `I'll help you with "${question}".\n\nThis is a simulated AI response. In a real application, this would be connected to an actual AI service that would provide relevant information based on your question.\n\nIs there anything specific you'd like to know about this topic?`
    }
  }

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [aiChats])

  if (!isOpen) {
    return (
      <Button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
      >
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-background border border-border rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
        isMinimized ? "w-72 h-15" : "w-80 sm:w-96 h-[500px]"
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
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
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleMinimize}>
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleOpen}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar h-[calc(500px-120px)]">
            {aiChats.length === 0 ? (
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

          <form onSubmit={handleSendQuestion} className="border-t border-border p-3 bg-background">
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
  )
}
