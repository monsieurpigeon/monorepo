import { AppProps } from 'next/app';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Head from 'next/head';
import './styles.css';

const client = new ApolloClient({
  uri: 'http://localhost:3333/graphql',
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
