const Item = require("../models/Item");
const { createItem } = require("../controllers/Item.controller");

describe("createItem", () => {
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new item and return a success response", async () => {
        //Arrange
        createItem.validateItem = jest
            .fn()
            .mockReturnValue({ isValid: true, errors: {} });
        Item.prototype.save = jest.fn().mockResolvedValue();
        const req = {
            body: {
                name: "Test Item",
                weight: "heavy",
                size: "large",
            },
        };
        //Act
        await createItem(req, res);
        //Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: {
                message: "successfully created: Test Item"
            },
        });
    });

    it("should return a 400 error on validation failure", async () => {
        //Arrange
        createItem.validateItem = jest
            .fn()
            .mockReturnValue({
                isValid: false,
                errors: {
                    name: "Name is required"
                },
            });
        const req = {
            body: {
                name: "",
                weight: "heavy",
                size: "large",
            },
        };
        //Act
        await createItem(req, res);
        //Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: {
                name: {
                    message: "Name is required",
                },
            },
        });
    });

    it("should return a 500 error on save failure", async () => {
        //Arrange
        createItem.validateItem = jest
            .fn()
            .mockReturnValue({ isValid: true, errors: {} });
        Item.prototype.save = jest
            .fn()
            .mockRejectedValue(new Error("Database error"));
        const req = {
            body: {
                name: "Test Item",
                weight: "heavy",
                size: "large",
            },
        };
        //Act
        await createItem(req, res);
        //Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            errors: {
                message: "Something went wrong: Error: Database error"
            },
        });
    });
});
