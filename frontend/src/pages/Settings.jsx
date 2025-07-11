"use client"

import { useState } from "react"
import { Moon, Sun, Bell, Download, Trash2, User, Shield } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { useLogs } from "../contexts/LogContext"
import { exportService, authService } from "../services/api"
import Toast from "../components/Toast"
import ConfirmModal from "../components/ConfirmModal"

const Settings = () => {
  const { user, token, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { syncLogs } = useLogs()
  const [toast, setToast] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleExportData = async () => {
    setExporting(true)
    try {
      const data = await exportService.exportData(token)

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `medication-data-${new Date().toISOString().split("T")[0]}.json`
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

  const handleSyncData = async () => {
    const result = await syncLogs()
    if (result.success) {
      setToast({
        type: "success",
        message: "Data synced successfully!",
      })
    } else {
      setToast({
        type: "error",
        message: result.error,
      })
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await authService.deleteAccount(token)
      setToast({
        type: "success",
        message: "Account deleted successfully. Redirecting...",
      })
      setShowDeleteConfirm(false)
      setTimeout(() => {
        logout()
      }, 2000)
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Failed to delete account",
      })
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  const SettingCard = ({ icon: Icon, title, description, children, danger = false }) => (
    <div className={`card ${danger ? "border-danger-200 dark:border-danger-800" : ""}`}>
      <div className="flex items-start space-x-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            danger ? "bg-danger-100 dark:bg-danger-900" : "bg-primary-100 dark:bg-primary-900"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${
              danger ? "text-danger-600 dark:text-danger-400" : "text-primary-600 dark:text-primary-400"
            }`}
          />
        </div>
        <div className="flex-1">
          <h3
            className={`font-semibold mb-1 ${
              danger ? "text-danger-900 dark:text-danger-100" : "text-gray-900 dark:text-white"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm mb-4 ${
              danger ? "text-danger-600 dark:text-danger-400" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {description}
          </p>
          {children}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and app preferences</p>
      </div>

      {/* Profile Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>

        <SettingCard icon={User} title="Account Information" description="Your basic account details">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Name</span>
              <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
              <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
            </div>
          </div>
        </SettingCard>
      </div>

      {/* Preferences Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>

        <SettingCard icon={isDark ? Sun : Moon} title="Theme" description="Choose your preferred app appearance">
          <button onClick={toggleTheme} className="btn-secondary flex items-center space-x-2">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>Switch to {isDark ? "Light" : "Dark"} Mode</span>
          </button>
        </SettingCard>

        <SettingCard icon={Bell} title="Notifications" description="Manage your reminder preferences">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Medication Reminders</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Sound Alerts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </SettingCard>
      </div>

      {/* Data Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Management</h2>

        <SettingCard icon={Download} title="Export Data" description="Download all your medications and logs as JSON">
          <button onClick={handleExportData} disabled={exporting} className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            {exporting ? "Exporting..." : "Export Data"}
          </button>
        </SettingCard>

        <SettingCard icon={Shield} title="Sync Data" description="Sync your local data with the server">
          <button onClick={handleSyncData} className="btn-secondary">
            <Shield className="w-4 h-4 mr-2" />
            Sync Now
          </button>
        </SettingCard>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-danger-600 dark:text-danger-400">Danger Zone</h2>

        <SettingCard
          icon={Trash2}
          title="Delete Account"
          description="Permanently delete your account and all data"
          danger
        >
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger" disabled={deleting}>
            <Trash2 className="w-4 h-4 mr-2" />
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </SettingCard>
      </div>

      {/* Modals */}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your medications, logs, and personal data."
          confirmText={deleting ? "Deleting..." : "Delete Account"}
          confirmClass="btn-danger"
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
          disabled={deleting}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Settings
