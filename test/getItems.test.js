const Item = require("../models/Item");
const { getAllItems } = require("../controllers/Item.controller");

describe("getAllItems", () => {
    const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all items sorted by _id in descending order", async () => {
        //Arrange
        const mockItems = [
            {
                _id: "6532105053bd9f4114a81755",
                name: "sample name",
                weight: "sample weight",
                size: "sample size",
                date: "2023-10-20T05:29:52.676Z",
                __v: 0,
            },
            {
                _id: "6532104f53bd9f4114a81753",
                name: "sample name",
                weight: "sample weight",
                size: "sample size",
                date: "2023-10-20T05:29:51.987Z",
                __v: 0,
            },
        ];
        jest.spyOn(Item, "find").mockReturnValue({
            sort: jest.fn().mockReturnValue(mockItems),
        });
        const req = {};
        //Act
        await getAllItems(req, res);
        //Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockItems);
    });

    it("should return a 400 error if no items are found", async () => {
        //Arrange
        jest.spyOn(Item, "find").mockReturnValue({
            sort: jest.fn().mockReturnValue([]),
        });
        const req = {};
        //Act
        await getAllItems(req, res);
        //Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: {
                message: "no items found",
            },
        });
    });

    it("should return a server error if an exception is thrown", async () => {
        //Arrange
        jest.spyOn(Item, "find").mockImplementation(() => {
            throw new Error("Test Error");
        });
        const req = {};
        //Act
        await getAllItems(req, res);
        //Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            errors: {
                message: "Something went wrong: Error: Test Error",
            },
        });
    });
});
