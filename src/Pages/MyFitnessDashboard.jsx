import React, { useEffect, useState } from 'react';
import DailyPlan from '../components/DailyPlan';
import FitnessForm from '../components/FitnessForm';
import axiosInstance from '../redux/axiosConfig';
import { CalendarDays, Clock, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';

const MyFitnessDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await axiosInstance.get('/fitness-plans/');
      setPlans(res.data);
    };
    fetchPlans();
  }, []);

  const handleCreateNew = () => {
    setIsFormOpen(true);
  };

  const handlePlanCreate = async (newPlanData) => {
    try {
      const res = await axiosInstance.post('/ai-assistance/', newPlanData);
      setPlans(prev => [...prev, res.data]);
    } catch (error) {
      console.error("Failed to create plan", error);
    }
  };

  return (
    <div className="p-6 bg-[#eef2ff] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">🎯 My Fitness Plans</h1>
          <p className="text-gray-600">Track your fitness journey and stay motivated</p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
          Create New Plan With AI
        </Button>
      </div>

      {/* ✅ Dialog-based Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg p-0 bg-transparent border-none">
          <FitnessForm onCreate={handlePlanCreate} setIsOpen={setIsFormOpen} />
        </DialogContent>
      </Dialog>

      {/* ✅ FITNESS PLANS */}
      {plans.map((plan, index) => {
        const completedDays = plan.plan_details.filter(p => p.status === 'completed').length;
        const progressPercent = Math.round((completedDays / plan.plan_details.length) * 100);

        return (
          <div
            key={plan.id}
            className="bg-gradient-to-r from-blue-600 to-purple-500 rounded-xl text-white mb-8 shadow-lg"
          >
            <div className="p-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{plan.plan_name}</h2>
                <p className="text-sm text-white/90">{plan.description}</p>
                <div className="flex gap-6 mt-1 text-sm text-white/80">
                  <span className="flex items-center gap-1"><CalendarDays size={14} /> {plan.start_date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {plan.duration} days</span>
                  <span>{completedDays}/{plan.plan_details.length} days</span>
                </div>
              </div>
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="bg-white/30 px-4 py-1 rounded-full text-sm font-medium"
              >
                {activeIndex === index ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            <div className="px-5 mb-4">
              <div className="w-full bg-white/20 h-2 rounded-full">
                <div className="bg-white h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="text-right text-xs text-white/80 mt-1">{progressPercent}%</div>
            </div>

            {activeIndex === index && (
              <div className="bg-white rounded-b-xl p-4 text-black">
                <DailyPlan plan={plan.plan_details} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyFitnessDashboard;
