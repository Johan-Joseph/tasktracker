import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskAnalytics = () => {
  const [taskStats, setTaskStats] = useState({ todo: 0, inProgress: 0, done: 0 });

  useEffect(() => {
    axios.get('http://localhost:4000/api/tasks')
      .then(res => {
        const tasks = res.data;
        const stats = {
          todo: tasks.filter(task => task.status === 'To Do').length,
          inProgress: tasks.filter(task => task.status === 'In Progress').length,
          done: tasks.filter(task => task.status === 'Done').length,
        };
        setTaskStats(stats);
      })
      .catch(err => console.error('Failed to fetch tasks:', err));
  }, []);

  const chartData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [taskStats.todo, taskStats.inProgress, taskStats.done],
        backgroundColor: ['#ffc107', '#0d6efd', '#198754'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-5 text-center">
      <h3 className="mb-4">📈 Task Progress Overview</h3>
      <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default TaskAnalytics;
