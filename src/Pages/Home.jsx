import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, User, Clock, MapPin, Edit, BookOpen, Activity, TrendingUp } from 'lucide-react';
import axiosInstance from '../redux/axiosConfig';
import ClassForm from '../components/classFrom';
import { motion } from 'framer-motion';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/classes/', {
        params: { timezone: 'Asia/Kolkata' },
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingClass(null);
    setIsFormOpen(true);
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchClasses();
    setIsFormOpen(false);
    setEditingClass(null);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getAvailabilityStatus = (available, total) => {
    const ratio = available / total;
    if (ratio === 0) return { text: 'Full', bg: 'bg-red-100', color: 'text-red-600', border: 'border-red-200' };
    if (ratio < 0.3) return { text: 'Low', bg: 'bg-amber-100', color: 'text-amber-600', border: 'border-amber-200' };
    return { text: 'Available', bg: 'bg-emerald-100', color: 'text-emerald-600', border: 'border-emerald-200' };
  };

  const getClassColor = (name) => {
    const colors = {
      YOGA: 'from-blue-500 to-indigo-600',
      ZUMBA: 'from-pink-500 to-rose-600',
      HIIT: 'from-orange-500 to-red-600',
    };
    return colors[name] || 'from-gray-500 to-gray-700';
  };

  const getClassIcon = (name) => {
    const icons = {
      YOGA: '🧘‍♀️',
      ZUMBA: '💃',
      HIIT: '🔥',
    };
    return icons[name] || '🏋️';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: 'bg-emerald-500 text-white',
      Intermediate: 'bg-amber-500 text-white',
      Advanced: 'bg-red-500 text-white',
    };
    return colors[difficulty] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Fitness Classes</h1>
            <p className="text-gray-600">Discover and manage your fitness journey</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create New Class
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: 'Total Classes', 
              value: classes.length, 
              icon: Calendar, 
              color: 'from-blue-500 to-blue-600',
              bgColor: 'bg-blue-50',
              iconColor: 'text-blue-600'
            },
            {
              title: 'Available Spots',
              value: classes.reduce((sum, cls) => sum + cls.available_slots, 0),
              icon: Users,
              color: 'from-emerald-500 to-emerald-600',
              bgColor: 'bg-emerald-50',
              iconColor: 'text-emerald-600'
            },
            {
              title: 'Active Instructors',
              value: new Set(classes.map((cls) => cls.instructor)).size,
              icon: User,
              color: 'from-purple-500 to-purple-600',
              bgColor: 'bg-purple-50',
              iconColor: 'text-purple-600'
            },
            {
              title: 'This Week',
              value: classes.filter(cls => {
                const classDate = new Date(cls.date_time);
                const now = new Date();
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return classDate >= now && classDate <= weekFromNow;
              }).length,
              icon: TrendingUp,
              color: 'from-amber-500 to-amber-600',
              bgColor: 'bg-amber-50',
              iconColor: 'text-amber-600'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Classes Available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating your first fitness class. Build your schedule and help others achieve their fitness goals.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Create First Class
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {classes.map((cls, index) => {
              const { date, time } = formatDateTime(cls.date_time);
              const availability = getAvailabilityStatus(cls.available_slots, cls.total_slots);
              
              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${getClassColor(cls.name)} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{getClassIcon(cls.name)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(cls.difficulty)}`}>
                          {cls.difficulty || 'N/A'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{cls.class_type}</h3>
                      <p className="text-white/90 text-sm font-medium">{cls.duration} minutes</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Instructor</p>
                        <p className="font-semibold text-gray-900">{cls.instructor}</p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Schedule</p>
                        <p className="font-semibold text-gray-900">{date}</p>
                        <p className="text-sm text-gray-600">{time}</p>
                      </div>
                    </div>

                    {/* Location */}
                    {cls.Location && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Location</p>
                          <p className="font-semibold text-gray-900">{cls.Location}</p>
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    <div className={`flex items-center justify-between p-4 ${availability.bg} ${availability.border} border rounded-xl`}>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Available Spots</p>
                        <p className="text-lg font-bold text-gray-900">
                          {cls.available_slots}/{cls.total_slots}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${availability.color} bg-white border ${availability.border}`}>
                        {availability.text}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleEdit(cls)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        disabled={cls.available_slots === 0}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                          cls.available_slots === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                        onClick={() => navigate(`/book-class`, { state: { classId: cls.id } })}
                      >
                        <BookOpen className="w-4 h-4" />
                        {cls.available_slots === 0 ? 'Full' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <ClassForm
                editingClass={editingClass}
                onSuccess={handleFormSuccess}
                setIsOpen={setIsFormOpen}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassList;
