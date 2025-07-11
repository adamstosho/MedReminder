"use client"

import { useState, useEffect, useRef } from "react"
import { useMedications } from "../contexts/MedicationContext"
import { useLogs } from "../contexts/LogContext"

export const useReminders = () => {
  const [activeReminder, setActiveReminder] = useState(null)
  const [snoozedReminders, setSnoozedReminders] = useState([])
  const { medications } = useMedications()
  const { addLog } = useLogs()
  const alarmRef = useRef(null)

  // Play alarm sound when a new reminder is triggered
  useEffect(() => {
    if (activeReminder && alarmRef.current) {
      alarmRef.current.currentTime = 0
      alarmRef.current.loop = true
      alarmRef.current.muted = false
      alarmRef.current.play().catch(() => {})
    } else if (!activeReminder && alarmRef.current) {
      alarmRef.current.pause()
      alarmRef.current.currentTime = 0
    }
  }, [activeReminder])

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      console.log("[Reminders] Checking at", currentTime, "with medications:", medications)

      // Check for scheduled reminders
      medications.forEach((medication) => {
        if (!medication.remindersEnabled) return

        medication.times.forEach((time) => {
          if (time === currentTime && !activeReminder) {
            console.log("[Reminders] Triggering reminder for", medication.name, time)
            setActiveReminder({
              id: `${medication._id}-${time}`,
              medicationId: medication._id,
              medicationName: medication.name,
              dosage: medication.dosage,
              scheduledTime: time,
            })
          }
        })
      })

      // Check for snoozed reminders
      setSnoozedReminders((prev) => {
        const active = prev.find((reminder) => {
          const snoozeTime = new Date(reminder.snoozeUntil)
          return now >= snoozeTime
        })

        if (active && !activeReminder) {
          console.log("[Reminders] Triggering snoozed reminder for", active.medicationName)
          setActiveReminder(active)
          return prev.filter((r) => r.id !== active.id)
        }

        return prev
      })
    }

    const interval = setInterval(checkReminders, 60000) // Check every minute
    checkReminders() // Check immediately

    return () => clearInterval(interval)
  }, [medications, activeReminder])

  const markAsTaken = async (reminder) => {
    await addLog(reminder.medicationId, "taken")
    setActiveReminder(null)
  }

  const snoozeReminder = async (reminder, minutes = 5) => {
    const snoozeUntil = new Date()
    snoozeUntil.setMinutes(snoozeUntil.getMinutes() + minutes)

    setSnoozedReminders((prev) => [
      ...prev,
      {
        ...reminder,
        snoozeUntil,
      },
    ])

    await addLog(reminder.medicationId, "snoozed")
    setActiveReminder(null)
  }

  const dismissReminder = async (reminder) => {
    await addLog(reminder.medicationId, "missed")
    setActiveReminder(null)
  }

  // Render a hidden audio element for the alarm
  const AlarmAudio = () => (
    <audio ref={alarmRef} style={{ display: 'none' }}>
      <source src="/sounds/alarm.mp3" type="audio/mpeg" />
      <source src="/sounds/alarm.ogg" type="audio/ogg" />
      <source src="/sounds/alarm.wav" type="audio/wav" />
    </audio>
  )

  return {
    activeReminder,
    markAsTaken,
    snoozeReminder,
    dismissReminder,
    AlarmAudio,
  }
}
