"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, User, MapPin, Clock, X } from "lucide-react"
import axiosInstance from "../redux/axiosConfig"
import { motion } from "framer-motion"

const ClassForm = ({ editingClass, onSuccess, setIsOpen }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    date_time: "",
    duration: "",
    instructor: "",
    total_slots: "",
    difficulty: "",
    Location: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editingClass || id) {
      fetchClass()
    }
  }, [editingClass, id])

  const fetchClass = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/classes/${editingClass?.id || id}/`)
      setFormData({
        name: response.data.name,
        date_time: new Date(response.data.date_time).toISOString().slice(0, 16),
        duration: response.data.duration || "",
        instructor: response.data.instructor,
        total_slots: response.data.total_slots,
        difficulty: response.data.difficulty || "",
        Location: response.data.Location || "",
      })
    } catch (error) {
      console.error("Failed to fetch class details")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: "" })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = "Class type is required"
    if (!formData.date_time) newErrors.date_time = "Date and time are required"
    else if (new Date(formData.date_time) < new Date()) newErrors.date_time = "Date and time must be in the future"
    if (!formData.instructor) newErrors.instructor = "Instructor is required"
    if (!formData.total_slots || formData.total_slots < 1) newErrors.total_slots = "Total slots must be at least 1"
    if (!formData.duration || formData.duration < 1) newErrors.duration = "Duration must be at least 1 minute"
    if (!formData.difficulty) newErrors.difficulty = "Difficulty level is required"
    if (!formData.Location) newErrors.Location = "Location is required"
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        ...formData,
        date_time: new Date(formData.date_time).toISOString(),
      }

      if (editingClass || id) {
        await axiosInstance.put(`/classes/${editingClass?.id || id}/`, payload)
      } else {
        await axiosInstance.post("/classes/", payload)
      }

      onSuccess()
      setIsOpen(false)
      navigate("/")
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        Object.values(error.response?.data || {})
          .flat()
          .join(", ") ||
        "Failed to save class"
      setErrors({ ...errors, non_field: errorMsg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {editingClass || id ? "Edit Fitness Class" : "Create New Fitness Class"}
          </h2>
          <p className="text-gray-600 mt-1">Fill in the details for your fitness class</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Error Message */}
      {errors.non_field && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-center">{errors.non_field}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Type */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Class Type
          </label>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none ${
              errors.name ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <option value="">Select class type</option>
            <option value="YOGA">🧘‍♀️ Yoga</option>
            <option value="ZUMBA">💃 Zumba</option>
            <option value="HIIT">🔥 HIIT</option>
          </select>
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Date & Time and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Date & Time
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                name="date_time"
                value={formData.date_time}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-12 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.date_time ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
              />
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.date_time && <p className="text-red-500 text-sm">{errors.date_time}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Clock className="w-4 h-4 text-indigo-500" />
              Duration (minutes)
            </label>
            <div className="relative">
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="60"
                min="1"
                className={`w-full px-4 py-3 pl-12 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.duration ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
              />
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
          </div>
        </div>

        {/* Instructor */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <User className="w-4 h-4 text-indigo-500" />
            Instructor
          </label>
          <div className="relative">
            <input
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="Enter instructor name"
              className={`w-full px-4 py-3 pl-12 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.instructor ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.instructor && <p className="text-red-500 text-sm">{errors.instructor}</p>}
        </div>

        {/* Total Slots and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 text-indigo-500" />
              Total Slots
            </label>
            <div className="relative">
              <input
                type="number"
                name="total_slots"
                value={formData.total_slots}
                onChange={handleChange}
                min="1"
                placeholder="15"
                className={`w-full px-4 py-3 pl-12 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.total_slots ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
                }`}
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.total_slots && <p className="text-red-500 text-sm">{errors.total_slots}</p>}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="w-4 h-4 text-indigo-500" />
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none ${
                errors.difficulty ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty}</p>}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin className="w-4 h-4 text-indigo-500" />
            Location
          </label>
          <div className="relative">
            <input
              name="Location"
              value={formData.Location}
              onChange={handleChange}
              placeholder="Studio A, Gym Floor, etc."
              className={`w-full px-4 py-3 pl-12 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                errors.Location ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            />
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {errors.Location && <p className="text-red-500 text-sm">{errors.Location}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 px-6 py-3 text-gray-600 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
              submitting ? "opacity-50 cursor-not-allowed transform-none" : "hover:from-indigo-600 hover:to-purple-700"
            }`}
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : editingClass || id ? (
              "Update Class"
            ) : (
              "Create Class"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default ClassForm
