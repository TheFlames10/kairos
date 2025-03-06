import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Layout from './components/layout/Layout';

// View Components
import BacklogView from './components/views/BacklogView';
import WeekView from './components/views/WeekView';
import CalendarView from './components/views/CalendarView';
import ScheduleView from './components/views/ScheduleView';

// Context Provider
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <TaskProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<WeekView />} />
            <Route path="/backlog" element={<BacklogView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/schedule" element={<ScheduleView />} />
          </Routes>
        </Layout>
      </Router>
    </TaskProvider>
  );
}

export default App;