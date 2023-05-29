import mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as jwt from '../../utils/jwt';
import { createUser, userLogin, getUserByID, getToken, updateUser, deleteUser } from '../../controllers/user.controller';
import UserModel from '../../models/user.model';
import { mock } from 'node:test';

beforeAll(async () => {
    await mongoose.connect("mongodb+srv://gonzalezsebastian588:V6SM4bCetkfQJXOC@cluster0.zrv04mw.mongodb.net/?retryWrites=true&w=majority");
}, 10000);

afterEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('User Controller', () => {
    describe('createUser', () => {
        it('should create a user', async () => {

            const mockRequestUserData = {
                body: {
                    first_name: "mockFirstName",
                    second_name: "mockSecondName",
                    email: "mockEmail@gmail.com",
                    password: "mockPassword",
                    phone: "000",
                    address: "mockAddress"
                }

            } as any;
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockCreate = jest.spyOn(UserModel, 'create');
            const mockHashPassword = jest.spyOn(jwt, 'hashPassword');
            mockHashPassword.mockResolvedValueOnce('mockPassword');
            mockCreate.mockResolvedValueOnce(mockRequestUserData.body);

            await createUser(mockRequestUserData as Request, mockResponse as Response);

            expect(UserModel.create).toHaveBeenCalledWith(mockRequestUserData.body);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "User created", data: mockRequestUserData.body
            });
        });
        it('should fail to create a user and return an error', async () => {

            const mockRequestUserData = {
                body: {
                    first_name: "mockFirstName",
                    second_name: "mockSecondName",
                    email: "mockEmail@gmail.com",
                    password: "mockPassword",
                    phone: "000",
                    address: "mockAddress"
                }
            } as any;
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockCreate = jest.spyOn(UserModel, 'create');
            const mockError = new Error('Failed to create user');
            mockCreate.mockRejectedValueOnce(mockError);

            await createUser(mockRequestUserData as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not created", err: mockError });
        });
    });
    describe('userLogin', () => {
        it('should login a user', async () => {

            const mockRequestUserData = {
                body: {
                    email: "x@c.com",
                    password: "35"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                cookie: jest.fn(),
                err: jest.fn()
            } as any;

            const mockFindOne = jest.spyOn(UserModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(mockRequestUserData.body);

            const mockComparePassword = jest.spyOn(jwt, 'comparePassword');
            mockComparePassword.mockResolvedValueOnce(true);

            await userLogin(mockRequestUserData as Request, mockResponse as Response);

            expect(mockFindOne).toHaveBeenLastCalledWith({ email: mockRequestUserData.body.email });
            // TODO
            // expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockComparePassword).toHaveBeenCalledWith(mockRequestUserData.body.password, mockRequestUserData.body.password);
            expect(mockResponse.cookie).toHaveBeenCalled();
        });
        it('should not login a user with incorrect credentials', async () => {
            const mockRequest = {
                body: {
                    email: 'x@c.com',
                    password: '21'
                },
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                cookie: jest.fn()
            } as any;

            const mockFindOne = jest.spyOn(UserModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(mockRequest.body);

            const mockComparePassword = jest.spyOn(jwt, 'comparePassword');
            mockComparePassword.mockResolvedValueOnce(false);

            await userLogin(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ email: mockRequest.body.email });
            expect(mockComparePassword).toHaveBeenCalledWith(mockRequest.body.password, mockRequest.body.password);

            expect(mockResponse.cookie).not.toHaveBeenCalled();
        });
    });
    describe('getUserByID', () => {
        it('should return a user by its ID successfully', async () => {
            const user = await UserModel.findOne();
            const mockRequest = {
                params: {
                    id: user?._id
                },
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            const mockFindOne = jest.spyOn(UserModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(user);

            await getUserByID(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockRequest.params.id });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "User found", data: user });
        });
        it('should not return a user if the ID is not registered', async () => {
            const mockRequest = {
                params: {
                    id: 'mockID'
                },
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            const mockFindOne = jest.spyOn(UserModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(null);

            await getUserByID(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockRequest.params.id });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
    describe('updateUser', () => {
        it('should update a user and retrieve the updated instance', async () => {
            const user = await UserModel.findOne();
            const mockRequest = {
                params: {
                    id: user?._id
                },
                body: {
                    phone: '111'
                },
                user: {
                    email: user?.email
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            const mockFindOne = jest.spyOn(UserModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(user);

            const mockUpdateOne = jest.spyOn(UserModel, 'updateOne');
            mockUpdateOne.mockResolvedValueOnce({ ...user, ...mockRequest.body });

            await updateUser(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockRequest.params.id, isDeleted: false });
            expect(mockUpdateOne).toHaveBeenCalledWith({ _id: mockRequest.params.id }, mockRequest.body, { new: true });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User updated successfully', newUser: { ...user, ...mockRequest.body } });
        });
        it('should not update a user if the ID is not registered', async () => {
            const mockRequest = {
                params: {
                    id: 'mockID'
                },
                body: {
                    phone: '111'
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            const mockFindOne = jest.spyOn(UserModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(null);

            await updateUser(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockRequest.params.id, isDeleted: false });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
    describe('deleteUser', () => {
        it('should disable a user', async () => {
            const user = await UserModel.findOne();
            const mockRequest = {
                params: {
                    id: user?._id
                },
                user: {
                    email: user?.email
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            const mockFindOne = jest.spyOn(UserModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(user);

            const mockUpdateOne = jest.spyOn(UserModel, 'updateOne');
            mockUpdateOne.mockResolvedValueOnce(mockRequest.params.id);

            await deleteUser(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockRequest.params.id, isDeleted: false });
            expect(mockUpdateOne).toHaveBeenCalledWith({ _id: mockRequest.params.id, isDeleted: false });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
        });
        it('should not disable a user if the ID is not registered', async () => {
            const mockRequest = {
                params: {
                    id: 'mockID'
                },
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            const mockFindOne = jest.spyOn(UserModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(null);

            await deleteUser(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockRequest.params.id, isDeleted: false });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
    describe("getToken", () => {
        it("should return a token given an email and password", async () => {
            const mockRequest = {
                body: {
                    email: 'mockEmail',
                    password: 'mockPassword'
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockGenerateToken = jest.spyOn(jwt, 'generateToken');
            mockGenerateToken.mockReturnValueOnce('mockToken');

            await getToken(mockRequest, mockResponse);

            expect(mockGenerateToken).toHaveBeenCalledWith({...mockRequest.body});  
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token generated", token: 'mockToken' });
        });
        it("should not return any token in case an error occurs", async () => {
            const mockRequest = {
                body: {
                    email: 'mockEmail',
                    password: 'mockPassword'
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockGenerateToken = jest.spyOn(jwt, 'generateToken');
            const mockError = new Error('mockError');
            mockGenerateToken.mockImplementation(() => { throw mockError; });

            await getToken(mockRequest, mockResponse);

            expect(mockGenerateToken).toHaveBeenCalledWith({...mockRequest.body});  
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Server error", err: mockError });
        }); 
    });
});