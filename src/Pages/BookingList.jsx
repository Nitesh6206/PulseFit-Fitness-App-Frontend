import { useState, useEffect } from 'react';
import axiosInstance from '../redux/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Trash2, ArrowLeft, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBookingsDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/bookings/');
      setBookings(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsDetails();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axiosInstance.delete('/bookings/', {
        data: { id: bookingId },
      });
      fetchBookingsDetails();
    } catch (error) {
      console.error('Failed to cancel booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your fitness class reservations</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your bookings...</p>
            </div>
          </div>
        ) : bookings.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't booked any classes yet. Browse our available classes and reserve your spot today!
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Calendar className="w-5 h-5" />
              Browse Classes
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6" />
                    <h3 className="text-xl font-bold">
                      {booking.fitness_class_details?.class_type || 'N/A'}
                    </h3>
                  </div>
                  <p className="text-indigo-100 text-sm">
                    Booking ID: #{booking.id}
                  </p>
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
                      <p className="font-semibold text-gray-900">
                        {booking.fitness_class_details?.instructor || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Date & Time</p>
                      <p className="font-semibold text-gray-900">
                        {booking.fitness_class_details?.date_time
                          ? new Date(booking.fitness_class_details.date_time).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Booked by */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium mb-1">Booked by</p>
                    <p className="font-semibold text-gray-900">{booking.client_name}</p>
                    <p className="text-sm text-gray-600">{booking.client_email}</p>
                  </div>

                  {/* Cancel Button */}
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel Booking
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingList;
