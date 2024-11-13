import { Global, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Global()
@Module({
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
