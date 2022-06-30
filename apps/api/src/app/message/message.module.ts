import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { PubSubModule } from '../pub-sub.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), PubSubModule],
  providers: [MessageResolver, MessageService],
})
export class MessageModule {}
