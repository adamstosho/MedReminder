"use client"
import { AlertTriangle, X } from "lucide-react"

const ConfirmModal = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmClass = "btn-primary",
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button onClick={onCancel} className="btn-secondary">
              {cancelText}
            </button>
            <button onClick={onConfirm} className={confirmClass}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
