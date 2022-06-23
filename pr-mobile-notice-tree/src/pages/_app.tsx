import type { AppProps, AppContext } from "next/app";
import "../styles/globals.css";
import "../styles/primereact-theme.css";
import { store } from "../redux/store";
import React from "react";
import { Provider } from "react-redux";
import Head from "next/head";
import { parseCookies } from "../libs/cookie";
import { GetProvider } from "../contexts/get";
import "react-datepicker/dist/react-datepicker.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/nova/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

// interface InitialProps {
//     coofies: unknown
// }

const App = ({
  Component,
  pageProps,
}: // cookies
AppProps) =>
  // & InitialProps
  {
    return (
      <GetProvider>
        <Provider store={store}>
          <Head>
            <title>ITS</title>
          </Head>
          <Component {...pageProps} />
        </Provider>
      </GetProvider>
    );
  };

App.getInitialProps = async (context: AppContext) => {
  return {
    cookies: parseCookies(context?.ctx?.req),
  };
};

export default App;
