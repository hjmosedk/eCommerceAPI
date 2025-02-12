import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from '../../src/message/message.service';
import { createTransport } from 'nodemailer';
import { emailTemplateTypes } from '../../src/message/entities/templates.enum';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import { join } from 'path';
import { Ecommerce } from 'ckh-typings';

jest.mock('nodemailer');
jest.mock('fs');
jest.mock('handlebars');

describe('MessageService', () => {
  let service: MessageService;
  let transporterMock: any;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn().mockResolvedValue(true),
    };

    (createTransport as jest.Mock).mockReturnValue(transporterMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageService],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('MessageModule - handle Emails', () => {
    test('should send an email with the correct parameters', async () => {
      const to = 'test@example.com';
      const templateName = emailTemplateTypes.newOrder;
      const context = { orderId: '12345' };
      const compiledHtml = '<p>Order Created</p>';

      (readFileSync as jest.Mock).mockReturnValue('template content');
      (compile as jest.Mock).mockReturnValue(() => compiledHtml);

      await service.sendMail(to, templateName, context);

      expect(transporterMock.sendMail).toHaveBeenCalledWith({
        from: `Customer Service <${process.env.FROM_EMAIL}>`,
        to,
        subject: 'New Order Created',
        html: compiledHtml,
      });
    });

    test('should handle errors correctly', async () => {
      const to = 'test@example.com';
      const templateName = emailTemplateTypes.newOrder;
      const context = { orderId: '12345' };

      (readFileSync as jest.Mock).mockReturnValue('template content');
      (compile as jest.Mock).mockReturnValue(() => {
        throw new Error('Template compilation error');
      });

      await expect(service.sendMail(to, templateName, context)).rejects.toThrow(
        'Template compilation error',
      );
    });
  });
});
