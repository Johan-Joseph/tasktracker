import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const TaskProgressChart = ({ userId }) => {
  const [data, setData] = useState({ ToDo: 0, InProgress: 0, Done: 0 });

  useEffect(() => {
    if (userId) fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    const res = await axios.get(`http://localhost:4000/api/tasks/user/${userId}`);
    const counts = { ToDo: 0, InProgress: 0, Done: 0 };
    res.data.forEach(task => {
      if (task.status === 'To Do') counts.ToDo++;
      else if (task.status === 'In Progress') counts.InProgress++;
      else if (task.status === 'Done') counts.Done++;
    });
    setData(counts);
  };

  const chartData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Tasks',
        data: [data.ToDo, data.InProgress, data.Done],
        backgroundColor: ['#f39c12', '#3498db', '#2ecc71'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card">
  <div className="card-header">Task Progress Overview</div>
  <div className="card-body d-flex justify-content-center">
    <div style={{ width: '250px', height: '250px' }}>
      <Pie data={chartData} />
    </div>
  </div>
</div>
  );
};

export default TaskProgressChart;