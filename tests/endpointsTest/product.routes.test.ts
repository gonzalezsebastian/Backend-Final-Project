import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import dotenv from 'dotenv';
import ProductModel from '../../models/product.model';
import * as jwt from '../../utils/jwt';

beforeAll(async () => {
    dotenv.config();
    ProductModel.deleteMany();
    await mongoose.connect(process.env.DATABASE || "");
}, 10000);

afterEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.disconnect();
    ProductModel.deleteMany();
    ProductModel.updateMany({ isDeleted: true }, { isDeleted: false });
});

describe('Product Routes', () => {
    describe('POST /products/create', () => {
        it('should create a product', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const response = await request(app).post('/products/create').set('Cookie', `token=${token}`).send({
                sellerID: "x@c.com",
                name: "p1",
                description: "descriptionP1",
                category: "categoryP1",
                availableQuantity: 1,
                price: 2,
            });
            expect(response.status).toBe(201);
        });
        it('should not create a product if the user is not logged in', async () => {
            const response = await request(app).post('/products/create').send({
                sellerID: "x@c.com",
                name: "p1",
                description: "descriptionP1",
                category: "categoryP1",
                availableQuantity: 1,
                price: 2,
            });
            expect(response.status).toBe(401);
        });
    });
    describe('GET /products/:id', () => {
        it('should get a product', async () => {
            const response = await request(app).get('/products/64757d33b203c000dde18ec1');
            expect(response.status).toBe(200);
        });
        it('should not get a product if the product does not exist', async () => {
            const response = await request(app).get('/products/111111111111111111111111');
            expect(response.status).toBe(404);
        });
    });
    // describe('GET /products/user/:email', () => {
    //     it('should get products by user', async () => {
    //         const response = await request(app).get('/products/users/x@c.com?category=categoryP1');
    //         expect(response.status).toBe(200);
    //     });
    //     it('should not get products by user if the user does not exist', async () => {
    //         const response = await request(app).get('/products/users/xxxxxx@xxx.com?category=categoryP1');
    //         expect(response.status).toBe(404);
    //     });
    // });
    describe('GET /category/:category', () => {
        it('should get products by category', async () => {
            const response = await request(app).get('/products/category/categoryP1');
            expect(response.status).toBe(200);
        });
        it('should not get products by category if the category does not exist', async () => {
            const response = await request(app).get('/products/category/categoryP2');
            expect(response.status).toBe(404);
        });
    });
    describe('PATCH /products/:id', () => {
        it('should update a product', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const response = await request(app).patch('/products/64757d33b203c000dde18ec1').set('Cookie', `token=${token}`).send({
                name: "p2"
            });
            expect(response.status).toBe(200);
        });
        it('should not update a product that doesn\'t exist', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const response = await request(app).patch('/products/111111111111111111111111').set('Cookie', `token=${token}`).send({
                name: "p2"
            });
            expect(response.status).toBe(404);
        });
    });
    describe('DELETE /products/:id', () => {
        it('should delete a product', async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const response = await request(app).delete('/products/64757d33b203c000dde18ec1').set('Cookie', `token=${token}`);
            expect(response.status).toBe(200);
        });
        it('should not delete a product that doesn\'t exist', async () => { 
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const response = await request(app).delete('/products/111111111111111111111111').set('Cookie', `token=${token}`);
            expect(response.status).toBe(404);
        });
    });
});