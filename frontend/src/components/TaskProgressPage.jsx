// components/TaskProgressPage.jsx
import React, { useEffect, useState } from 'react';
import TaskProgressChart from './TaskProgressChart';

const TaskProgressPage = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?._id) {
      setUserId(storedUser._id);
    }
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">📊 Your Task Progress</h3>
      {userId ? (
        <div className="d-flex justify-content-center">
          <TaskProgressChart userId={userId} />
        </div>
      ) : (
        <p className="text-center text-danger">User not found</p>
      )}
    </div>
  );
};

export default TaskProgressPage;
