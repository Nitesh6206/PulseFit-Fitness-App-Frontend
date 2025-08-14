import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, CheckCircle } from 'lucide-react';
import axiosInstance from '../redux/axiosConfig';
import { motion } from 'framer-motion';

const BookingForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    class_id: state?.classId || '',
    slots: 1,
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get('/classes/', {
        params: { timezone: 'Asia/Kolkata' },
      });
      const availableClasses = response.data.filter(cls => cls.available_slots > 0);
      setClasses(availableClasses);
      
      if (state?.classId) {
        const cls = availableClasses.find(c => c.id.toString() === state.classId.toString());
        if (cls) {
          setSelectedClass(cls);
          setFormData(prev => ({ ...prev, class_id: cls.id.toString() }));
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch classes');
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.class_id) newErrors.class_id = 'Please select a class';
    if (!formData.slots || formData.slots < 1) newErrors.slots = 'Please enter a valid number of slots';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post('/bookings/', {
        class_id: formData.class_id,
        slots: formData.slots,
      });
      navigate('/my-bookings');
    } catch (error) {
      const errorMsg = error.response?.data?.error ||
        error.response?.data?.non_field_errors?.join(', ') ||
        'Failed to create booking';
      setErrors({ ...errors, non_field: errorMsg });
    } finally {
      setSubmitting(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Classes
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book a Class</h1>
            <p className="text-gray-600">Reserve your spot in a fitness class</p>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          {/* Error Message */}
          {errors.non_field && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-center">{errors.non_field}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Class Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Select Class
              </label>
              
              {selectedClass ? (
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedClass.class_type}</h3>
                      <p className="text-gray-600 mb-2">
                        {new Date(selectedClass.date_time).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        Instructor: {selectedClass.instructor}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Available</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {selectedClass.available_slots}
                      </p>
                      <p className="text-xs text-gray-500">spots left</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    name="class_id"
                    value={formData.class_id}
                    onChange={(e) => {
                      setFormData({ ...formData, class_id: e.target.value });
                      setErrors({ ...errors, class_id: '' });
                      setSelectedClass(classes.find(c => c.id.toString() === e.target.value) || null);
                    }}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.class_id ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option value="">Choose a class...</option>
                    {classes.length === 0 ? (
                      <option disabled>No classes available</option>
                    ) : (
                      classes.map((cls) => (
                        <option key={cls.id} value={cls.id.toString()}>
                          {cls.class_type} - {new Date(cls.date_time).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })} ({cls.available_slots} slots)
                        </option>
                      ))
                    )}
                  </select>
                  {errors.class_id && (
                    <p className="text-red-500 text-sm">{errors.class_id}</p>
                  )}
                </div>
              )}
            </div>

            {/* Slots Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 text-indigo-500" />
                Number of Slots
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="slots"
                  min="1"
                  max={selectedClass?.available_slots || 10}
                  value={formData.slots}
                  onChange={(e) => setFormData({ ...formData, slots: Number(e.target.value) })}
                  placeholder="Enter number of slots"
                  className={`w-full px-4 py-3 pl-12 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.slots ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  required
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.slots && (
                <p className="text-red-500 text-sm">{errors.slots}</p>
              )}
              {selectedClass && (
                <p className="text-sm text-gray-500">
                  Maximum {selectedClass.available_slots} slots available
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 text-gray-600 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                  submitting ? 'opacity-50 cursor-not-allowed transform-none' : 'hover:from-indigo-600 hover:to-purple-700'
                }`}
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Booking...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Book Now
                  </div>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingForm;
