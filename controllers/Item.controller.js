const Item = require("../models/Item");
const validator = require("validator");
const isEmpty = require("../utils/isEmpty");

// get all the items
const getAllItems = (req, res) => {
    Item.find()
        .sort({_id: -1})
        .then(items => items ? res.json(items) : res.json({success: false, message: "no items found"}))
        .catch(err => res.status(500).json({success: false, message: `something went wrong. ${err}`}));
}

// get single item
const getItem = (req, res) => {
    Item.findById(req.params.id)
        .then(item => item ? res.json(item) : res.json({success: false, message: "item not found"}))
        .catch(err => res.status(500).json({success: false, message: `something went wrong. ${err}`}));
}

// create item
const createItem = (req, res) => {
    const {errors, isValid} = validateCreateItem(req.body);

    // check if data sent was ""
    function validateCreateItem(data) {
        let errors = {};

        // validate using validator
        if (validator.isEmpty(data.name,{ignore_whitespace:true})) errors.name = "Name is required";
        if (validator.isEmpty(data.weight,{ignore_whitespace:true})) errors.weight = "Weight is required";
        if (validator.isEmpty(data.size,{ignore_whitespace:true})) errors.size = "Size is required";
        return {
            errors,
            isValid: isEmpty(errors)
        };
    }
    if (!isValid) return res.json({success:false,...errors});
    else {
        // no erros
        const newItem = new Item({
            name: req.body.name,
            weight: req.body.weight,
            size: req.body.size
        });
        // save item
        newItem
            .save()
            .then(() => res.json({success: true, message: `successfully created: ${newItem.name}`}))
            .catch(err => res.status(500).json({success: false, message: `something went wrong. ${err}`}));
    }
}

// update item
const updateItem = (req, res) => {
    const {errors, isValid} = validateUpdateItem(req.body);

    // update validation
    function validateUpdateItem(data) {
        let errors = {};

        // validate using validator
        if (validator.isEmpty(data.name,{ignore_whitespace:true})) errors.name = "Name is required";
        if (validator.isEmpty(data.weight,{ignore_whitespace:true})) errors.weight = "Weight is required";
        if (validator.isEmpty(data.size,{ignore_whitespace:true})) errors.size = "Size is required";
        
        return {
            errors,
            isValid: isEmpty(errors)
        };
    }
    if (!isValid) return res.json({success:false,...errors});
    else {
        Item.findById(req.params.id)
            .then(item => {
                if (item) {
                    item.name = req.body.name;
                    item.weight = req.body.weight;
                    item.size = req.body.size;
                    // edit/update
                    item.save().then(() =>res.json({success: true, message: `successfully updated: ${item.name}`}));
                } else res.json({success: false, message: "item not found"});
            })
            .catch(err => res.status(500).json({success: false, message: `something went wrong. ${err}`}));
    }
}

// delete item
const deleteItem = (req, res) => {
    Item.findById(req.params.id)
        .then(item => item ? item.remove().then(() => res.json({success: true, message: "successfully removed item"})) : res.json({success: false, message: "item not found"}))
        .catch(err => res.status(500).json({success: false, message: `something went wrong. ${err}`}));
}

module.exports = {
    getAllItems,
    getItem,
    createItem,
    updateItem,
    deleteItem
}