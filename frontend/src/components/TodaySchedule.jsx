"use client"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { format, isAfter, isBefore, addMinutes } from "date-fns"
import { useLogs } from "../contexts/LogContext"

const TodaySchedule = ({ medications, logs }) => {
  const { addLog } = useLogs()

  // Create schedule items from medications
  const scheduleItems = medications
    .flatMap((medication) =>
      medication.times.map((time) => {
        const [hours, minutes] = time.split(":").map(Number)
        const scheduledTime = new Date()
        scheduledTime.setHours(hours, minutes, 0, 0)

        // Find corresponding log
        const log = logs.find(
          (log) =>
            log.medicationId === medication._id && Math.abs(new Date(log.timestamp) - scheduledTime) < 30 * 60 * 1000, // Within 30 minutes
        )

        const now = new Date()
        const isOverdue = isAfter(now, addMinutes(scheduledTime, 15)) && !log
        const isUpcoming = isBefore(now, scheduledTime)

        return {
          id: `${medication._id}-${time}`,
          medicationId: medication._id,
          medicationName: medication.name,
          dosage: medication.dosage,
          time: scheduledTime,
          timeString: time,
          status: log ? log.action : isOverdue ? "overdue" : isUpcoming ? "upcoming" : "pending",
          log,
        }
      }),
    )
    .sort((a, b) => a.time - b.time)

  const handleAction = (item, action) => {
    addLog(item.medicationId, action)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "taken":
        return <CheckCircle className="w-5 h-5 text-success-500" />
      case "missed":
        return <XCircle className="w-5 h-5 text-danger-500" />
      case "snoozed":
        return <Clock className="w-5 h-5 text-warning-500" />
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-danger-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "taken":
        return "border-l-success-500 bg-success-50 dark:bg-success-900/20"
      case "missed":
        return "border-l-danger-500 bg-danger-50 dark:bg-danger-900/20"
      case "snoozed":
        return "border-l-warning-500 bg-warning-50 dark:bg-warning-900/20"
      case "overdue":
        return "border-l-danger-500 bg-danger-50 dark:bg-danger-900/20"
      default:
        return "border-l-gray-300 bg-white dark:bg-gray-800"
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(), "EEEE, MMMM d")}</div>
      </div>

      {scheduleItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">No medications scheduled for today</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Add medications to see your daily schedule</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduleItems.map((item, index) => (
            <div
              key={item.id}
              className={`border-l-4 rounded-r-xl p-4 transition-all duration-200 ${getStatusColor(item.status)} animate-slide-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(item.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.medicationName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.dosage} at {format(item.time, "h:mm a")}
                    </p>
                  </div>
                </div>

                {!item.log && item.status !== "upcoming" && (
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleAction(item, "taken")} className="btn-success text-xs px-3 py-1">
                      Taken
                    </button>
                    <button onClick={() => handleAction(item, "snoozed")} className="btn-warning text-xs px-3 py-1">
                      Snooze
                    </button>
                    <button onClick={() => handleAction(item, "missed")} className="btn-danger text-xs px-3 py-1">
                      Missed
                    </button>
                  </div>
                )}

                {item.status === "upcoming" && <div className="text-sm text-gray-500 dark:text-gray-400">Upcoming</div>}

                {item.log && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(item.log.timestamp), "h:mm a")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TodaySchedule
