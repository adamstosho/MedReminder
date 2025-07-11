"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { logService } from "../services/api"
import { useAuth } from "./AuthContext"

const LogContext = createContext()

export const useLogs = () => {
  const context = useContext(LogContext)
  if (!context) {
    throw new Error("useLogs must be used within a LogProvider")
  }
  return context
}

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([])
  const [pendingLogs, setPendingLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const { token, isAuthenticated, logout } = useAuth()

  const fetchLogs = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    try {
      const data = await logService.getAll(token)
      setLogs(data)
    } catch (error) {
      if (error.message === "Token is not valid") {
        logout()
        // Optionally, show a user-friendly message here (e.g., toast)
      }
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const addLog = async (medicationId, action) => {
    if (!medicationId || typeof medicationId !== 'string') {
      console.error('Invalid medicationId for log:', medicationId)
      return
    }
    const newLog = {
      medicationId,
      action,
      timestamp: new Date().toISOString(),
      id: Date.now(), // temporary ID for pending logs
    }

    setPendingLogs((prev) => [...prev, newLog])
    setLogs((prev) => [...prev, newLog])
    // Auto-sync after adding a log
    await syncLogs()
  }

  const syncLogs = async () => {
    if (pendingLogs.length === 0) return { success: true }

    setSyncing(true)
    try {
      const logsToSync = pendingLogs.map((log) => ({
        medicationId: log.medicationId,
        action: log.action,
        timestamp: log.timestamp,
      }))

      const syncedLogs = await logService.sync(logsToSync, token)

      // Remove pending logs and update with server response
      setPendingLogs([])
      setLogs((prev) => {
        // Remove temporary logs and add synced ones
        const withoutPending = prev.filter((log) => !pendingLogs.find((p) => p.id === log.id))
        return [...withoutPending, ...syncedLogs]
      })

      return { success: true }
    } catch (error) {
      console.error("Failed to sync logs:", error)
      // Optionally, show a toast or return error to UI
      return {
        success: false,
        error: error.message || error.response?.data?.message || "Failed to sync logs",
      }
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs()
    }
  }, [isAuthenticated])

  const value = {
    logs,
    pendingLogs,
    loading,
    syncing,
    addLog,
    syncLogs,
    refetch: fetchLogs,
  }

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>
}
