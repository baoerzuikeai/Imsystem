"use client"

import { useEffect, useState } from "react"
import { useWebSocketContext } from "@/contexts/websocket-context"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function ConnectionStatus() {
  const { isConnected } = useWebSocketContext()
  const [showStatus, setShowStatus] = useState(false)

  // 当连接状态改变时显示状态提示
  useEffect(() => {
    setShowStatus(true)
    const timer = setTimeout(() => {
      setShowStatus(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isConnected])

  if (!showStatus) return null

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium shadow-md transition-all ${
        isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isConnected ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  )
}
