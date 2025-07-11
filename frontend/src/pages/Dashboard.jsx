"use client"

import { useState } from "react"
import { Plus, Clock, CheckCircle, AlertCircle, Download, RefreshCw } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useMedications } from "../contexts/MedicationContext"
import { useLogs } from "../contexts/LogContext"
import { exportService } from "../services/api"
import QuickStats from "../components/QuickStats"
import TodaySchedule from "../components/TodaySchedule"
import Toast from "../components/Toast"
import { format, isToday } from "date-fns"
import { useNavigate } from "react-router-dom"
import MedicationModal from "../components/MedicationModal"

const Dashboard = () => {
  const { user, token } = useAuth()
  const { medications, loading: medicationsLoading } = useMedications()
  const { logs, syncLogs, syncing, pendingLogs } = useLogs()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState(null)
  const [exporting, setExporting] = useState(false)

  const todaysMedications = medications.filter((med) => med.remindersEnabled && med.times.length > 0)

  const todaysLogs = logs.filter((log) => isToday(new Date(log.timestamp)))

  const handleExport = async () => {
    setExporting(true)
    try {
      const data = await exportService.exportData(token)

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `medication-data-${format(new Date(), "yyyy-MM-dd")}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setToast({
        type: "success",
        message: "Data exported successfully!",
      })
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to export data",
      })
    } finally {
      setExporting(false)
    }
  }

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"},{" "}
            {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Here's your medication overview for today</p>
        </div>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {pendingLogs.length > 0 && (
            <button onClick={handleSync} disabled={syncing} className="btn-secondary flex items-center space-x-2">
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              <span>Sync ({pendingLogs.length})</span>
            </button>
          )}

          <button onClick={handleExport} disabled={exporting} className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>{exporting ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats medications={medications} todaysLogs={todaysLogs} todaysMedications={todaysMedications} />

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TodaySchedule medications={todaysMedications} logs={todaysLogs} />
        </div>

        <div className="space-y-6">
          {/* Recent Medications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Medications</h3>
              <Plus className="w-5 h-5 text-gray-400" />
            </div>

            {medicationsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : medications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No medications added yet</p>
                <button className="btn-primary text-sm">Add First Medication</button>
              </div>
            ) : (
              <div className="space-y-3">
                {medications.slice(0, 3).map((medication) => (
                  <div
                    key={medication._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{medication.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {medication.dosage} • {medication.times.length} times/day
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="btn-primary w-full justify-start" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </button>
              <button className="btn-secondary w-full justify-start" onClick={() => navigate("/logs")}>
                <CheckCircle className="w-4 h-4 mr-2" />
                View All Logs
              </button>
              <button className="btn-secondary w-full justify-start" onClick={() => navigate("/logs?filter=missed")}>
                <AlertCircle className="w-4 h-4 mr-2" />
                Missed Doses
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      {showModal && (
        <MedicationModal
          medication={null}
          onClose={() => setShowModal(false)}
          onSuccess={(message) => {
            setToast({ type: "success", message })
            setShowModal(false)
          }}
          onError={(message) => setToast({ type: "error", message })}
        />
      )}
    </div>
  )
}

export default Dashboard
