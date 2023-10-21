const Item = require("../models/Item");
const { deleteItem } = require("../controllers/Item.controller");

describe("Item Controller", () => {
    describe("deleteItem", () => {
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        it("should delete the item if it exists", async () => {
            // Arrange
            const mockItem = {
                _id: "6533623125aced7f2d2d827c",
                name: "Test Item",
                weight: 10,
                size: "large",
            };
            Item.findById = jest.fn().mockResolvedValue(mockItem);
            mockItem.remove = jest.fn().mockResolvedValue();
            const req = {
                params: {
                    id: "6533623125aced7f2d2d827c",
                },
            };
            // Act
            await deleteItem(req, res);
            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: {
                    message: "successfully removed item"
                },
            });
        });

        it("should return an error if the item does not exist", async () => {
            // Arrange
            Item.findById = jest.fn().mockResolvedValue(null);
            const req = {
                params: {
                    id: "6533623125aced7f2d2d827c"
                }
            };
            await deleteItem(req, res);
            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.status().json).toHaveBeenCalledWith({
                errors: {
                    message: "item not found"
                },
            });
        });

        it("should return a server error if an exception is thrown", async () => {
            //Arrange
            const req = {
                params: {
                    id: "6533623125aced7f2d2d827c"
                }
            };
            const res = {
                status: jest.fn().mockReturnValue({ json: jest.fn() }),
            };
            jest.spyOn(Item, "findById").mockImplementation(() => {
                throw new Error("Test Error");
            });
            //Act
            await deleteItem(req, res);
            //Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({
                errors: {
                    message: "Something went wrong: Error: Test Error"
                },
            });
        });

    });
});
