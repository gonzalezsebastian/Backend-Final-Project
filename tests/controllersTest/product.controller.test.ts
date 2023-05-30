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
            const mockProduct = { sellerID: mockRequest.user.email, ...mockRequest.body };
            mockCreate.mockResolvedValueOnce(mockProduct);

            await createProduct(mockRequest, mockResponse);

            expect(mockCreate).toHaveBeenCalledWith(mockProduct);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Product created", data: mockProduct });

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
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Server error", err: mockError });
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

            expect(mockFindOne).toHaveBeenCalledWith({ _id: new mongoose.Types.ObjectId(mockRequest.params.id), isDeleted: false });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Product found", data: product });
        });
        it('should not retrieve any product in case there is no product with the given ID', async () => {
            const mockRequest = {
                params: {
                    id: "111111111111111111111111"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockFindOne = jest.spyOn(ProductModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(null);

            await getProductByID(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: new mongoose.Types.ObjectId(mockRequest.params.id), isDeleted: false });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Product not found" });
        });
    });
    describe('getProducts', () => {
        it('should retrieve products that match the given user, category and/or search_text', async () => {
            const actualProduct = await ProductModel.findOne({ sellerID: "x@c.com" });
            const mockRequest = {
                query: {
                    category: "categoryP1",
                    search_text: "p",
                },
                params: {
                    email: "x@c.com"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockFind = jest.spyOn(ProductModel, 'find');
            const mockQuery = {
                sellerID: mockRequest.params.email,
                $or: [
                    {
                        category: { $regex: new RegExp(`${mockRequest.query.category}`, "i") },
                        name: { $regex: new RegExp(`${mockRequest.query.search_text}`, "i") },
                    },
                ],
                isDeleted: false
            };
            mockFind.mockResolvedValueOnce([actualProduct]);

            await getProducts(mockRequest, mockResponse);

            expect(mockFind).toHaveBeenCalledWith(mockQuery);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Products found", data: [actualProduct] });
        });
        it('should indicate whether the search has been unsuccesful due to mismatches', async () => {
            const mockRequest = {
                query: {
                    category: "categoryP1",
                    search_text: "p",
                },
                params: {
                    email: "x@c.com"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockFind = jest.spyOn(ProductModel, 'find');
            const mockQuery = {
                sellerID: mockRequest.params.email,
                $or: [
                    {
                        category: { $regex: new RegExp(`${mockRequest.query.category}`, "i") },
                        name: { $regex: new RegExp(`${mockRequest.query.search_text}`, "i") },
                    },
                ],
                isDeleted: false
            };
            mockFind.mockResolvedValueOnce([]);

            await getProducts(mockRequest, mockResponse);

            expect(mockFind).toHaveBeenCalledWith(mockQuery);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Products not found" });
        });
    });
    describe('getProductsByCategory', () => {
        it('should retrieve products that match the given category', async () => {
            const actualProducts = await ProductModel.find({ category: "categoryP1" });
            const mockRequest = {
                params: {
                    category: "categoryP1"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockFind = jest.spyOn(ProductModel, 'find');
            mockFind.mockResolvedValueOnce(actualProducts);

            await getProductsByCategory(mockRequest, mockResponse);

            expect(mockFind).toHaveBeenCalledWith({ category: mockRequest.params.category, isDeleted: false });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Products found", data: actualProducts });
        });
        it('should not retrieve products if none match the given category', async () => {
            const mockRequest = {
                params: {
                    category: "categoryP1"
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockFind = jest.spyOn(ProductModel, 'find');
            mockFind.mockResolvedValueOnce([]);

            await getProductsByCategory(mockRequest, mockResponse);

            expect(mockFind).toHaveBeenCalledWith({ category: mockRequest.params.category, isDeleted: false });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Products not found" });
        });
    });
    describe('updateProduct', () => {
        it('should update a product', async () => {
            const product = await ProductModel.findOne({ sellerID: "x@c.com" });

            const mockRequest = {
                params: {
                    id: product?.id
                },
                body: {
                    name: "yes",
                }
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockFindOne = jest.spyOn(ProductModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(product);

            const mockUpdate = jest.spyOn(ProductModel, 'updateOne');
            mockUpdate.mockResolvedValueOnce({ ...product, ...mockRequest.body });

        });
        it("should not update a product if given ID doesn't match any document ", async () => {

            const mockRequest = {
                params: {
                    id: "111111111111111111111111"
                },
                body: {}
            } as any;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as any;

            const mockFindOne = jest.spyOn(ProductModel, 'findOne');
            mockFindOne.mockResolvedValueOnce(null);

            await updateProduct(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockRequest.params.id, isDeleted: false });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Product not found" });
        });
    });
    describe('deleteProduct', () => {
        it('should delete a product', async () => {
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

            const mockUpdate = jest.spyOn(ProductModel, 'updateOne');
            mockUpdate.mockResolvedValueOnce(mockRequest.params.id);

            await deleteProduct(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockRequest.params.id, isDeleted: false });
            // expect(mockUpdate).toHaveBeenCalledWith({ _id: mockRequest.params.id, isDeleted: false });
            // expect(mockResponse.status).toHaveBeenCalledWith(200);
            // expect(mockResponse.json).toHaveBeenCalledWith({ message: "Product deleted" });
        });
        it('should not delete a product if its ID is not registered', async () => {

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

            await deleteProduct(mockRequest, mockResponse);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockRequest.params.id, isDeleted: false });
            // expect(mockResponse.status).toHaveBeenCalledWith(404);
            // expect(mockResponse.json).toHaveBeenCalledWith({ message: "Product not found" });
        });
    });
});