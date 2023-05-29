import mongoose from 'mongoose';
import { createProduct, getProductByID, getProducts, getProductsByCategory, updateProduct, deleteProduct } from '../../controllers/product.controller';
import ProductModel from '../../models/product.model';

beforeAll(async () => {
    await mongoose.connect("mongodb+srv://gonzalezsebastian588:V6SM4bCetkfQJXOC@cluster0.zrv04mw.mongodb.net/?retryWrites=true&w=majority");
}, 10000);

afterEach(async () => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Product Controller', () => {
    describe('createProduct', () => {
        it('should create a product', async () => {
            const mockRequest = {
                body: {
                    name: "p1",
                    description: "descriptionP1",
                    category: "categoryP1",
                    availableQuantity: 1,
                    price: 2,
                    isDeleted: false
                },
                user: {
                    email: "x@c,com"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockCreate = jest.spyOn(ProductModel, 'create');
            const mockProduct = {sellerID: mockRequest.user.email, ...mockRequest.body};
            mockCreate.mockResolvedValueOnce(mockProduct);

            await createProduct(mockRequest, mockResponse);

            expect(mockCreate).toHaveBeenCalledWith(mockProduct);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({message: "Product created", data: mockProduct});

        });
        it('should not create the product in case an error occurs', async () => {
            const mockRequest = {
                body: {}
            } as any;
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockCreate = jest.spyOn(ProductModel, 'create');
            const mockError = new Error('Error during creation');
            mockCreate.mockRejectedValueOnce(mockError);

            await createProduct(mockRequest, mockResponse);

            expect(mockCreate).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({message: "Server error", err: mockError});
        });
    });
    describe('getProductByID', () => {
        it('should retrieve a product by its ID', async () => {
            const product = await ProductModel.findOne();

            const mockRequest = {
                params: {
                    id: product?.id
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockFindOne = jest.spyOn(ProductModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(product);

            await getProductByID(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({_id: mockRequest.params.id, isDeleted: false});
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Product found", data: product });
        });
        it('should not retrieve any product in case there is no product with the given ID', async () => {
            const mockRequest = { 
                params: {
                    id: "mockID"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockFindOne = jest.spyOn(ProductModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(null);

            await getProductByID(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({_id: mockRequest.params.id, isDeleted: false});
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Product not found" });
        });
    });
    describe('getProducts', () => {

    });
    describe('getProductsByCategory', () => {

    });
    describe('updateProduct', () => {

    });
    describe('deleteProduct', () => {

    });
});