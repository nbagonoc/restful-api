const Item = require("../models/Item");
const validator = require("validator");

// get all the items
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find().sort({ _id: -1 });
        items.length > 0
            ? res.status(200).json(items)
            : res.status(400).json({
                errors: {
                    message: "no items found"
                }
            });
    } catch (err) {
        res.status(500).json({
            errors: {
                message: `Something went wrong: ${err}`
            },
        });
    }
};

// get single item
const getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).select(
            "_id name weight size"
        );
        item
            ? res.json(item)
            : res.status(400).json({
                errors: {
                    message: "item not found"
                }
            });
    } catch (err) {
        res.status(500).json({
            errors: {
                message: `Something went wrong: ${err}`
            },
        });
    }
};

// create item
const createItem = async (req, res) => {
    try {
        const validation = await validateItem(req.body);
        if (!validation.isValid)
            return res.status(400).json({ errors: validation.errors });

        const newItem = new Item({
            name: req.body.name,
            weight: req.body.weight,
            size: req.body.size,
        });
        await newItem.save();
        res.status(200).json({
            success: {
                message: `successfully created: ${newItem.name}`
            },
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                message: `Something went wrong: ${err}`
            },
        });
    }
};

// update item
const updateItem = async (req, res) => {
    try {
        const validation = await validateItem(req.body);
        if (!validation.isValid)
            return res.status(400).json({ errors: validation.errors });

        const item = await Item.findById(req.params.id);
        if (item) {
            item.name = req.body.name;
            item.weight = req.body.weight;
            item.size = req.body.size;

            await item.save();
            res.status(200).json({
                success: {
                    message: `successfully updated: ${item.name}`
                },
            });
        } else {
            res.status(400).json({
                errors: {
                    message: "item not found"
                }
            });
        }
    } catch (err) {
        res.status(500).json({
            errors: {
                message: `Something went wrong: ${err}`
            },
        });
    }
};

// delete item
const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (item) {
            await item.remove();
            res.status(200).json({
                success: {
                    message: "successfully removed item"
                },
            });
        } else {
            res.status(400).json({
                errors: {
                    message: "item not found"
                }
            });
        }
    } catch (err) {
        res.status(500).json({
            errors: {
                message: `Something went wrong: ${err}`
            },
        });
    }
};

// validate item
function validateItem(data) {
    let errors = {};

    if (validator.isEmpty(data.name, { ignore_whitespace: true }))
        errors.name = { message: "Name is required" };
    if (validator.isEmpty(data.weight, { ignore_whitespace: true }))
        errors.weight = { message: "Weight is required" };
    if (validator.isEmpty(data.size, { ignore_whitespace: true }))
        errors.size = { message: "Size is required" };

    const isValid = Object.keys(errors).length === 0;

    return {
        errors,
        isValid,
    };
}

module.exports = {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    validateItem,
};
