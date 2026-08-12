import { CreateTaskInput, Priority } from './types';

export type ValidateCreateTaskResult =
    | { ok: true; value: CreateTaskInput }
    | { ok: false; error: string };

export type ValidateTaskIdResult =
    | { ok: true; value: number }
    | { ok: false; error: string };

export function validateCreateTask(body: unknown): ValidateCreateTaskResult {
    const { title, priority } = (body ?? {}) as { title: unknown; priority: unknown };

    if (typeof title !== 'string' || title.trim().length === 0) {
        return { ok: false, error: 'title is required and must be a non-empty string' };
    }
    if (title.length > 200) {
        return { ok: false, error: 'title must be 200 characters or fewer' };
    }
    if (!Number.isInteger(priority) || (priority as number) < 1 || (priority as number) > 5) {
        return { ok: false, error: 'priority is required and must be an integer between 1 and 5' };
    }

    return { ok: true, value: { title: title.trim(), priority: priority as Priority } };
}

export function validateTaskId(idParam: unknown): ValidateTaskIdResult {
    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
        return { ok: false, error: 'id must be a positive integer' };
    }
    return { ok: true, value: id };
}
