// MODELS
const Item = require("../models/Item");

// display all the items
const getAllItems = (req, res) => {
  Item.find()
    .sort({ _id: -1 })
    .then(items => {
      if (items) {
        res.json(items);
      } else {
        res.json({ message: "no items found" });
      }
    })
    .catch(err => {
      return res
        .status(500)
        .json({ success: false, message: `something went wrong. ${err}` });
    });
}

module.exports = {
    getAllItems
}