"use client"

import { useState, useMemo } from "react"
import { Calendar, Download, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"
import { useLogs } from "../contexts/LogContext"
import { useMedications } from "../contexts/MedicationContext"
import { format, isToday, isYesterday, startOfDay, endOfDay } from "date-fns"
import Toast from "../components/Toast"
import { logService } from "../services/api"
import { useAuth } from "../contexts/AuthContext"

const Logs = () => {
  const { logs, loading, syncLogs, syncing, pendingLogs } = useLogs()
  const { medications } = useMedications()
  const { token } = useAuth()
  const [filterAction, setFilterAction] = useState("all")
  const [filterMedication, setFilterMedication] = useState("all")
  const [filterDate, setFilterDate] = useState("")
  const [toast, setToast] = useState(null)
  const [clearing, setClearing] = useState(false)

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const matchesAction = filterAction === "all" || log.action === filterAction
        const matchesMedication = filterMedication === "all" || log.medicationId === filterMedication

        let matchesDate = true
        if (filterDate) {
          const logDate = new Date(log.timestamp)
          const filterDateObj = new Date(filterDate)
          matchesDate = logDate >= startOfDay(filterDateObj) && logDate <= endOfDay(filterDateObj)
        }

        return matchesAction && matchesMedication && matchesDate
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [logs, filterAction, filterMedication, filterDate])

  const groupedLogs = useMemo(() => {
    const groups = {}

    filteredLogs.forEach((log) => {
      const date = new Date(log.timestamp)
      let dateKey

      if (isToday(date)) {
        dateKey = "Today"
      } else if (isYesterday(date)) {
        dateKey = "Yesterday"
      } else {
        dateKey = format(date, "EEEE, MMMM d, yyyy")
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].push(log)
    })

    return groups
  }, [filteredLogs])

  const handleSync = async () => {
    const result = await syncLogs()
    if (result.success) {
      setToast({
        type: "success",
        message: "Logs synced successfully!",
      })
    } else {
      setToast({
        type: "error",
        message: result.error,
      })
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `medication-logs-${format(new Date(), "yyyy-MM-dd")}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setToast({
      type: "success",
      message: "Logs exported successfully!",
    })
  }

  const handleClearLogs = async () => {
    setClearing(true)
    try {
      await logService.clearAll(token)
      setToast({
        type: "success",
        message: "All logs cleared successfully!",
      })
      // Optionally, refetch logs or clear from context
      window.location.reload()
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Failed to clear logs",
      })
    } finally {
      setClearing(false)
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case "taken":
        return <CheckCircle className="w-5 h-5 text-success-500" />
      case "missed":
        return <XCircle className="w-5 h-5 text-danger-500" />
      case "snoozed":
        return <Clock className="w-5 h-5 text-warning-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case "taken":
        return "text-success-600 bg-success-50 dark:bg-success-900/20"
      case "missed":
        return "text-danger-600 bg-danger-50 dark:bg-danger-900/20"
      case "snoozed":
        return "text-warning-600 bg-warning-50 dark:bg-warning-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-700"
    }
  }

  const getMedicationName = (medicationId) => {
    const medication = medications.find((med) => med._id === medicationId)
    return medication ? medication.name : "Unknown Medication"
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Medication Logs</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your medication history and patterns</p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {pendingLogs.length > 0 && (
            <button onClick={handleSync} disabled={syncing} className="btn-warning flex items-center space-x-2">
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              <span>Sync ({pendingLogs.length})</span>
            </button>
          )}

          <button onClick={handleExport} className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button onClick={handleClearLogs} disabled={clearing} className="btn-danger flex items-center space-x-2">
            <XCircle className="w-4 h-4" />
            <span>{clearing ? "Clearing..." : "Clear Logs"}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Action</label>
            <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="input">
              <option value="all">All Actions</option>
              <option value="taken">Taken</option>
              <option value="missed">Missed</option>
              <option value="snoozed">Snoozed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medication</label>
            <select value={filterMedication} onChange={(e) => setFilterMedication(e.target.value)} className="input">
              <option value="all">All Medications</option>
              {medications.map((med) => (
                <option key={med._id} value={med._id}>
                  {med.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterAction("all")
                setFilterMedication("all")
                setFilterDate("")
              }}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Logs */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">No logs found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {filterAction !== "all" || filterMedication !== "all" || filterDate
              ? "Try adjusting your filters"
              : "Start taking medications to see your history here"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([dateGroup, dayLogs]) => (
            <div key={dateGroup} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 z-10">
                {dateGroup}
              </h3>

              <div className="space-y-3">
                {dayLogs.map((log, index) => (
                  <div
                    key={log._id || log.id}
                    className="card hover:shadow-md transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getActionIcon(log.action)}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {getMedicationName(log.medicationId)}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(log.timestamp), "h:mm a")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getActionColor(log.action)}`}
                        >
                          {log.action}
                        </span>
                        {log.id && (
                          <span className="px-2 py-1 bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300 text-xs rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Logs
