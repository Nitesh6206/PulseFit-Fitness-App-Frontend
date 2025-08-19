import { useState } from "react"
import { Calendar, Target, TrendingUp, DollarSign, FileText, X } from "lucide-react"
import { motion } from "framer-motion"

const FitnessForm = ({ onCreate, setIsOpen }) => {
  const [formData, setFormData] = useState({
    plan_name: "",
    description: "",
    start_date: "",
    duration: 30,
    budget: 2000,
    goal: "lose weight",
    level: "Beginner",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onCreate(formData);
    if (setIsOpen) setIsOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create AI Fitness Plan</h2>
          <p className="text-gray-600 mt-1">Let AI design your personalized fitness journey</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plan Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4 text-indigo-500" />
            Plan Name
          </label>
          <input
            type="text"
            name="plan_name"
            value={formData.plan_name}
            onChange={handleChange}
            placeholder="My Fitness Journey"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4 text-indigo-500" />
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your preferences, dietary restrictions, or specific goals..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 resize-none"
          />
          <p className="text-xs text-gray-500">Leave blank for AI to auto-generate based on your selections</p>
        </div>

        {/* Start Date and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Duration (days)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min={7}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            Budget (INR)
          </label>
          <div className="relative">
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="2000"
              className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            />
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">This helps AI suggest appropriate meal plans and equipment</p>
        </div>

        {/* Goal and Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Target className="w-4 h-4 text-indigo-500" />
              Fitness Goal
            </label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none"
            >
              <option value="lose weight">🔥 Lose Weight</option>
              <option value="gain muscle">💪 Gain Muscle</option>
              <option value="improve endurance">🏃 Improve Endurance</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Fitness Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 appearance-none"
            >
              <option value="Beginner">🌱 Beginner</option>
              <option value="Intermediate">🌿 Intermediate</option>
              <option value="Advanced">🌳 Advanced</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700"
          >
            <div className="flex items-center justify-center gap-2">
              <span>✨</span>
              Generate AI Plan
            </div>
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default FitnessForm
