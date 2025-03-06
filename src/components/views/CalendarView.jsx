import React, { useContext, useState, useEffect } from 'react';
import { TaskContext } from '../../context/TaskContext';
import TaskForm from '../tasks/TaskForm';

const CalendarView = () => {
  const { tasks, loading, addTask } = useContext(TaskContext);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate days from previous month to fill the first week
    const daysFromPrevMonth = firstDay.getDay() - 1; // -1 because we want Monday as the first day
    
    // Calculate total days to display (including days from prev/next month)
    const totalDays = 42; // 6 weeks * 7 days
    
    // Generate array of date objects
    const days = [];
    
    // Previous month days
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({
        date,
        isCurrentMonth: false,
        tasks: getTasksForDate(date)
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        tasks: getTasksForDate(date)
      });
    }
    
    // Next month days
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        tasks: getTasksForDate(date)
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth, tasks]);

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  // Handle adding a task for the selected date
  const handleAddTask = (task) => {
    addTask({
      ...task,
      dueDate: selectedDate.toISOString()
    });
    setShowForm(false);
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="calendar-view">
      <div className="view-header">
        <h1>Calendar View</h1>
        <div className="month-navigation">
          <button onClick={previousMonth}>&lt;</button>
          <h2>
            {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
          </h2>
          <button onClick={nextMonth}>&gt;</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="calendar-container">
          <div className="calendar-header">
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
            <div className="weekday">Sun</div>
          </div>
          
          <div className="calendar-grid">
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'}`}
                onClick={() => {
                  setSelectedDate(day.date);
                  setShowForm(true);
                }}
              >
                <div className="day-number">{day.date.getDate()}</div>
                <div className="day-tasks">
                  {day.tasks.slice(0, 3).map((task, idx) => (
                    <div key={idx} className="calendar-task" style={{ 
                      backgroundColor: task.priority === 'high' ? '#e74c3c' : 
                                     task.priority === 'medium' ? '#f39c12' : '#3498db'
                    }}>
                      {task.title}
                    </div>
                  ))}
                  {day.tasks.length > 3 && (
                    <div className="more-tasks">+{day.tasks.length - 3} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && selectedDate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm 
              onSubmit={handleAddTask}
              onCancel={() => setShowForm(false)}
              initialDate={selectedDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;