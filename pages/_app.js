import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from "next-auth/react"
import Head from "next/head";
import theme from "@styles/index"
import BugReportHeader from '@components/BugReportHeader'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session} >
      <ChakraProvider theme={theme}>
        <Head>
          <title>Timeify</title>
          <meta name="description" content="A better task management tool." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <BugReportHeader/>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp
