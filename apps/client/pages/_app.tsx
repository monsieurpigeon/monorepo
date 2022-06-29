import { AppProps } from 'next/app';
import {
  split,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import Head from 'next/head';
import './styles.css';

const httpLink = new HttpLink({
  uri: 'http://localhost:3333/graphql',
});

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: 'ws://localhost:3333/graphql',
        })
      )
    : null;

const splitLink =
  typeof window !== 'undefined' && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);

          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ApolloProvider client={client}>
        <Head>
          <title>Welcome to jeuxvoisins-client!</title>
        </Head>
        <main className="app">
          <Component {...pageProps} />
        </main>
      </ApolloProvider>
    </>
  );
}

export default CustomApp;
