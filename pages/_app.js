import { ChakraProvider, Show} from '@chakra-ui/react';
import { SessionProvider } from "next-auth/react"
import Head from "next/head";
import theme from "@styles/index"
import BugReportHeader from '@components/BugReportHeader'
import MobileScreen from '@components/MobileScreen'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session} >
      <ChakraProvider theme={theme}>
        <Head>
          <title>Timeify</title>
          <meta name="description" content="A better task management tool." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {/* <BugReportHeader/> */}
        <Show breakpoint='(max-width: 769px)'>
          <MobileScreen/>
        </Show>
        <Show breakpoint='(min-width: 769px)'>
          <Component {...pageProps} />
        </Show>
      </ChakraProvider>
    </SessionProvider>
  )
}

export default MyApp
