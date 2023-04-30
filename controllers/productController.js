import Product from "../models/productModel.js";
import Restaurant from "../models/restaurantModel.js";
import mongoose from "mongoose";

const createProduct = async (req, res) => {
    try {
        const { restaurantID, name, description, category, availableQuantity, price } = req.body;

        if (!mongoose.Types.ObjectId.isValid(restaurantID)) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }
        const productStatus = availableQuantity > 0 ? true : availableQuantity === 0 ? false : null;
        
        if (productStatus === null) {
            return res.status(400).json({ message: 'Invalid available quantity' });
        }

        const product = new Product({ restaurantID, name, description, availableQuantity, category, price});
        await product.save();
        if (restaurantID){
            const updatedRestaurant = await Restaurant.findOneAndUpdate(
                { restaurantID: restaurantID, isDeleted: false },
                {
                    $push: {
                        products: product.name,
                    },
                },
                { new: true }
            );
            if (!updatedRestaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }
        }
        res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getProductbyID = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findById(_id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getProductbyRestaurantID = async (req, res) => {
    const { restaurantID, category } = req.body;
    const query = { restaurantID: restaurantID, isDeleted: false };
    if (restaurantID) {
        query.restaurantID = restaurantID;
    }
    if (category) {
        query.category = category;
    }
    try {
        const products = await Product.find(query);
        if (!products) {
            res.status(404).send({ message: "Products not found." });
            return;
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


const updateProduct = async (req, res) => {
    const { _id } = req.params;
    const { name, description, category, availableQuantity, price } = req.body;
    const productStatus = availableQuantity > 0 ? true : availableQuantity === 0 ? false : null;
    if (productStatus === null) {
      return res.status(400).json({ message: 'Invalid available quantity' });
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            { _id: _id, isDeleted: false },
            {
                $set: {
                    name,
                    description,
                    availableQuantity,
                    category,
                    price,
                    productStatus
                }
            },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found." });
        }

        if(name){
            const updatedRestaurant = await Restaurant.findOneAndUpdate(
                { restaurantID: updatedProduct.restaurantID, isDeleted: false },
                {
                    $set: {
                        "products.$[element]": name,
                    },
                },
                {
                    arrayFilters: [{ "element": updatedProduct.name }],
                    new: true
                }
            );
            if (!updatedRestaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).send({ message: err.message });
        return;
    }
};

const deleteProduct = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(_id, { isDeleted: true });
        if (!product) {
            return res.status(404).send({ message: "Product not found." });
        }
        if (product.restaurantID){
            const updatedRestaurant = await Restaurant.findOneAndUpdate(
                { restaurantID: product.restaurantID, isDeleted: false },
                {
                    $pull: {
                        products: product.name,
                    },
                },
                { new: true }
            );
            if (!updatedRestaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }
        }
        res.status(200).json({ message: `Product deleted successfully!` });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export { createProduct, getProductbyID, getProductbyRestaurantID, getAllProducts, updateProduct, deleteProduct };