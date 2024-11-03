import { Controller, Get } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Messaging')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({
    description:
      'This is the endpoint to send e-mails and i will be used for sending confirmation emails and status email to the customer',
  })
  @Get('sendEmail')
  async sendEmail() {
    await this.messageService.sendMail(
      'christian@hjmose.dk',
      'Test Email',
      'This is a test email to prove that the email system is working',
    );
    return 'Email sent successfully';
  }
}
