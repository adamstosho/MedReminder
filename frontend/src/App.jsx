import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { MedicationProvider } from "./contexts/MedicationContext"
import { LogProvider } from "./contexts/LogContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Medications from "./pages/Medications"
import Logs from "./pages/Logs"
import Settings from "./pages/Settings"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MedicationProvider>
          <LogProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="medications" element={<Medications />} />
                    <Route path="logs" element={<Logs />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </LogProvider>
        </MedicationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
