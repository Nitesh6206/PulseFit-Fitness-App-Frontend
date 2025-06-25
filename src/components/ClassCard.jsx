import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/toast';
import { Plus, Calendar, Users, User, Clock, MapPin, Edit, BookOpen } from 'lucide-react';
import axiosInstance from '../redux/axiosConfig';
import ClassForm from './classFrom';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const { toast } = useToast();
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
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch classes',
        variant: 'destructive',
      });
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
    if (ratio === 0) return { text: 'Full', bg: 'bg-red-100', color: 'text-red-600' };
    if (ratio < 0.3) return { text: 'Low', bg: 'bg-yellow-100', color: 'text-yellow-600' };
    return { text: 'Available', bg: 'bg-green-100', color: 'text-green-600' };
  };

  const getClassColor = (name) => {
    const colors = {
      YOGA: 'from-blue-500 to-indigo-500',
      ZUMBA: 'from-pink-500 to-purple-500',
      HIIT: 'from-red-500 to-orange-500',
    };
    return colors[name] || 'from-gray-500 to-gray-600';
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
      Beginner: 'bg-green-500',
      Intermediate: 'bg-yellow-500',
      Advanced: 'bg-red-500',
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        {/* Header Section */}
         <Button
              onClick={handleCreateNew}
              className="flex justify-end items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Create new fitness class"
            >
              <Plus className="h-5 w-5" />
              Create New Class
            </Button>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in">
          {[
            { title: 'Total Classes', value: classes.length, icon: Calendar, color: 'blue' },
            {
              title: 'Available Spots',
              value: classes.reduce((sum, cls) => sum + cls.available_slots, 0),
              icon: Users,
              color: 'green',
            },
            {
              title: 'Active Instructors',
              value: new Set(classes.map((cls) => cls.instructor)).size,
              icon: User,
              color: 'purple',
            },
          ].map((stat) => (
            <Card
              key={stat.title}
              className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                    <stat.icon className={`text-${stat.color}-600 h-6 w-6`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Classes Available</h3>
            <p className="text-gray-600 mb-6">Create your first fitness class to get started!</p>
            <Button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Create First Class
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {classes.map((cls) => {
              const { date, time } = formatDateTime(cls.date_time);
              const availability = getAvailabilityStatus(cls.available_slots, cls.total_slots);

              return (
                <Card
                  key={cls.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className={`bg-gradient-to-r ${getClassColor(cls.name)} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{getClassIcon(cls.name)}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(cls.difficulty)} text-white`}
                        >
                          {cls.difficulty || 'N/A'}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-white mb-1">{cls.class_type}</CardTitle>
                      <p className="text-white/90 text-sm">{cls.duration} minutes</p>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Instructor</p>
                        <p className="font-semibold text-gray-900">{cls.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Schedule</p>
                        <p className="font-semibold text-gray-900">{date} at {time}</p>
                      </div>
                    </div>
                    {cls.Location && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <MapPin className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">{cls.Location}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600">Available Spots</p>
                        <p className="text-lg font-bold text-gray-900">{cls.available_slots}/{cls.total_slots}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${availability.bg} ${availability.color}`}>
                        {availability.text}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleEdit(cls)}
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                        aria-label={`Edit ${cls.class_type} class`}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        disabled={cls.available_slots === 0}
                        className={`flex-1 flex items-center justify-center gap-2 ${
                          cls.available_slots === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        }`}
                        onClick={() => navigate(`/book-class`, { state: { classId: cls.id } })}
                        aria-label={`Book ${cls.class_type} class`}
                      >
                        <BookOpen className="h-4 w-4" />
                        {cls.available_slots === 0 ? 'Full' : 'Book Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg p-0 bg-transparent border-none">
            <ClassForm
              editingClass={editingClass}
              onSuccess={handleFormSuccess}
              setIsOpen={setIsFormOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClassList;