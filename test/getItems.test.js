const Item = require('../models/Item')
const { getAllItems } = require('../controllers/Item.controller')

describe('getAllItems', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return all items sorted by _id in descending order', async () => {
    //Arrange
    const items = [
      {
        _id: '6532105053bd9f4114a81755',
        name: 'sample name',
        weight: 'sample weight',
        size: 'sample size',
        date: '2023-10-20T05:29:52.676Z',
        __v: 0
      },
      {
        _id: '6532104f53bd9f4114a81753',
        name: 'sample name',
        weight: 'sample weight',
        size: 'sample size',
        date: '2023-10-20T05:29:51.987Z',
        __v: 0
      }
    ]
    jest.spyOn(Item, 'find').mockReturnValue({ sort: jest.fn().mockReturnValue(items) })
    const req = {}
    const res = { json: jest.fn() }
    //Act
    await getAllItems(req, res)
    //Assert
    expect(res.json).toHaveBeenCalledWith(items)
  })

  it('should return a 400 error if no items are found', async () => {
    //Arrange
    jest.spyOn(Item, 'find').mockReturnValue({ sort: jest.fn().mockReturnValue([]) });
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    //Act
    await getAllItems(req, res);
    //Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status().json).toHaveBeenCalledWith({ errors: { message: 'no items found' } });
  });

  it('should return a server error if an exception is thrown', async () => {
    //Arrange
    jest.spyOn(Item, 'find').mockImplementation(() => {
      throw new Error('Test Error');
    });
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    //Act
    await getAllItems(req, res);
    //Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status().json).toHaveBeenCalledWith({ errors: { message: 'Something went wrong: Error: Test Error' } });
  })
})
