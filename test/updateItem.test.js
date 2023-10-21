const Item = require("../models/Item");
const { updateItem } = require("../controllers/Item.controller");

describe("updateItem", () => {
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update an existing item and return a success response", async () => {
        // Arrange
        const mockItem = new Item({
            name: "Existing Item",
            weight: "medium",
            size: "small",
        });
        Item.findById = jest.fn().mockResolvedValue(mockItem);
        mockItem.save = jest.fn().mockResolvedValue();
        const req = {
            params: {
                id: "12345", // Replace with a valid item ID
            },
            body: {
                name: "Updated Item",
                weight: "heavy",
                size: "large",
            },
        };
        // Act
        await updateItem(req, res);
        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: {
                message: "successfully updated: Updated Item"
            },
        });
    });

    it("should return a 400 error if the item to update is not found", async () => {
        // Arrange
        Item.findById = jest.fn().mockResolvedValue(null);
        const req = {
            params: {
                id: "12345",
            },
            body: {
                name: "Updated Item",
                weight: "heavy",
                size: "large",
            },
        };
        // Act
        await updateItem(req, res);
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: {
                message: "item not found"
            },
        });
    });

    it("should return a 500 error on save failure", async () => {
        // Arrange
        const mockItem = new Item({
            name: "Existing Item",
            weight: "medium",
            size: "small",
        });
        Item.findById = jest.fn().mockResolvedValue(mockItem);
        mockItem.save = jest
            .fn()
            .mockRejectedValue(new Error("Database error"));
        const req = {
            params: {
                id: "12345",
            },
            body: {
                name: "Updated Item",
                weight: "heavy",
                size: "large",
            },
        };
        // Act
        await updateItem(req, res);
        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            errors: {
                message: "Something went wrong: Error: Database error"
            },
        });
    });
});
