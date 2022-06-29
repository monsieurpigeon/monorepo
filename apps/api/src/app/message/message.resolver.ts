import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { PubSub } from 'graphql-subscriptions';

// TODO : use a global pubsub service
const pubSub = new PubSub();
const MESSAGE_ADDED = 'messageAdded';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message)
  createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput
  ) {
    const newMessage = this.messageService.create(createMessageInput);
    console.log('MESSAGE CREATED', newMessage);
    newMessage.then((messageAdded) => {
      pubSub.publish(MESSAGE_ADDED, messageAdded);
    });

    return newMessage;
  }

  @Query(() => [Message], { name: 'message' })
  findAll() {
    return this.messageService.findAll();
  }

  // TODO : use name: 'message'
  @Query(() => Message, { name: 'messageone' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.messageService.findOne(id);
  }

  @Subscription((returns) => Message, {
    name: MESSAGE_ADDED,
    resolve: (value) => {
      console.log({ value });
      return value;
    },
  })
  messageAdded() {
    console.log('MESSAGE ADDED');
    return pubSub.asyncIterator(MESSAGE_ADDED);
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
