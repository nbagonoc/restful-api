const express = require("express");
const router = express.Router();
const validator = require("validator");
const isEmpty = require("../../utils/isEmpty");

// MODEL
const Item = require("../../models/Item");

// CONTROLLER
const ItemController = require("../../controllers/Item.controller");

// GET | api/items
// display all the items
router.get("/", ItemController.getAllItems);

// GET | api/items/:id
// get a single item
router.get("/:id", (req, res) => {
  Item.findById(req.params.id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ message: "item not found" });
      }
    })
    .catch(err => {
      return res
        .status(500)
        .json({ success: false, message: `something went wrong. ${err}` });
    });
});

// POST | api/items
// creates an item
router.post("/", (req, res) => {
  const { errors, isValid } = validateCreateItem(req.body);

  // check if data sent was ""
  function validateCreateItem(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.weight = !isEmpty(data.weight) ? data.weight : "";
    data.size = !isEmpty(data.size) ? data.size : "";

    // validate using validator
    if (validator.isEmpty(data.name)) {
      errors.name = "Name is required";
    }
    if (validator.isEmpty(data.weight)) {
      errors.weight = "Weight is required";
    }
    if (validator.isEmpty(data.size)) {
      errors.size = "Size is required";
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
  if (!isValid) {
    // data sent has errors, show errors
    return res.status(400).json(errors);
  } else {
    // no erros
    const newItem = new Item({
      name: req.body.name,
      weight: req.body.weight,
      size: req.body.size
    });
    // save item
    newItem
      .save()
      .then(() =>
        res.json({ success: true, message: "successfully created item" })
      )
      .catch(err => {
        return res
          .status(500)
          .json({ success: false, message: `something went wrong. ${err}`});
      });
  }
});

// PUT | api/items/:id
// edit/update an item
router.put("/:id", (req, res) => {
  const { errors, isValid } = validateUpdateItem(req.body);

  // update travent validation
  function validateUpdateItem(data) {
    let errors = {};

    // check if data sent was ""
    data.name = !isEmpty(data.name) ? data.name : "";
    data.weight = !isEmpty(data.weight) ? data.weight : "";
    data.size = !isEmpty(data.size) ? data.size : "";

    // validate using validator
    if (validator.isEmpty(data.name)) {
      errors.name = "Name is required";
    }
    if (validator.isEmpty(data.weight)) {
      errors.weight = "Weight is required";
    }
    if (validator.isEmpty(data.size)) {
      errors.size = "Size is required";
    }
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
  if (!isValid) {
    return res.status(400).json(errors);
  } else {
    Item.findById(req.params.id)
      .then(item => {
        if (item) {
          item.name = req.body.name;
          item.weight = req.body.weight;
          item.size = req.body.size;
          // edit/update
          item
            .save()
            .then(() =>
              res.json({ success: true, message: "successfully updated item" })
            );
        } else {
          res.status(404).json({ message: "item not found" });
        }
      })
      .catch(err => {
        return res
          .status(500)
          .json({ success: false, message: `something went wrong. ${err}` });
      });
  }
});

// DELETE | api/items/:id
// Delete an item
router.delete("/:id", (req, res) => {
  Item.findById(req.params.id)
    .then(item => {
      if (item) {
        item
          .remove()
          .then(() =>
            res.json({ success: true, message: "successfully removed item" })
          );
      } else {
        res.status(404).json({ message: "item not found" });
      }
    })
    .catch(err => {
      return res
        .status(500)
        .json({ success: false, message: `something went wrong. ${err}` });
    });
});

module.exports = router;
