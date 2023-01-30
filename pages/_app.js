import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from "next-auth/react"
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session} >
      <ChakraProvider>
        <Head>
          <title>Timely</title>
          <meta name="description" content="A better task management tool." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp
