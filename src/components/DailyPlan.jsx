"use client"
import { Flame, Timer, CheckCircle, Dumbbell, Utensils, Calendar } from 'lucide-react'
import { motion } from "framer-motion"

const DailyPlan = ({ plan }) => {
  const isGeminiPlan = plan.length && plan[0].exercisePlan !== undefined

  return (
    <div className="grid gap-6">
      {plan.map((day, index) => {
        const dayNumber = day.day || index + 1
        const date = day.date
        const isCompleted = day.status === "completed"

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 ${
              isCompleted ? "border-green-200 bg-green-50/30" : "border-gray-200"
            }`}
          >
            {/* <CHANGE> Professional header with subtle colors */}
            <div
              className={`p-6 ${isCompleted ? "bg-green-600" : "bg-slate-700"} text-white`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Day {dayNumber}</h3>
                    <p className="text-white/80">{date}</p>
                  </div>
                </div>
                {day.status && (
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-md ${
                      isCompleted ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 bg-white/50 rounded-full" />
                    )}
                    <span className="text-sm font-medium">{isCompleted ? "Completed" : "Pending"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isGeminiPlan ? (
                <div className="space-y-4">
                  {/* <CHANGE> Professional exercise plan section */}
                  <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Dumbbell className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Exercise Plan</h4>
                      <p className="text-slate-700 text-sm leading-relaxed">{day.exercisePlan}</p>
                    </div>
                  </div>

                  {/* <CHANGE> Professional meal plan section */}
                  <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">Meal Plan</h4>
                      <p className="text-slate-700 text-sm leading-relaxed">{day.mealPlan}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* <CHANGE> Professional stats with clean styling */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-md">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-700 font-medium text-sm">{day.calories} calories</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                      <Timer className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 font-medium text-sm">{day.duration} min</span>
                    </div>
                  </div>

                  {/* <CHANGE> Clean meal sections without emojis */}
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-1">Breakfast</h4>
                      <p className="text-gray-700 text-sm">{day.breakfast}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-1">Lunch</h4>
                      <p className="text-gray-700 text-sm">{day.lunch}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-1">Dinner</h4>
                      <p className="text-gray-700 text-sm">{day.dinner}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default DailyPlan
