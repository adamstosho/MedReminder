"use client"
import { NavLink, useLocation } from "react-router-dom"
import { Home, Pill, FileText, Settings, Menu, X, LogOut, Moon, Sun } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"

const Navigation = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/medications", icon: Pill, label: "Medications" },
    { path: "/logs", icon: FileText, label: "Logs" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ]

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.path}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-primary-500 text-white shadow-lg"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      <item.icon className="w-5 h-5" />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">MedReminder</h1>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-80 h-full shadow-xl animate-slide-down">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">MedReminder</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavItem key={item.path} item={item} mobile />
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
                </button>

                <button
                  onClick={logout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">MedReminder</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user?.name}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation
