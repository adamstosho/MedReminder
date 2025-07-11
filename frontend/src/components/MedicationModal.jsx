"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, Clock, Pill } from "lucide-react"
import { useMedications } from "../contexts/MedicationContext"
import FloatingLabelInput from "./FloatingLabelInput"

const MedicationModal = ({ medication, onClose, onSuccess, onError }) => {
  const { addMedication, updateMedication } = useMedications()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    times: ["08:00"],
    remindersEnabled: true,
  })

  useEffect(() => {
    if (medication) {
      setFormData({
        _id: medication._id,
        name: medication.name,
        dosage: medication.dosage,
        times: medication.times,
        remindersEnabled: medication.remindersEnabled,
      })
    }
  }, [medication])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times]
    newTimes[index] = value
    setFormData((prev) => ({ ...prev, times: newTimes }))
  }

  const addTime = () => {
    setFormData((prev) => ({
      ...prev,
      times: [...prev.times, "12:00"],
    }))
  }

  const removeTime = (index) => {
    if (formData.times.length > 1) {
      setFormData((prev) => ({
        ...prev,
        times: prev.times.filter((_, i) => i !== index),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log("Submitting medication:", formData) 
    try {
      let result
      if (medication) {
        result = await updateMedication(formData)
      } else {
        // Remove _id if present before adding
        const { _id, ...dataToAdd } = formData
        result = await addMedication(dataToAdd)
      }
      if (result.success) {
        onSuccess(medication ? "Medication updated successfully" : "Medication added successfully")
      } else {
        onError(result.error)
      }
    } catch (error) {
      onError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-lg">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {medication ? "Edit Medication" : "Add New Medication"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <FloatingLabelInput
              name="name"
              label="Medication Name"
              value={formData.name}
              onChange={handleChange}
              icon={Pill}
              required
            />

            <FloatingLabelInput
              name="dosage"
              label="Dosage (e.g., 500mg, 1 tablet)"
              value={formData.dosage}
              onChange={handleChange}
              required
            />

            {/* Times */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Reminder Times</label>
              <div className="space-y-3">
                {formData.times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                        className="input pl-10"
                        required
                      />
                    </div>
                    {formData.times.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTime(index)}
                        className="p-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTime}
                  className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Another Time</span>
                </button>
              </div>
            </div>

            {/* Reminders Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Enable Reminders</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when it's time to take this medication
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="remindersEnabled"
                  checked={formData.remindersEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : medication ? "Update" : "Add"} Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MedicationModal
