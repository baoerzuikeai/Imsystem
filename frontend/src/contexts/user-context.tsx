"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/types"

interface UserContextProps {
  users: User[]
  updateUsers: () => Promise<void>
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([])

  const updateUsers = async () => {
    try {
      const token = localStorage.getItem("token") // 获取 token
      const response = await fetch("http://localhost:8080/api/v1/chats/private", {
        headers: {
          Authorization: `${token}`,
        },
      })
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    updateUsers() // 初始化时加载用户数据
  }, [])

  return (
    <UserContext.Provider value={{ users, updateUsers }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider")
  }
  return context
}