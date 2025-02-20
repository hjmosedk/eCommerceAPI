export const createMockQueryBuilder = (responseData: any) => {
  return {
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(responseData.getOne),
    getManyAndCount: jest.fn().mockResolvedValue(responseData.getManyAndCount),
  };
};
