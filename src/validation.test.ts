import { validateCreateTask, validateTaskId } from './validation';

describe('validateCreateTask', () => {
    const titleError = 'title is required and must be a non-empty string';
    const titleLenError = 'title must be 200 characters or fewer';
    const priorityError = 'priority is required and must be an integer between 1 and 5';

    it.each([
        ['missing title', { priority: 3 }, titleError],
        ['empty title', { title: '', priority: 3 }, titleError],
        ['whitespace title', { title: '   ', priority: 3 }, titleError],
        ['non-string title', { title: 123, priority: 3 }, titleError],
        ['title length 201', { title: 'a'.repeat(201), priority: 3 }, titleLenError],
        ['priority not integer', { title: 'x', priority: 2.5 }, priorityError],
        ['priority 0', { title: 'x', priority: 0 }, priorityError],
        ['priority 6', { title: 'x', priority: 6 }, priorityError],
        ['priority non-number', { title: 'x', priority: 'high' }, priorityError],
        ['missing priority', { title: 'x' }, priorityError],
        ['null body', null, titleError],
    ])('rejects %s', (_label, body, error) => {
        const result = validateCreateTask(body);
        expect(result).toEqual({ ok: false, error });
    });

    it('accepts a valid input and trims the title', () => {
        const result = validateCreateTask({ title: '  ship it  ', priority: 3 });
        expect(result).toEqual({ ok: true, value: { title: 'ship it', priority: 3 } });
    });

    it('accepts boundary title length of 200', () => {
        const title = 'a'.repeat(200);
        const result = validateCreateTask({ title, priority: 1 });
        expect(result).toEqual({ ok: true, value: { title, priority: 1 } });
    });
});

describe('validateTaskId', () => {
    it.each([
        ['missing id', undefined],
        ['empty id', ''],
        ['non-numeric id', 'abc'],
        ['decimal id', '2.5'],
        ['zero id', '0'],
        ['negative id', '-1'],
    ])('rejects %s', (_label, id) => {
        expect(validateTaskId(id)).toEqual({ ok: false, error: 'id must be a positive integer' });
    });

    it('accepts positive integer id', () => {
        expect(validateTaskId('42')).toEqual({ ok: true, value: 42 });
    });
});
