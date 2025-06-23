import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/toast';
import { Calendar, User, Mail } from 'lucide-react';
import axiosInstance from '../redux/axiosConfig';

const BookingForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    class_id: state?.classId || '',
    client_name: '',
    client_email: '',
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
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
        } else {
          toast({
            title: 'Error',
            description: 'Selected class is unavailable or fully booked',
            variant: 'destructive',
          });
        }
      }
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch classes',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.class_id) newErrors.class_id = 'Please select a class';
    if (!formData.client_name.trim()) newErrors.client_name = 'Name is required';
    if (!formData.client_email.trim()) newErrors.client_email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) newErrors.client_email = 'Invalid email format';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axiosInstance.post('/bookings/', formData);
      toast({
        title: 'Success',
        description: 'Booking created successfully',
      });
      navigate('/my-bookings');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.non_field_errors?.join(', ') || 
                       'Failed to create booking';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      setErrors({ ...errors, non_field: errorMsg });
    }
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
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Book a Fitness Class</h2>
        {errors.non_field && (
          <p className="text-red-500 text-sm mb-4 text-center">{errors.non_field}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Calendar className="h-2 h-4 w-4 text-blue-500" /> Class
            </label>
            {selectedClass ? (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-800">
                  {selectedClass.class_type} -{' '}
                  {new Date(selectedClass.date_time).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-sm text-gray-500">{selectedClass.available_slots} slots available</p>
              </div>
            ) : (
              <Select
                name="class_id"
                value={formData.class_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, class_id: value });
                  setErrors({ ...errors, class_id: '' });
                  setSelectedClass(classes.find(c => c.id.toString() === value) || null);
                }}
              >
                <SelectTrigger className={`border ${errors.class_id ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.length === 0 ? (
                    <SelectItem disabled value="none">No classes available</SelectItem>
                  ) : (
                    classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.class_type} - {new Date(cls.date_time).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })} ({cls.available_slots} slots)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
            {errors.class_id && <p className="text-red-500 text-sm">{errors.class_id}</p>}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <User className="h-4 w-4 text-blue-500" /> Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`pl-10 ${errors.client_name ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                required
                aria-label="Your name"
              />
            </div>
            {errors.client_name && <p className="text-red-500 text-sm">{errors.client_name}</p>}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Mail className="h-4 w-4 text-blue-500" /> Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                name="client_email"
                value={formData.client_email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`pl-10 ${errors.client_email ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                required
                aria-label="Your email"
              />
            </div>
            {errors.client_email && <p className="text-red-500 text-sm">{errors.client_email}</p>}
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Book Now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;