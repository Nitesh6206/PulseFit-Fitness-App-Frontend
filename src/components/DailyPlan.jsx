import React from 'react';
import { Flame, Timer, CheckCircle, Dumbbell, Utensils } from 'lucide-react';

const DailyPlan = ({ plan }) => {
  const isGeminiPlan = plan.length && plan[0].exercisePlan !== undefined;

  return (
    <div className="grid gap-4">
      {plan.map((day, index) => {
        const dayNumber = day.day || index + 1;
        const date = day.date;

        return (
          <div key={index} className="border border-gray-200 rounded-lg shadow-sm bg-white">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <p className="font-semibold text-sm text-gray-600">Day {dayNumber}</p>
                <p className="text-gray-800 text-sm">{date}</p>
              </div>

              {/* Status if available */}
              {day.status && (
                <div className={`text-sm font-medium ${day.status === 'completed' ? 'text-green-600' : 'text-gray-400'} flex items-center gap-1`}>
                  {day.status === 'completed' ? <CheckCircle size={16} /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                  {day.status === 'completed' ? 'Completed' : 'Pending'}
                </div>
              )}
            </div>

            <div className="p-4 text-sm space-y-2">
              {isGeminiPlan ? (
                <>
                  <div className="flex items-start gap-2 text-purple-700">
                    <Dumbbell size={16} className="mt-0.5" />
                    <span>{day.exercisePlan}</span>
                  </div>
                  <div className="flex items-start gap-2 text-green-700">
                    <Utensils size={16} className="mt-0.5" />
                    <span>{day.mealPlan}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-orange-600">
                    <Flame size={16} />
                    <span>{day.calories} calories</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Timer size={16} />
                    <span>{day.duration} min</span>
                  </div>
                  <div><strong>Breakfast:</strong> {day.breakfast}</div>
                  <div><strong>Lunch:</strong> {day.lunch}</div>
                  <div><strong>Dinner:</strong> {day.dinner}</div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyPlan;
