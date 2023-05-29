import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { createOrder, getOrderByID, getOrdersByEmail, updateOrder } from '../../controllers/order.controller';
import OrderModel from '../../models/order.model';

beforeAll(async () => {
    await mongoose.connect("mongodb+srv://gonzalezsebastian588:V6SM4bCetkfQJXOC@cluster0.zrv04mw.mongodb.net/?retryWrites=true&w=majority");
}, 10000);

afterEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Order Controller', () => {
    describe('createOrder', () => {
        it('should create an order and return success message', async () => {

            const mockRequestOrderData = {
                body: {
                    email: "doe@gmail.com",
                    total: 100,
                    products: [
                        {
                            productID: "123",
                            quantity: 1
                        },
                    ],
                    distance: 100,
                    status: "Created",
                    isDeleted: false
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            let mockCreate = jest.spyOn(OrderModel, 'create')
            mockCreate.mockResolvedValueOnce(mockRequestOrderData.body);

            await createOrder(mockRequestOrderData as Request, mockResponse as Response);

            expect(OrderModel.create).toHaveBeenCalledWith(mockRequestOrderData.body);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "order created",
                order: mockRequestOrderData.body,
            });
        });
        it('should return error message if order not created', async () => {

            const mockRequestOrderData = {
                body: {}
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            let mockCreate = jest.spyOn(OrderModel, 'create')

            const mockError = new Error('Failed to create order');
            mockCreate.mockRejectedValueOnce(mockError);

            await createOrder(mockRequestOrderData, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "order not created", error: mockError });
        });
    });

    describe('getOrderByID', () => {
        it('should return an order given its ID', async () => {
            const actualOrder = await OrderModel.findOne();
            const mockRequestOrderData = {
                params: {
                    id: actualOrder?._id
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            let mockFind = jest.spyOn(OrderModel, 'find')
            mockFind.mockResolvedValueOnce([actualOrder]);

            await getOrderByID(mockRequestOrderData as Request, mockResponse as Response);

            expect(OrderModel.find).toHaveBeenCalledWith({ _id: mockRequestOrderData.params.id });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: { ...actualOrder },
                message: "order details"
            });
        }, 10000);
        it('should return an error for not being able to find the order by the given id', async () => {

            const mockRequestOrderData = {
                params: {
                    id: "mockID"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            let mockFind = jest.spyOn(OrderModel, 'find')
            mockFind.mockResolvedValueOnce([]);

            await getOrderByID(mockRequestOrderData as Request, mockResponse as Response);

            expect(OrderModel.find).toHaveBeenCalledWith({ _id: mockRequestOrderData.params.id });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "order not found"
            });
        });
    });
    describe('getOrdersByEmail', () => {
        it('should return a list of orders given an email', async () => {

            const orders = await OrderModel.find({ email: "doe@gmail.com" });

            const mockRequestOrderData = {
                params: {
                    email: "doe@gmail.com"
                },
                query: { startDate: new Date(0), endDate: new Date() }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            let mockFind = jest.spyOn(OrderModel, 'find')
            mockFind.mockResolvedValueOnce(orders);

            await getOrdersByEmail(mockRequestOrderData as Request, mockResponse as Response);

            expect(OrderModel.find).toHaveBeenCalledWith({
                $or: [
                    { email: mockRequestOrderData.params.email },
                    {
                        created_at: {
                            $gte: mockRequestOrderData.query.startDate,
                            $lte: mockRequestOrderData.query.endDate
                        }
                    },
                ],
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: orders,
                message: "orders list"
            });
        }, 10000);
        it('should return an error for not being able to retrieve orders given the email', async () => {

            const mockRequestOrderData = {
                params: {
                    email: "mockEmail"
                },
                query: { startDate: new Date(0), endDate: new Date() }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            let mockFind = jest.spyOn(OrderModel, 'find')
            mockFind.mockResolvedValueOnce([]);

            await getOrdersByEmail(mockRequestOrderData as Request, mockResponse as Response);

            expect(OrderModel.find).toHaveBeenCalledWith({
                $or: [
                    { email: mockRequestOrderData.params.email },
                    {
                        created_at: {
                            $gte: mockRequestOrderData.query.startDate,
                            $lte: mockRequestOrderData.query.endDate
                        }
                    },
                ],
            });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "orders not found"
            });
        });
    });
    describe('updateOrder', () => {
        it('should update an order given its ID', async () => {
            const actualOrder = await OrderModel.findOne();

            const mockRequestOrderData = {
                params: {
                    id: actualOrder?._id
                },
                body: {
                    email: "newEmail@gmail.com",
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            let newOrder = { ...actualOrder, email: mockRequestOrderData.body.email };

            let mockUpdate = jest.spyOn(OrderModel, 'findByIdAndUpdate')
            mockUpdate.mockResolvedValueOnce(newOrder);

            await updateOrder(mockRequestOrderData as Request, mockResponse as Response);

            expect(OrderModel.findByIdAndUpdate).toHaveBeenCalledWith(mockRequestOrderData.params.id, mockRequestOrderData.body);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "order updated",
                order: newOrder,
            });
        }, 10000);
        it('should return an error for not being able to update the order given the id', async () => {

            const mockRequestOrderData = {
                params: {
                    id: "mockID"
                },
                body: {
                    email: "mockEmail"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            let mockUpdate = jest.spyOn(OrderModel, 'findByIdAndUpdate')
            const mockError = new Error('Failed to update order');
            mockUpdate.mockRejectedValueOnce(mockError);

            await updateOrder(mockRequestOrderData as Request, mockResponse as Response);

            expect(OrderModel.findByIdAndUpdate).toHaveBeenCalledWith(mockRequestOrderData.params.id, mockRequestOrderData.body);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "order not updated",
                error: mockError,
            });
        });
    });
});
