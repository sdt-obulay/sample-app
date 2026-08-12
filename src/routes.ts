import express, { Request, Response } from 'express';
import { getAllTasks, taskStore } from './store';
import { completeTask, createTask, filterByMinPriority, topTasks } from './tasks';
import { Priority } from './types';
import { validateCreateTask, validateTaskId } from './validation';

export const router = express.Router();

// GET /tasks  -> all tasks, optionally filtered by ?minPriority=
router.get('/tasks', (req: Request, res: Response) => {
  const min = req.query.minPriority;
  if (min !== undefined) {
    return res.json(filterByMinPriority(Number(min) as Priority));
  }
  return res.json(getAllTasks());
});

// GET /tasks/top?limit=  -> highest priority tasks
router.get('/tasks/top', (req: Request, res: Response) => {
  const limit = Number(req.query.limit);
  return res.json(topTasks(limit));
});

// POST /tasks  -> create a task
router.post('/tasks', (req: Request, res: Response) => {
  const parsed = validateCreateTask(req.body);
  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.error });
  }

  const task = createTask(parsed.value, {
    nextId: taskStore.nextId,
    now: () => new Date(),
  });
  taskStore.add(task);
  return res.status(201).json(task);
});

// POST /tasks/:id/complete  -> mark a task as complete
router.post('/tasks/:id/complete', (req: Request, res: Response) => {
  const parsedId = validateTaskId(req.params.id);
  if (!parsedId.ok) {
    return res.status(400).json({ error: parsedId.error });
  }

  const task = completeTask(parsedId.value);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }

  return res.json(task);
});

// GET /tasks/search?q=  -> search task titles
router.get('/tasks/search', (req: Request, res: Response) => {
  const q = String(req.query.q ?? '').toLowerCase();
  const results = getAllTasks().filter((t) => t.title.toLowerCase().includes(q));
  return res.json(results);
});
