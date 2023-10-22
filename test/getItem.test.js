const Item = require("../models/Item");
const { getItem } = require("../controllers/Item.controller");

describe("Item Controller", () => {
    describe("getItem", () => {
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const req = { params: { id: "6533623125aced7f2d2d827c" } };

        it("should return the item if it exists", async () => {
            // Arrange
            const mockItem = {
                _id: "6533623125aced7f2d2d827c",
                name: "Test Item",
                weight: 10,
                size: "large",
            };
            jest.spyOn(Item, "findById").mockReturnValue({
                select: jest.fn().mockReturnValue(mockItem),
            });
            // Act
            await getItem(req, res);
            // Assert
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockItem);
        });

        it("should return an error if the item does not exist", async () => {
            // Arrange
            jest.spyOn(Item, "findById").mockReturnValue({
                select: jest.fn().mockReturnValue(null),
            });
            // Act
            await getItem(req, res);
            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.status().json).toHaveBeenCalledWith({
                errors: {
                    message: "item not found",
                },
            });
        });

        it("should return a server error if an exception is thrown", async () => {
            //Arrange
            jest.spyOn(Item, "findById").mockImplementation(() => {
                throw new Error("Test Error");
            });
            //Act
            await getItem(req, res);
            //Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({
                errors: {
                    message: "Something went wrong: Error: Test Error",
                },
            });
        });
    });
});
