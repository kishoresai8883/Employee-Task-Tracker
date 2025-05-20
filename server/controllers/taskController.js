import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, assignee, deadline } = req.body;
  
  const task = await Task.create({
    title,
    description,
    status,
    priority,
    assignee,
    assigneeName: req.body.assigneeName,
    createdBy: req.user._id,
    createdByName: req.user.name,
    deadline,
  });
  
  res.status(201).json(task);
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find(
    req.user.role === 'admin' ? {} : { assignee: req.user._id }
  );
  res.json(tasks);
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (task) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (task) {
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.assignee = req.body.assignee || task.assignee;
    task.assigneeName = req.body.assigneeName || task.assigneeName;
    task.deadline = req.body.deadline || task.deadline;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export const addComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (task) {
    const comment = {
      text: req.body.text,
      userId: req.user._id,
      userName: req.user.name,
    };
    
    task.comments.push(comment);
    await task.save();
    res.status(201).json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});