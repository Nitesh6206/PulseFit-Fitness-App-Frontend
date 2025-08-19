import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Calendar, Users, User, Clock, MapPin, Edit, BookOpen, Activity, TrendingUp } from "lucide-react"
import axiosInstance from "../redux/axiosConfig"
import ClassForm from "../components/classFrom"

const ClassList = () => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/classes/", {
        params: { timezone: "Asia/Kolkata" },
      })
      setClasses(response.data)
    } catch (error) {
      console.error("Failed to fetch classes")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingClass(null)
    setIsFormOpen(true)
  }

  const handleEdit = (cls) => {
    setEditingClass(cls)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    fetchClasses()
    setIsFormOpen(false)
    setEditingClass(null)
  }

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const getAvailabilityStatus = (available, total) => {
    const ratio = available / total
    if (ratio === 0) return { text: "Full", bg: "bg-red-50", color: "text-red-600", border: "border-red-200" }
    if (ratio < 0.3) return { text: "Low", bg: "bg-amber-50", color: "text-amber-600", border: "border-amber-200" }
    return { text: "Available", bg: "bg-green-50", color: "text-green-600", border: "border-green-200" }
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800 border-green-200",
      Intermediate: "bg-amber-100 text-amber-800 border-amber-200",
      Advanced: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[difficulty] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading classes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fitness Classes</h1>
            <p className="text-gray-600">Discover and manage your fitness journey</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Class
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Classes",
              value: classes.length,
              icon: Calendar,
              bgColor: "bg-blue-50",
              iconColor: "text-blue-600",
            },
            {
              title: "Available Spots",
              value: classes.reduce((sum, cls) => sum + cls.available_slots, 0),
              icon: Users,
              bgColor: "bg-green-50",
              iconColor: "text-green-600",
            },
            {
              title: "Active Instructors",
              value: new Set(classes.map((cls) => cls.instructor)).size,
              icon: User,
              bgColor: "bg-purple-50",
              iconColor: "text-purple-600",
            },
            {
              title: "This Week",
              value: classes.filter((cls) => {
                const classDate = new Date(cls.date_time)
                const now = new Date()
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                return classDate >= now && classDate <= weekFromNow
              }).length,
              icon: TrendingUp,
              bgColor: "bg-orange-50",
              iconColor: "text-orange-600",
            },
          ].map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {classes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating your first fitness class. Build your schedule and help others achieve their
              fitness goals.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create First Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {classes.map((cls) => {
              const { date, time } = formatDateTime(cls.date_time)
              const availability = getAvailabilityStatus(cls.available_slots, cls.total_slots)

              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="bg-gray-900 text-white p-6 rounded-t-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{cls.class_type}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(cls.difficulty)}`}
                      >
                        {cls.difficulty || "N/A"}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{cls.duration} minutes</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Instructor</p>
                          <p className="font-semibold text-gray-900">{cls.instructor}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Schedule</p>
                          <p className="font-semibold text-gray-900">{date}</p>
                          <p className="text-sm text-gray-600">{time}</p>
                        </div>
                      </div>

                      {cls.Location && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
                            <p className="font-semibold text-gray-900">{cls.Location}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between p-4 ${availability.bg} ${availability.border} border rounded-lg`}
                    >
                      <div>
                        <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Available Spots</p>
                        <p className="text-lg font-bold text-gray-900">
                          {cls.available_slots}/{cls.total_slots}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${availability.color} bg-white border ${availability.border}`}
                      >
                        {availability.text}
                      </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleEdit(cls)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        disabled={cls.available_slots === 0}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                          cls.available_slots === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        }`}
                        onClick={() => navigate(`/book-class`, { state: { classId: cls.id } })}
                      >
                        <BookOpen className="w-4 h-4" />
                        {cls.available_slots === 0 ? "Full" : "Book Now"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <ClassForm editingClass={editingClass} onSuccess={handleFormSuccess} setIsOpen={setIsFormOpen} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassList
