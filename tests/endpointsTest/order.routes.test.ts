import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';

beforeAll(async () => {
    await mongoose.connect("mongodb+srv://gonzalezsebastian588:V6SM4bCetkfQJXOC@cluster0.zrv04mw.mongodb.net/?retryWrites=true&w=majority");
}, 10000);

afterEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Order Routes', () => {
    describe('POST /orders/create', () => {
        it('should create an order', async () => {
            const orderResponse = await request(app).post('/orders/create').send({
                email: "mockEmail@gmail.com",
                products: [
                    {
                        productID: "mockID",
                        quantity: 1
                    }
                ],
                total: 100,
                status: "Created",
                distance: 100,
                isDeleted: false
            });
            expect(orderResponse.status).toBe(200);
        });
        it('should return an error for not being able to create an order if a required field is missing', async () => {
            const orderResponse = await request(app).post('/orders/create').send({
                products: [
                    {
                        productID: "mockID",
                        quantity: 1
                    }
                ],
                total: 100,
                status: "Created",
                distance: 100,
                isDeleted: false
            });
            expect(orderResponse.status).toBe(500);
        });
    });
    describe('GET /orders/:id', () => {

    });
    describe('GET /orders/:email', () => {

    });
    describe('PATCH /orders/:id', () => {

    });
});