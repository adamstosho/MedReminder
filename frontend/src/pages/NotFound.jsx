"use client"
import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/dashboard" className="btn-primary flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>

          <button onClick={() => window.history.back()} className="btn-secondary flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
