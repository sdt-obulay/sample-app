import request from 'supertest';
import { createApp } from './server';

const app = createApp();

describe('GET /tasks/search', () => {
    it('returns matching tasks for a normal query', async () => {
        await request(app).post('/tasks').send({ title: 'Buy groceries', priority: 2 });
        await request(app).post('/tasks').send({ title: 'Read a book', priority: 3 });

        const res = await request(app).get('/tasks/search?q=groceries');

        expect(res.status).toBe(200);
        expect(res.body.some((t: { title: string }) => t.title === 'Buy groceries')).toBe(true);
        expect(res.body.every((t: { title: string }) => t.title.toLowerCase().includes('groceries'))).toBe(true);
    });
});

describe('POST /tasks', () => {
    it('returns 201 and the created task for a valid body', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ title: 'contract test task', priority: 4 });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: 'contract test task',
                priority: 4,
                done: false,
                createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
            }),
        );
    });

    it('returns 400 when title is missing', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ priority: 3 });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: 'title is required and must be a non-empty string',
        });
    });

    it('returns 400 when title is empty', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ title: '   ', priority: 3 });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: 'title is required and must be a non-empty string',
        });
    });

    it('returns 400 when priority is out of range', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ title: 'x', priority: 9 });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: 'priority is required and must be an integer between 1 and 5',
        });
    });
});

describe('POST /tasks/:id/complete', () => {
    it('returns 200 and marks the task as done for a valid id', async () => {
        const res = await request(app).post('/tasks/2/complete');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                id: 2,
                done: true,
            }),
        );
    });

    it('returns 400 when id is invalid', async () => {
        const res = await request(app).post('/tasks/abc/complete');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: 'id must be a positive integer',
        });
    });

    it('returns 404 when task does not exist', async () => {
        const res = await request(app).post('/tasks/999999/complete');

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            error: 'task not found',
        });
    });
});
