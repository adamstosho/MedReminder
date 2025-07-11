"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, Clock, CheckCircle, X } from "lucide-react"

const ReminderModal = ({ reminder, onTaken, onSnooze, onDismiss }) => {
  const [timeLeft, setTimeLeft] = useState(60) // 1 minute default
  const audioRef = useRef(null)

  useEffect(() => {
    setTimeLeft(60) // Reset timer every time a new reminder is shown
    // Play default alarm sound automatically
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.loop = true
      audioRef.current.muted = false
      audioRef.current.play().catch(() => {})
    }
    // Start countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDismiss()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      clearInterval(interval)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setTimeLeft(60)
    }
  }, [reminder, onDismiss])

  // Helper to stop sound and close modal on any action
  const handleAction = (actionFn, ...args) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    actionFn(...args)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-sm">
        <div className="p-6 text-center">
          {/* Audio element with default sound, hidden */}
          <audio ref={audioRef} style={{ display: 'none' }}>
            <source src="/sounds/alarm.mp3" type="audio/mpeg" />
            <source src="/sounds/alarm.ogg" type="audio/ogg" />
            <source src="/sounds/alarm.wav" type="audio/wav" />
          </audio>
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto animate-pulse-slow">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <button onClick={() => handleAction(onDismiss, reminder)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Time for your medication!</h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">{reminder.medicationName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.dosage}</p>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center space-x-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Auto-dismiss in {formatTime(timeLeft)}</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button onClick={() => handleAction(onTaken, reminder)} className="btn-success w-full py-3 text-base font-semibold">
              <CheckCircle className="w-5 h-5 mr-2" />
              I've taken it
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleAction(onSnooze, reminder)} className="btn-warning py-2 text-sm">
                Snooze 5min
              </button>
              <button onClick={() => handleAction(onDismiss, reminder)} className="btn-secondary py-2 text-sm">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReminderModal
