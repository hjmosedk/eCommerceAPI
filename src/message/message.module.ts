/* istanbul ignore file */
// * File ignored in testing, as this is a configuration file, and not a logic file - No logic to test
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
