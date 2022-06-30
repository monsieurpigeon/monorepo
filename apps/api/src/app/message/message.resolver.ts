import { Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

const MESSAGE_ADDED = 'messageAdded';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSub,
    private readonly messageService: MessageService
  ) {}

  @Mutation(() => Message)
  createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput
  ) {
    const newMessage = this.messageService.create(createMessageInput);
    console.log('MESSAGE CREATED', newMessage);
    newMessage.then((messageAdded) => {
      this.pubSub.publish(MESSAGE_ADDED, messageAdded);
    });

    return newMessage;
  }

  @Query(() => [Message], { name: 'messages' })
  findAll() {
    return this.messageService.findAll();
  }

  @Query(() => Message, { name: 'message' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.messageService.findOne(id);
  }

  @Subscription((returns) => Message, {
    name: MESSAGE_ADDED,
    resolve: (value) => {
      return value;
    },
  })
  messageAdded() {
    return this.pubSub.asyncIterator(MESSAGE_ADDED);
  }

  @Mutation(() => Message)
  updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput
  ) {
    return this.messageService.update(
      updateMessageInput.id,
      updateMessageInput
    );
  }

  @Mutation(() => Message)
  removeMessage(@Args('id', { type: () => Int }) id: number) {
    return this.messageService.remove(id);
  }
}
