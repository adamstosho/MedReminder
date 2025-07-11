import { Pill, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

const QuickStats = ({ medications, todaysLogs, todaysMedications }) => {
  // Calculate stats
  const totalMedications = medications.length
  const activeMedications = medications.filter((med) => med.remindersEnabled).length
  const todaysTaken = todaysLogs.filter((log) => log.action === "taken").length
  const todaysMissed = todaysLogs.filter((log) => log.action === "missed").length
  const totalDosesToday = todaysMedications.reduce((total, med) => total + med.times.length, 0)
  const completionRate = totalDosesToday > 0 ? Math.round((todaysTaken / totalDosesToday) * 100) : 0

  // State for persisted stats
  const [persistedStats, setPersistedStats] = useState(() => {
    const saved = localStorage.getItem("dashboardStats")
    return saved ? JSON.parse(saved) : null
  })

  // Save stats to localStorage whenever they change
  useEffect(() => {
    const statsToSave = {
      totalMedications,
      todaysTaken,
      todaysMissed,
      completionRate,
      date: new Date().toISOString().slice(0, 10),
    }
    localStorage.setItem("dashboardStats", JSON.stringify(statsToSave))
    setPersistedStats(statsToSave)
  }, [totalMedications, todaysTaken, todaysMissed, completionRate])

  // Use persisted stats if available and for today
  const today = new Date().toISOString().slice(0, 10)
  const statsSource =
    persistedStats && persistedStats.date === today
      ? persistedStats
      : { totalMedications, todaysTaken, todaysMissed, completionRate }

  const stats = [
    {
      title: "Total Medications",
      value: statsSource.totalMedications,
      icon: Pill,
      color: "bg-primary-500",
      bgColor: "bg-primary-50 dark:bg-primary-900/20",
      textColor: "text-primary-600 dark:text-primary-400",
    },
    {
      title: "Taken Today",
      value: statsSource.todaysTaken,
      icon: CheckCircle,
      color: "bg-success-500",
      bgColor: "bg-success-50 dark:bg-success-900/20",
      textColor: "text-success-600 dark:text-success-400",
    },
    {
      title: "Completion Rate",
      value: `${statsSource.completionRate}%`,
      icon: Clock,
      color: "bg-warning-500",
      bgColor: "bg-warning-50 dark:bg-warning-900/20",
      textColor: "text-warning-600 dark:text-warning-400",
    },
    {
      title: "Missed Today",
      value: statsSource.todaysMissed,
      icon: AlertTriangle,
      color: "bg-danger-500",
      bgColor: "bg-danger-50 dark:bg-danger-900/20",
      textColor: "text-danger-600 dark:text-danger-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className="card hover:shadow-lg transition-all duration-200 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickStats
