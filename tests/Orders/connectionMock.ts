import { QueryRunner } from 'typeorm';

export class ConnectionMock {
  createQueryRunner(mode?: 'master' | 'slave'): QueryRunner {
    const qr = {} as QueryRunner;
    qr.connect = jest.fn();
    qr.release = jest.fn();
    qr.startTransaction = jest.fn();
    qr.commitTransaction = jest.fn();
    qr.rollbackTransaction = jest.fn();
    return qr;
  }
}
