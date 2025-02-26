import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

// Services to be used for testing
import { ProductsService } from '../../src/products/products.service';
import { newProduct } from '../testObjects';
import { DataSource } from 'typeorm';

export const setupDatabase = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();

  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  await clearDatabase(app);

  return app;
};

export const teardownDatabase = async (app: INestApplication) => {
  //* Add your common teardown logic, such as closing the application
  await app.close();
};

const clearTable = async (repository: any) => {
  await repository.delete({});
};

export const clearDatabase = async (app: INestApplication) => {
  const dataSource = app.get(DataSource);
  const repositories = dataSource.options.entities;

  const reversedRepository = [...(repositories as any)].reverse();

  for (const repository of reversedRepository as any[]) {
    await clearAllRepositories(dataSource, repository);
  }
};

const clearAllRepositories = async (
  dataSource: DataSource,
  repositoryType: any,
) => {
  const repository = dataSource.getRepository(repositoryType);
  await clearTable(repository);
};

export const addProductsToDataBase = async (
  app: INestApplication,
  products: newProduct[],
) => {
  const productService = app.get(ProductsService);
  await productService.createMany(products);
};
