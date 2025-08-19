import React, { useEffect, useState } from 'react';
import DailyPlan from '../components/DailyPlan';
import FitnessForm from '../components/FitnessForm';
import axiosInstance from '../redux/axiosConfig';
import { CalendarDays, Clock, Plus, Target, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <CHANGE> Professional header with clean typography and subtle branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Fitness Plans</h1>
            </div>
            <p className="text-gray-600 text-lg">Track your progress and achieve your fitness goals</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            Create New Plan
          </Button>
        </div>

        {/* <CHANGE> Added professional stats overview */}
        {plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Days</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.reduce((total, plan) => 
                      total + plan.plan_details.filter(p => p.status === 'completed').length, 0
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.filter(plan => 
                      plan.plan_details.some(p => p.status !== 'completed')
                    ).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg p-0 bg-transparent border-none">
            <FitnessForm onCreate={handlePlanCreate} setIsOpen={setIsFormOpen} />
          </DialogContent>
        </Dialog>

        {/* <CHANGE> Professional plan cards with clean design */}
        <div className="space-y-6">
          {plans.map((plan, index) => {
            const completedDays = plan.plan_details.filter(p => p.status === 'completed').length;
            const progressPercent = Math.round((completedDays / plan.plan_details.length) * 100);

            return (
              <div
                key={plan.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{plan.plan_name}</h2>
                      <p className="text-gray-600 mb-3">{plan.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          Started {plan.start_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {plan.duration} days
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {completedDays}/{plan.plan_details.length} completed
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      {activeIndex === index ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  {/* <CHANGE> Clean progress bar design */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {activeIndex === index && (
                    <div className="border-t border-gray-200 pt-6">
                      <DailyPlan plan={plan.plan_details} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* <CHANGE> Professional empty state */}
        {plans.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No fitness plans yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first AI-powered fitness plan to start tracking your progress and achieving your goals.
            </p>
            <Button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              <Plus className="h-5 w-5" />
              Create Your First Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFitnessDashboard;
