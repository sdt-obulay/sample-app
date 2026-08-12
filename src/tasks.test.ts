import { completeTask, createTask, filterByMinPriority, topTasks } from './tasks';

describe('topTasks', () => {
  it('returns the highest priority tasks first', () => {
    const top = topTasks(2);
    expect(top).toHaveLength(2);
    expect(top[0].priority).toBe(5);
    expect(top[1].priority).toBe(5);
  });

  it('never returns more than the requested limit', () => {
    expect(topTasks(1)).toHaveLength(1);
  });
});

describe('filterByMinPriority', () => {
  // This test passes: tasks strictly above the threshold are clearly included.
  it('includes tasks above the threshold', () => {
    const result = filterByMinPriority(2);
    expect(result.every((t) => t.priority >= 2)).toBe(true);
    expect(result.some((t) => t.priority === 5)).toBe(true);
  });

  // This test FAILS on purpose — it documents the planted off-by-one bug.
  // "minimum priority" should be INCLUSIVE, so priority === min must be returned.
  it('includes tasks exactly equal to the threshold (currently failing)', () => {
    const result = filterByMinPriority(2);
    const hasExactMatch = result.some((t) => t.priority === 2);
    expect(hasExactMatch).toBe(true);
  });
});

describe('createTask', () => {
  const fixedNow = new Date('2026-01-01T00:00:00.000Z');
  const deps = { nextId: () => 42, now: () => fixedNow };

  it('builds a Task from validated input with injected id and clock', () => {
    const task = createTask({ title: 'ship it', priority: 3 }, deps);
    expect(task).toEqual({
      id: 42,
      title: 'ship it',
      priority: 3,
      done: false,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('always sets done to false', () => {
    const task = createTask({ title: 'x', priority: 1 }, deps);
    expect(task.done).toBe(false);
  });

  it('uses the injected clock, not the real one', () => {
    const task = createTask({ title: 'x', priority: 1 }, {
      nextId: () => 1,
      now: () => new Date('1999-12-31T23:59:59.000Z'),
    });
    expect(task.createdAt).toBe('1999-12-31T23:59:59.000Z');
  });
});

describe('completeTask', () => {
  it('marks an existing task as done', () => {
    const task = completeTask(3);
    expect(task).toBeDefined();
    expect(task?.done).toBe(true);
  });

  it('returns undefined for a missing task id', () => {
    expect(completeTask(999999)).toBeUndefined();
  });
});
