"use client"

import type React from "react"

import { useState } from "react"
import { Chatbot } from "@/components/ai/chatbot"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(true)

  return (
    <div className="relative">
      {children}
      <Chatbot isMinimized={isChatbotMinimized} onToggleMinimize={() => setIsChatbotMinimized(!isChatbotMinimized)} />
    </div>
  )
}
