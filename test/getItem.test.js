const Item = require("../models/Item");
const { getItem } = require("../controllers/Item.controller");

describe("Item Controller", () => {
    describe("getItem", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should return the item if it exists", async () => {
            // Arrange
            const item = {
                _id: "6533623125aced7f2d2d827c",
                name: "Test Item",
                weight: 10,
                size: "large",
            };
            const req = {
                params: {
                    id: "6533623125aced7f2d2d827c"
                }
            };
            const res = { json: jest.fn() };
            jest.spyOn(Item, "findById").mockReturnValue({select: jest.fn().mockReturnValue(item)});
            // Act
            await getItem(req, res);
            // Assert
            expect(res.json).toHaveBeenCalledWith(item);
        });

        it("should return an error if the item does not exist", async () => {
            // Arrange
            const req = { params: { id: "6533623125aced7f2d2d827c" } };
            const res = {
                status: jest.fn().mockReturnValue({ json: jest.fn() }),
            };
            jest.spyOn(Item, "findById").mockReturnValue({
                select: jest.fn().mockReturnValue(null),
            });
            // Act
            await getItem(req, res);
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
            const req = { params: { id: "6533623125aced7f2d2d827c" } };
            const res = {
                status: jest.fn().mockReturnValue({ json: jest.fn() }),
            };
            jest.spyOn(Item, "findById").mockImplementation(() => {
                throw new Error("Test Error");
            });
            //Act
            await getItem(req, res);
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
