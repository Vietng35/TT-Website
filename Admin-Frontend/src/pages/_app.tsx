import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "../services/apollo-client";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import AuthProvider from "@/Provider/AuthProvider";


const client = createApolloClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </ApolloProvider>
  );
}