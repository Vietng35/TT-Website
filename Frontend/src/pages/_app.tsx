// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import AuthProvider from '@/Provider/AuthProvider';
import { Header } from '@/component/Header';
import { Footer } from '@/component/Footer';
// import SubmitCtProvider from '@/Provider/SubmitCtProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { client } from "../Service/apollo-client";
import { ApolloProvider } from "@apollo/client";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </AuthProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}

export default MyApp;
