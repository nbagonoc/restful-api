const Item = require("../models/Item");
const validator = require("validator");
const isEmpty = require("../utils/isEmpty");

// get all the items
const getAllItems = (req, res) => {
    Item.find()
        .sort({_id: -1})
        .then(items => items ? res.json(items) : res.status(400).json({message: "no items found"}))
        .catch(err => res.status(500).json({message: `something went wrong. ${err}`}));
}

// get single item
const getItem = (req, res) => {
    Item.findById(req.params.id)
        // .select("_id name size")
        .then(item => item ? res.json(item) : res.status(400).json({message: "item not found"}))
        .catch(err => res.status(500).json({message: `something went wrong. ${err}`}));
}

// create item
const createItem = (req, res) => {
    const validation = validateItem(req.body);

    if (!validation.isValid) return res.status(400).json({ errors: validation.errors });

    const newItem = new Item({
        name: req.body.name,
        weight: req.body.weight,
        size: req.body.size
    });
    
    newItem
        .save()
        .then(() => res.json({message: `successfully created: ${newItem.name}`}))
        .catch(err => res.status(500).json({message: `something went wrong. ${err}`}));
}

// update item
const updateItem = (req, res) => {
    const validation = validateItem(req.body);

    if (!validation.isValid) return res.status(400).json({ errors: validation.errors });

    else {
        Item.findById(req.params.id)
            .then(item => {
                if (item) {
                    item.name = req.body.name;
                    item.weight = req.body.weight;
                    item.size = req.body.size;

                    item.save().then(() =>res.json({message: `successfully updated: ${item.name}`}));
                } else res.status(400).json({message: "item not found"});
            })
            .catch(err => res.status(500).json({message: `something went wrong. ${err}`}));
    }
}

// validate item
function validateItem(data) {
    let errors = {};

    if (validator.isEmpty(data.name, { ignore_whitespace: true }))
        errors.name = "Name is required";
    if (validator.isEmpty(data.weight, { ignore_whitespace: true }))
        errors.weight = "Weight is required";
    if (validator.isEmpty(data.size, { ignore_whitespace: true }))
        errors.size = "Size is required";
    
    return {
        errors,
        isValid: isEmpty(errors)
    };
}

// delete item
const deleteItem = (req, res) => {
    Item.findById(req.params.id)
        .then(item => item ? item.remove().then(() => res.json({message: "successfully removed item"})) : res.status(400).json({message: "item not found"}))
        .catch(err => res.status(500).json({message: `something went wrong. ${err}`}));
}

module.exports = {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
}