"use client"

import { useEffect } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"

const Toast = ({ type = "success", message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
  }

  const colors = {
    success: "bg-success-50 border-success-200 text-success-800",
    error: "bg-danger-50 border-danger-200 text-danger-800",
    warning: "bg-warning-50 border-warning-200 text-warning-800",
  }

  const iconColors = {
    success: "text-success-500",
    error: "text-danger-500",
    warning: "text-warning-500",
  }

  const Icon = icons[type]

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className={`flex items-center p-4 rounded-xl border shadow-lg max-w-sm ${colors[type]}`}>
        <Icon className={`w-5 h-5 mr-3 ${iconColors[type]}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="ml-3 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast
