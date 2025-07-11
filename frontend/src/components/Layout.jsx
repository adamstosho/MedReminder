"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Navigation from "./Navigation"
import ReminderModal from "./ReminderModal"
import { useReminders } from "../hooks/useReminders"

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { activeReminder, dismissReminder, snoozeReminder, markAsTaken, AlarmAudio } = useReminders()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="pb-16 md:pb-0 md:ml-64">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {activeReminder && (
        <ReminderModal
          reminder={activeReminder}
          onTaken={markAsTaken}
          onSnooze={snoozeReminder}
          onDismiss={dismissReminder}
        />
      )}
      <AlarmAudio />
    </div>
  )
}

export default Layout
