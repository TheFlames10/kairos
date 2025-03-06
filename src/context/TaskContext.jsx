import React, { createContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  tasks: [],
  backlog: [],
  dailyTasks: {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  },
  schedules: [],
  loading: false,
  error: null
};

// Create context
export const TaskContext = createContext(initialState);

// Types for reducer actions
const FETCH_TASKS = 'FETCH_TASKS';
const ADD_TASK = 'ADD_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';
const MOVE_TASK = 'MOVE_TASK';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const ADD_SCHEDULE = 'ADD_SCHEDULE';
const UPDATE_SCHEDULE = 'UPDATE_SCHEDULE';
const DELETE_SCHEDULE = 'DELETE_SCHEDULE';

// Reducer function
const taskReducer = (state, action) => {
  switch (action.type) {
    case FETCH_TASKS:
      return {
        ...state,
        tasks: action.payload,
        backlog: action.payload.filter(task => !task.assignedDay),
        loading: false
      };
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        backlog: action.payload.assignedDay 
          ? state.backlog 
          : [...state.backlog, action.payload],
        dailyTasks: action.payload.assignedDay 
          ? {
              ...state.dailyTasks,
              [action.payload.assignedDay]: [
                ...state.dailyTasks[action.payload.assignedDay],
                action.payload
              ]
            }
          : state.dailyTasks,
        loading: false
      };
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
        backlog: state.backlog.map(task => 
          task.id === action.payload.id ? 
            (action.payload.assignedDay ? null : action.payload) : 
            task
        ).filter(Boolean),
        dailyTasks: {
          ...state.dailyTasks,
          ...Object.fromEntries(
            Object.entries(state.dailyTasks).map(([day, tasks]) => [
              day,
              day === action.payload.assignedDay
                ? [...tasks.filter(t => t.id !== action.payload.id), action.payload]
                : tasks.filter(t => t.id !== action.payload.id)
            ])
          )
        },
        loading: false
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        backlog: state.backlog.filter(task => task.id !== action.payload),
        dailyTasks: {
          ...state.dailyTasks,
          ...Object.fromEntries(
            Object.entries(state.dailyTasks).map(([day, tasks]) => [
              day,
              tasks.filter(task => task.id !== action.payload)
            ])
          )
        },
        loading: false
      };
    case MOVE_TASK:
      const { taskId, fromLocation, toLocation } = action.payload;
      const taskToMove = state.tasks.find(task => task.id === taskId);
      
      if (!taskToMove) return state;
      
      const updatedTask = {
        ...taskToMove,
        assignedDay: toLocation === 'backlog' ? null : toLocation
      };
      
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ),
        backlog: toLocation === 'backlog'
          ? [...state.backlog, updatedTask]
          : state.backlog.filter(task => task.id !== taskId),
        dailyTasks: {
          ...state.dailyTasks,
          ...Object.fromEntries(
            Object.entries(state.dailyTasks).map(([day, tasks]) => [
              day,
              day === toLocation
                ? [...tasks, updatedTask]
                : tasks.filter(t => t.id !== taskId)
            ])
          )
        },
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case ADD_SCHEDULE:
      return {
        ...state,
        schedules: [...state.schedules, action.payload],
        loading: false
      };
    case UPDATE_SCHEDULE:
      return {
        ...state,
        schedules: state.schedules.map(schedule => 
          schedule.id === action.payload.id ? action.payload : schedule
        ),
        loading: false
      };
    case DELETE_SCHEDULE:
      return {
        ...state,
        schedules: state.schedules.filter(schedule => schedule.id !== action.payload),
        loading: false
      };
    default:
      return state;
  }
};

// Create a provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Actions
  const fetchTasks = async () => {
    setLoading(true);
    try {
      // This will be replaced with actual API call to MongoDB
      const response = localStorage.getItem('tasks') 
        ? JSON.parse(localStorage.getItem('tasks')) 
        : [];
      
      dispatch({
        type: FETCH_TASKS,
        payload: response
      });
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        payload: 'Error fetching tasks'
      });
    }
  };

  const addTask = (task) => {
    setLoading(true);
    try {
      // Generate a temporary ID (will be replaced by MongoDB ID)
      const newTask = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      // Add to state
      dispatch({
        type: ADD_TASK,
        payload: newTask
      });
      
      // Save to localStorage (temporary until MongoDB is integrated)
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      localStorage.setItem('tasks', JSON.stringify([...tasks, newTask]));
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        payload: 'Error adding task'
      });
    }
  };

  const updateTask = (task) => {
    setLoading(true);
    try {
      // Update state
      dispatch({
        type: UPDATE_TASK,
        payload: task
      });
      
      // Update localStorage (temporary until MongoDB is integrated)
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        payload: 'Error updating task'
      });
    }
  };

  const deleteTask = (id) => {
    setLoading(true);
    try {
      // Delete from state
      dispatch({
        type: DELETE_TASK,
        payload: id
      });
      
      // Delete from localStorage (temporary until MongoDB is integrated)
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const filteredTasks = tasks.filter(task => task.id !== id);
      localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        payload: 'Error deleting task'
      });
    }
  };

  const moveTask = (taskId, fromLocation, toLocation) => {
    setLoading(true);
    try {
      // Move in state
      dispatch({
        type: MOVE_TASK,
        payload: { taskId, fromLocation, toLocation }
      });
      
      // Update localStorage (temporary until MongoDB is integrated)
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        tasks[taskIndex].assignedDay = toLocation === 'backlog' ? null : toLocation;
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        payload: 'Error moving task'
      });
    }
  };

  const setLoading = (loading) => {
    dispatch({
      type: SET_LOADING,
      payload: loading
    });
  };

  // Load tasks on initial render
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        backlog: state.backlog,
        dailyTasks: state.dailyTasks,
        schedules: state.schedules,
        loading: state.loading,
        error: state.error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        moveTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};