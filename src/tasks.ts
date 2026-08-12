import { CreateTaskInput, Priority, Task } from './types';
import { getAllTasks } from './store';

export interface CreateTaskDeps {
  nextId: () => number;
  now: () => Date;
}

/** Return all tasks whose priority is at least `minPriority`. */
export function filterByMinPriority(minPriority: Priority): Task[] {
  return getAllTasks().filter((task) => task.priority >= minPriority);
}

/** Returns up to `limit` tasks sorted by highest priority first. */
/** Return the `limit` highest-priority tasks, most important first. */
export function topTasks(limit: number): Task[] {
  return [...getAllTasks()]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}

/** Build a new Task from validated input. Identity and clock are injected. */
export function createTask(input: CreateTaskInput, deps: CreateTaskDeps): Task {
  return {
    id: deps.nextId(),
    title: input.title,
    priority: input.priority,
    done: false,
    createdAt: deps.now().toISOString(),
  };
}

/** Mark an existing task as complete and return it, or undefined if it does not exist. */
export function completeTask(id: number): Task | undefined {
  const task = getAllTasks().find((t) => t.id === id);
  if (!task) {
    return undefined;
  }
  task.done = true;
  return task;
}
