import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { emailTemplateTypes } from './entities/templates.enum';

@ApiTags('Messaging')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({
    description:
      'This is the endpoint to send e-mails and it will be used for sending confirmation emails and status email to the customer',
  })
  @Get('sendEmail')
  async sendEmail() {
    try {
      await this.messageService.sendMail(
        'christian@hjmose.dk',
        emailTemplateTypes.newOrder,
        { userName: 'Christian Kubel Højmose', orderNumber: '1145' },
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
