import React, { useState } from 'react';
import { Button } from '../components/ui/button';

const FitnessForm = ({ onCreate, setIsOpen }) => {
  const [formData, setFormData] = useState({
    plan_name: '',
    description: '',
    start_date: '',
    duration: 30,
    budget: 2000, // changed from price
    goal: 'lose weight',
    level: 'Beginner',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🧠 Optional: You can call an AI or backend API here based on budget
    // Example:
    // const aiResponse = await axios.post('/api/generate-plan', formData);
    // formData.description = aiResponse.data.description;

    await onCreate(formData);
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-4 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-bold mb-2">Create New Fitness Plan With AI</h3>

      <div>
        <label className="block text-sm font-medium">Plan Name</label>
        <input
          type="text"
          name="plan_name"
          value={formData.plan_name}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          placeholder="(Optional) Describe your preferences or leave it blank for AI to auto-fill."
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Duration (days)</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          min={7}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Your Budget (INR)</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          placeholder="Enter how much you're willing to spend"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Goal</label>
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        >
          <option value="lose weight">Lose Weight</option>
          <option value="gain muscle">Gain Muscle</option>
          <option value="improve endurance">Improve Endurance</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Level</label>
        <select
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Generate Plan</Button>
      </div>
    </form>
  );
};

export default FitnessForm;
