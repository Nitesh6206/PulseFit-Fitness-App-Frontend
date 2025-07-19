import { useState, useEffect } from 'react';
import axiosInstance from '../redux/axiosConfig';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/toast';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Trash2 } from 'lucide-react';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchBookingsDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/bookings/');
      setBookings(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch bookings');
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch bookings',
        variant: 'destructive',
      });
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
      toast({
        title: 'Success',
        description: 'Booking cancelled successfully',
      });
      fetchBookingsDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to cancel booking',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Back to Classes
            </Button>
          <div className="flex justify-center items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900">My Bookings</h2>
          </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 && !error ? (
          <div className="text-center py-16 animate-fade-in">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">Book a class to get started!</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Browse Classes
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" /> {booking.fitness_class_details?.class_type || 'N/A'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <p className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Instructor:</span> {booking.fitness_class_details?.instructor || 'N/A'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Date:</span>
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
                  <p className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Booked by:</span> {booking.client_name} ({booking.client_email})
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleCancel(booking.id)}
                    aria-label={`Cancel booking for ${booking.fitness_class_details?.class_type}`}
                  >
                    <Trash2 className="h-4 w-4" /> Cancel Booking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default BookingList;