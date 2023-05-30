import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import dotenv from 'dotenv';
import OrderModel from '../../models/order.model';
import * as jwt from '../../utils/jwt';

beforeAll(async () => {
    dotenv.config();
    OrderModel.deleteMany();
    await mongoose.connect(process.env.DATABASE || "");
}, 10000);

afterEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.disconnect();
    OrderModel.deleteMany();
});

describe('Order Routes', () => {
    describe('POST /orders/create', () => {
        it('should create an order', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const orderResponse = await request(app).post('/orders/create').set('Cookie', `token=${token}`).send({
                email: "x@c.com",
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
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const orderResponse = await request(app).post('/orders/create').set('Cookie', `token=${token}`).send({
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
        it('should get an order by id', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const orderResponse = await request(app).get('/orders/6474f6f0d049228a1e057e77').set('Cookie', `token=${token}`);
            expect(orderResponse.status).toBe(200);
        });
        it('should return an error for not being able to get an order by id if the id is invalid', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const orderResponse = await request(app).get('/orders/111111111111111111111111').set('Cookie', `token=${token}`);
            expect(orderResponse.status).toBe(404);
        });
    });
    describe('GET /orders/user/:email', () => {
        it('should get an order by email', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const orderResponse = await request(app).get('/orders/user/x@c.com').set('Cookie', `token=${token}`);
            expect(orderResponse.status).toBe(200);
        });
        it('should return an error for not being able to get an order by email if the email is invalid', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const orderResponse = await request(app).get('/orders/user/a@a.gov.co').set('Cookie', `token=${token}`);
            expect(orderResponse.status).toBe(404);
        });
    });
    describe('PATCH /orders/:id', () => {
        it('should update an order by id', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const orderResponse = await request(app).patch('/orders/6474f6f0d049228a1e057e77').set('Cookie', `token=${token}`).send({
                total: 50
            });
            expect(orderResponse.status).toBe(200);
        });
        it('should return an error for not being able to update an order by id if the id is invalid', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const orderResponse = await request(app).patch('/orders/111111111111111111111111').set('Cookie', `token=${token}`).send({
                total: 50
            });
            expect(orderResponse.status).toBe(404);
        });
    });
});