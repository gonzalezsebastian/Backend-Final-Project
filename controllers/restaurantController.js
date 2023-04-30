import Restaurant from "../models/restaurantModel.js";

const createRestaurant = async (req, res) => {
    try{
        const { admin, restaurantID, name, address, phone, categories } = req.body;
        const restaurant = new Restaurant({ admin, restaurantID, name, address, phone, categories });
        const newRestaurant = await restaurant.save();
        res.status(200).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRestaurant = async (req, res) => {
    try {
        const { restaurantID, name, category } = req.query;
        const nameQuery = { $regex: name, $options: 'i' };
        let restaurant;
        if (name && category) {
            restaurant = await Restaurant.findOne({ name: nameQuery, categories: { $elemMatch: { $in: [category] }} });
        } else if (restaurantID) {
            restaurant = await Restaurant.findOne({ restaurantID });
        } else {
            res.status(400).json({ message: "Bad request" });
            return;
        }
        if (!restaurant) {
            res.status(404).json({ message: "The Restaurant does not exists or the name/category do not match" });
            return;
        }
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const updateRestaurant = async (req, res) => {
    const { restaurantID } = req.params;
    const { admin, name, address, phone, categories } = req.body;
    try {
        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { restaurantID: restaurantID, isDeleted: false },
            {
                $set: {
                    admin,
                    name,
                    address,
                    phone,
                    email,
                    categories,
                }
            },
            { new: true }
        );
        if (!updatedRestaurant) {
            return res.status(404).send({ message: "Restaurant not found." });
        }
        return res.status(200).json(updatedRestaurant);
    } catch (err) {
        res.status(500).send({ message: err.message });
        return;
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const { restaurantID } = req.params;
        const restaurant = await Restaurant.findOneAndUpdate(restaurantID, { isDeleted: true });
        if (!restaurant) {
            res.status(404).send({ message: `Restaurant ${restaurantID} not found` });
            return;
        }
        res.status(200).send({ message: `Restaurant was deleted successfully.` });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export { createRestaurant, getRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant };