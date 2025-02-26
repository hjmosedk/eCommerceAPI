import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from '../../src/message/message.controller';
import { MessageService } from '../../src/message/message.service';
import { emailTemplateTypes } from '../../src/message/entities/templates.enum';
import * as request from 'supertest';
import { INestApplication, InternalServerErrorException } from '@nestjs/common';

describe('MessageController', () => {
  let app: INestApplication;
  let messageService: MessageService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    messageService = moduleRef.get<MessageService>(MessageService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Message Controller', () => {
    test('should call MessageService.sendMail with correct parameters', async () => {
      const sendMailSpy = jest.spyOn(messageService, 'sendMail');

      await request(app.getHttpServer()).get('/message/sendEmail').expect(200);

      expect(sendMailSpy).toHaveBeenCalledWith(
        'christian@hjmose.dk',
        emailTemplateTypes.newOrder,
        { userName: 'Christian Kubel Højmose', orderNumber: '1145' },
      );
    });

    test('should return 200 status code on successful email send', async () => {
      await request(app.getHttpServer()).get('/message/sendEmail').expect(200);
    });

    test('should handle errors from MessageService.sendMail', async () => {
      jest
        .spyOn(messageService, 'sendMail')
        .mockRejectedValue(
          new InternalServerErrorException('Failed to send email'),
        );

      await request(app.getHttpServer()).get('/message/sendEmail').expect(500);
    });
  });
});
