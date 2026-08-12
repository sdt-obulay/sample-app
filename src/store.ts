import { Task } from './types';

// Simple in-memory store. Not production-grade on purpose — this is a teaching app.
const tasks: Task[] = [
  { id: 1, title: 'Write workshop intro', done: true, priority: 2, createdAt: '2026-01-01T09:00:00.000Z' },
  { id: 2, title: 'Review pull request', done: false, priority: 5, createdAt: '2026-01-02T09:00:00.000Z' },
  { id: 3, title: 'Reply to emails', done: false, priority: 1, createdAt: '2026-01-03T09:00:00.000Z' },
  { id: 4, title: 'Ship release', done: false, priority: 5, createdAt: '2026-01-04T09:00:00.000Z' },
];

let nextId = tasks.length + 1;

export function getAllTasks(): Task[] {
  return tasks;
}

export function addTask(task: Task): Task {
  tasks.push(task);
  return task;
}

export function getNextId(): number {
  return nextId++;
}

export const taskStore = {
  add: addTask,
  list: getAllTasks,
  nextId: getNextId,
};
