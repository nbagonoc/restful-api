const express = require("express");
const router = express.Router();
const ItemController = require("../../controllers/Item.controller");

router.get("/", ItemController.getAllItems); // GET | api/items | display all the items
router.get("/:id", ItemController.getItem); // GET | api/items/:id | get a single item
router.post("/", ItemController.createItem); // POST | api/items | creates an item
router.put("/:id", ItemController.updateItem); // PUT | api/items/:id | edit/update an item
router.delete("/:id", ItemController.deleteItem); // DELETE | api/items/:id | Delete an item

module.exports = router;
