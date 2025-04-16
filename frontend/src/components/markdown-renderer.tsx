"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/atom-one-dark.css" // 导入一个预设的样式
import type { Components } from "react-markdown"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>{content}</div>
  }

  // 正确定义组件类型
  const components: Components = {
    a: ({ node, ...props }) => (
      <a {...props} className="text-primary underline" target="_blank" rel="noopener noreferrer" />
    ),
    ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-3" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-3" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-2" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-2" {...props} />
    ),
    code: ({ node, className, children, ...props }) => {
      // 检查是否是代码块（而不是内联代码）
      const isCodeBlock = className?.includes("language-")
      const match = /language-(\w+)/.exec(className || "")

      return isCodeBlock ? (
        <div className="overflow-auto rounded-md my-2">
          <pre className={className}>
            <code className={match ? match[1] : ""} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      )
    },
    pre: ({ node, ...props }) => (
      <pre className="bg-[#282c34] text-[#abb2bf] p-4 rounded-md overflow-x-auto my-4" {...props} />
    ),
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
