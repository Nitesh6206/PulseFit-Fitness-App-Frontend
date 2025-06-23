import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from './ui/toast';
import { Calendar, User, MapPin, Clock } from 'lucide-react';
import axiosInstance from '../redux/axiosConfig';

const ClassForm = ({ editingClass, onSuccess, setIsOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    date_time: '',
    duration: '',
    instructor: '',
    total_slots: '',
    difficulty: '',
    Location: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingClass || id) {
      fetchClass();
    }
  }, [editingClass, id]);

  const fetchClass = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/classes/${editingClass?.id || id}/`);
      setFormData({
        name: response.data.name,
        date_time: new Date(response.data.date_time).toISOString().slice(0, 16),
        duration: response.data.duration || '',
        instructor: response.data.instructor,
        total_slots: response.data.total_slots,
        difficulty: response.data.difficulty || '',
        Location: response.data.Location || '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch class details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Class type is required';
    if (!formData.date_time) newErrors.date_time = 'Date and time are required';
    else if (new Date(formData.date_time) < new Date()) newErrors.date_time = 'Date and time must be in the future';
    if (!formData.instructor) newErrors.instructor = 'Instructor is required';
    if (!formData.total_slots || formData.total_slots < 1) newErrors.total_slots = 'Total slots must be at least 1';
    if (!formData.duration || formData.duration < 1) newErrors.duration = 'Duration must be at least 1 minute';
    if (!formData.difficulty) newErrors.difficulty = 'Difficulty level is required';
    if (!formData.Location) newErrors.Location = 'Location is required';
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
      setLoading(true);
      const payload = {
        ...formData,
        date_time: new Date(formData.date_time).toISOString(), // Ensure ISO 8601 format
      };
      if (editingClass || id) {
        await axiosInstance.put(`/classes/${editingClass?.id || id}/`, payload);
        toast({
          title: 'Success',
          description: 'Class updated successfully',
        });
      } else {
        await axiosInstance.post('/classes/', payload);
        toast({
          title: 'Success',
          description: 'Class created successfully',
        });
      }
      onSuccess();
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 
                       Object.values(error.response?.data || {}).flat().join(', ') || 
                       'Failed to save class';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      setErrors({ ...errors, non_field: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto animate-fade-in">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-900">
          {editingClass || id ? 'Edit Fitness Class' : 'Create New Fitness Class'}
        </DialogTitle>
      </DialogHeader>
      {errors.non_field && (
        <p className="text-red-500 text-sm mb-4 text-center">{errors.non_field}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Calendar className="h-4 w-4 text-blue-500" /> Class Type
          </label>
          <Select
            name="name"
            value={formData.name}
            onValueChange={(value) => {
              setFormData({ ...formData, name: value });
              setErrors({ ...errors, name: '' });
            }}
          >
            <SelectTrigger className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}>
              <SelectValue placeholder="Select class type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YOGA">🧘‍♀️ Yoga</SelectItem>
              <SelectItem value="ZUMBA">💃 Zumba</SelectItem>
              <SelectItem value="HIIT">🔥 HIIT</SelectItem>
            </SelectContent>
          </Select>
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Calendar className="h-4 w-4 text-blue-500" /> Date & Time
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="datetime-local"
                name="date_time"
                value={formData.date_time}
                onChange={handleChange}
                className={`pl-10 ${errors.date_time ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                aria-label="Date and time"
              />
            </div>
            {errors.date_time && <p className="text-red-500 text-sm">{errors.date_time}</p>}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Clock className="h-4 w-4 text-blue-500" /> Duration (min)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="60"
                min="1"
                className={`pl-10 ${errors.duration ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                aria-label="Duration in minutes"
              />
            </div>
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <User className="h-4 w-4 text-blue-500" /> Instructor
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="Enter instructor name"
              className={`pl-10 ${errors.instructor ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
              aria-label="Instructor name"
            />
          </div>
          {errors.instructor && <p className="text-red-500 text-sm">{errors.instructor}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <User className="h-4 w-4 text-blue-500" /> Total Slots
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="number"
                name="total_slots"
                value={formData.total_slots}
                onChange={handleChange}
                min="1"
                placeholder="15"
                className={`pl-10 ${errors.total_slots ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                aria-label="Total slots"
              />
            </div>
            {errors.total_slots && <p className="text-red-500 text-sm">{errors.total_slots}</p>}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <User className="h-4 w-4 text-blue-500" /> Difficulty
            </label>
            <Select
              name="difficulty"
              value={formData.difficulty}
              onValueChange={(value) => {
                setFormData({ ...formData, difficulty: value });
                setErrors({ ...errors, difficulty: '' });
              }}
            >
              <SelectTrigger className={`border ${errors.difficulty ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <MapPin className="h-4 w-4 text-blue-500" /> Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              name="Location"
              value={formData.Location}
              onChange={handleChange}
              placeholder="Studio A, Gym Floor, etc."
              className={`pl-10 ${errors.Location ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
              aria-label="Location"
            />
          </div>
          {errors.Location && <p className="text-red-500 text-sm">{errors.Location}</p>}
        </div>
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            disabled={loading}
          >
            {loading ? 'Saving...' : editingClass || id ? 'Update Class' : 'Create Class'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;