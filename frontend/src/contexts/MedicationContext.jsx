"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { medicationService } from "../services/api"
import { useAuth } from "./AuthContext"

const MedicationContext = createContext()

export const useMedications = () => {
  const context = useContext(MedicationContext)
  if (!context) {
    throw new Error("useMedications must be used within a MedicationProvider")
  }
  return context
}

export const MedicationProvider = ({ children }) => {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(false)
  const { token, isAuthenticated, logout } = useAuth()

  const fetchMedications = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    try {
      const data = await medicationService.getAll(token)
      setMedications(data)
    } catch (error) {
      if (error.message === "Token is not valid") {
        logout()
        // Optionally, show a user-friendly message here (e.g., toast)
      }
      console.error("Failed to fetch medications:", error)
    } finally {
      setLoading(false)
    }
  }

  const addMedication = async (medicationData) => {
    try {
      console.log("[addMedication] Token:", token)
      console.log("[addMedication] Data:", medicationData)
      const newMedication = await medicationService.create(medicationData, token)
      setMedications((prev) => [...prev, newMedication])
      return { success: true }
    } catch (error) {
      console.error("[addMedication] Error:", error)
      return {
        success: false,
        error: error.message || error.response?.data?.message || "Failed to add medication",
      }
    }
  }

  const updateMedication = async (medicationData) => {
    try {
      console.log("[updateMedication] Token:", token)
      console.log("[updateMedication] Data:", medicationData)
      const updatedMedication = await medicationService.update(medicationData, token)
      setMedications((prev) => prev.map((med) => (med._id === updatedMedication._id ? updatedMedication : med)))
      return { success: true }
    } catch (error) {
      console.error("[updateMedication] Error:", error)
      return {
        success: false,
        error: error.message || error.response?.data?.message || "Failed to update medication",
      }
    }
  }

  const deleteMedication = async (id) => {
    try {
      await medicationService.delete(id, token)
      setMedications((prev) => prev.filter((med) => med._id !== id))
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete medication",
      }
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchMedications()
    }
  }, [isAuthenticated])

  const value = {
    medications,
    loading,
    addMedication,
    updateMedication,
    deleteMedication,
    refetch: fetchMedications,
  }

  return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>
}
