"use client"

import { useState } from "react"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import { useMedications } from "../contexts/MedicationContext"
import MedicationModal from "../components/MedicationModal"
import ConfirmModal from "../components/ConfirmModal"
import Toast from "../components/Toast"

const Medications = () => {
  const { medications, loading, deleteMedication } = useMedications()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEnabled, setFilterEnabled] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingMedication, setEditingMedication] = useState(null)
  const [deletingMedication, setDeletingMedication] = useState(null)
  const [toast, setToast] = useState(null)

  const filteredMedications = medications.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterEnabled === "all" ||
      (filterEnabled === "enabled" && med.remindersEnabled) ||
      (filterEnabled === "disabled" && !med.remindersEnabled)

    return matchesSearch && matchesFilter
  })

  const handleEdit = (medication) => {
    setEditingMedication(medication)
    setShowModal(true)
  }

  const handleDelete = async (medication) => {
    const result = await deleteMedication(medication._id)
    if (result.success) {
      setToast({
        type: "success",
        message: "Medication deleted successfully",
      })
    } else {
      setToast({
        type: "error",
        message: result.error,
      })
    }
    setDeletingMedication(null)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingMedication(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Medications</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your medication schedule and reminders</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterEnabled}
              onChange={(e) => setFilterEnabled(e.target.value)}
              className="input min-w-0 w-auto"
            >
              <option value="all">All Medications</option>
              <option value="enabled">Reminders On</option>
              <option value="disabled">Reminders Off</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medications Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMedications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm || filterEnabled !== "all"
              ? "No medications match your search criteria"
              : "No medications added yet"}
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Add Your First Medication
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map((medication, index) => (
            <div
              key={medication._id}
              className="card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{medication.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{medication.dosage}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(medication)}
                    className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingMedication(medication)}
                    className="p-2 text-gray-400 hover:text-danger-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Schedule ({medication.times.length} times/day)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {medication.times.map((time, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-lg"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reminders</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      medication.remindersEnabled
                        ? "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {medication.remindersEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <MedicationModal
          medication={editingMedication}
          onClose={handleModalClose}
          onSuccess={(message) => {
            setToast({ type: "success", message })
            handleModalClose()
          }}
          onError={(message) => {
            setToast({ type: "error", message })
          }}
        />
      )}

      {deletingMedication && (
        <ConfirmModal
          title="Delete Medication"
          message={`Are you sure you want to delete "${deletingMedication.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmClass="btn-danger"
          onConfirm={() => handleDelete(deletingMedication)}
          onCancel={() => setDeletingMedication(null)}
        />
      )}

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Medications
