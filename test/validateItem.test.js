const { validateItem } = require("../controllers/Item.controller");

describe("createItem", () => {

    it("should return a valid item", async () => {
        //Arrange
        const data = {
            name: "Test Item",
            weight: "heavy",
            size: "large",
        };
        //Act
        const validate = await validateItem(data);
        //Assert
        expect(validate).toEqual({
            errors: {},
            isValid: true
        });
    });

    it("should return a invalid item", async () => {
        //Arrange
        const data = {
            name: "",
            weight: "",
            size: "",
        };
        //Act
        const validate = await validateItem(data);
        //Assert
        expect(validate).toEqual({
            errors: {
                name: {
                    message: "Name is required",
                },
                weight: {
                    message: "Weight is required",
                },
                size: {
                    message: "Size is required",
                },
            },
            isValid: false
        });
    });

});
