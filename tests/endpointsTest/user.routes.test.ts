import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import dotenv from 'dotenv';
import UserModel from '../../models/user.model';
import * as jwt from '../../utils/jwt';

beforeAll(async () => {
    dotenv.config();
    await mongoose.connect(process.env.DATABASE || "");
}, 10000);

afterEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await UserModel.updateMany({ isDeleted: true }, { isDeleted: false });
    await mongoose.disconnect();
});

describe("Users endpoints", () => {
    describe("POST /users/create", () => {
        it("should create a new user", async () => {
            const response = await request(app).post("/users/create").send({
                first_name: "a",
                last_name: "a",
                email: "a@a.gov.co",
                password: "35",
                address: "here"
            });
        });
        it("should not create a new user due to error", async () => {
            const response = await request(app).post("/users/create").send({
                first_name: "a",
                last_name: "a",
                password: "35",
                address: "here"
            });
            expect(response.status).toBe(500);
        });
    });
    describe("POST /users/login", () => {
        it("should login a user", async () => {
            const response = await request(app).post("/users/login").send({
                email: "x@c.com",
                password: "35"
            });
            expect(response.status).toBe(200);
        });
        it("should not login a user due to error", async () => {    
            const response = await request(app).post("/users/login").send({
                email: "xxxxx@xxxxx.com",
                password: "35"
            });
            expect(response.status).toBe(404);
        });
    });
    describe("GET /users/jwt", () => {
        it("should return a jwt", async () => {
            const response = await request(app).get("/users/jwt").send({
                email: "x@c.com",
                password: "35"
            });
            expect(response.status).toBe(200);
        });
        it("should not return a jwt due to error", async () => {
            const response = await request(app).get("/users/jwt").send({
                email: "xxxxx@xxx.com"
            });
            expect(response.status).toBe(400);
        });
    });
    describe("GET /users/:id", () => {
        it("should return a user", async () => {
            const response = await request(app).get("/users/647516e1d049228a1e057e7a");
            expect(response.status).toBe(200);
        });
        it("should not return a user due to error", async () => {
            const response = await request(app).get("/users/111111111111111111111111");
            expect(response.status).toBe(404);
        });
    });
    describe("PATCH /users/:id", () => {
        it("should update a user", async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const response = await request(app).patch("/users/647516e1d049228a1e057e7a").set('Cookie', `token=${token}`).send({
                first_name: "o"
            });
            expect(response.status).toBe(200);
        });
        it("should not update a user due to error", async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const response = await request(app).patch("/users/111111111111111111111111").set('Cookie', `token=${token}`).send({
                first_name: "o"
            });
            expect(response.status).toBe(404);
        });
    });
    describe("DELETE /users/:id", () => {
        it("should delete a user", async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const response = await request(app).delete("/users/647516e1d049228a1e057e7a").set('Cookie', `token=${token}`);
            expect(response.status).toBe(200);
        });
        it("should not delete a user due to error", async () => {
            const token = jwt.generateToken({ email: 'x@c.com', password: '35' });
            const response = await request(app).delete("/users/111111111111111111111111").set('Cookie', `token=${token}`);
            expect(response.status).toBe(404);
        });
    });
});

