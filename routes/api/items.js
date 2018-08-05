const express = require("express");
const router = express.Router();

// MODELS
const Item = require("../../models/Item");

// GET | api/items
// display all the items
router.get("/", (req, res) => {
  Item.find({})
    .sort({ _id: -1 })
    .then(items => res.json(items))
    .catch(err => res.status(404).json({ success: false }));
});

// GET | api/items/:id
// get a single item
router.get("/:id", (req, res) => {
  Item.findById(req.params.id)
    .then(item => res.json(item))
    .catch(err => res.status(404).json({ success: false }));
});

// POST | api/items
// creates an item
router.post("/", (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });
  newItem
    .save()
    .then(item => res.json(item))
    .catch(err => res.status(404).json({ success: false }));
});

// PUT | api/items/:id
// edit/update an item
router.put("/:id", (req, res) => {
  Item.findById(req.params.id).then(updateItem => {
    updateItem.name = req.body.name;
    // edit/update
    updateItem
      .save()
      .then(() => res.json({ success: true }))
      .catch(err => res.status(404).json({ success: false }));
  });
});

// DELETE | api/items/:id
// Delete an item
router.delete("/:id", (req, res) => {
  Item.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
