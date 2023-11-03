import app from '../../../api';
import request from 'supertest';
import { databaseConnector } from '../../../database/connector';


// Get the timestamp (number of milliseconds since January 1, 1970, 00:00:00 UTC)
const timestamp = '2022-09-11 23:21:38+00'
const vehicleId = '2'

describe('GET /vehicle/:id/state', () => {
    afterAll(async () => {
        await databaseConnector.end(); // Close the pool after the tests
    });

    it.only('should return the vehicle state at the specified timestamp', async () => {
        const res = await request(app).get(`/v1/vehicle/${vehicleId}/state?timestamp=${timestamp}`);
        expect(res.statusCode).toEqual(200);

        expect(res.body.data).toMatchObject({
            vehicle: expect.any(Object),
            state: 'selling',
        });
    });

    it('should return 404 if the vehicle is not found', async () => {
        const res = await request(app).get('/v1/vehicle/9999/state?timestamp=2022-09-12T10:00:00Z');
        expect(res.statusCode).toEqual(404);
    });

    it('should return 400 if the timestamp query parameter is not provided', async () => {
        const res = await request(app).get('/v1/vehicle/1/state');
        expect(res.statusCode).toEqual(400);
    });
});

