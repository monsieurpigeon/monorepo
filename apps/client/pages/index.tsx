import styled, { createGlobalStyle } from 'styled-components';
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
  useGetUsersQuery,
  useOnMessageAddedSubscription,
} from '@monorepo/data-access';
import { useEffect, useState } from 'react';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const StyledPage = styled.div`
  .page {
  }
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: yellow;
  padding: 20px;
  font-size: large;
  margin: 20px;
  border: 20px solid blue;
`;

const MessageContainer = styled.div`
  background-color: red;
  padding: 5px;
`;

const StyledInput = styled.input`
  margin: 20px;
  padding: 20px;
  background-color: green;
  color: aqua;
  font-size: larger;
`;

function Messages() {
  const { data } = useGetMessagesQuery();
  const { data: sub } = useOnMessageAddedSubscription();
  const [send] = useCreateMessageMutation();
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setMessages(data.message);
    }
  }, [data]);

  const [text, setText] = useState('');

  useEffect(() => {
    if (sub) {
      setMessages((m) => [...m, sub.messageAdded]);
    }
  }, [sub]);

  return (
    <>
      <MessagesContainer>
        {messages &&
          messages.map((m) => {
            return (
              <MessageContainer
                key={m.id}
              >{`${m.id} - ${m.text}`}</MessageContainer>
            );
          })}
        <MessageContainer>{text}</MessageContainer>
      </MessagesContainer>
      <StyledInput
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button
        onClick={() => {
          send({ variables: { text: text } });
          setText('');
        }}
      >
        Envoyer
      </button>
    </>
  );
}

export function Index() {
  const { data } = useGetUsersQuery();

  return (
    <div>
      <GlobalStyle />
      <Messages />
      {data && data.user.map((u) => <div key={u.id}>{u.name}</div>)}
    </div>
  );
}

export default Index;
