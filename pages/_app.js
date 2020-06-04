// import App from 'next/app'

import React, { useState, useEffect } from "react";
import "../styles/base.scss";

import SelectedContext from "../ctx/SelectedContext";
import PackagesContext from "../ctx/PackagesContext";

import { checkTheme } from "../utils/helpers";
import Nav from "../components/Nav";
import PopularContext from "../ctx/PopularContext";

function winstall({ Component, pageProps }) {
    const [selectedApps, setSelectedApps] = useState([]);
    const selectedAppValue = { selectedApps, setSelectedApps };

    const [packages, setPackages] = useState([]);
    const packagesData = { packages, setPackages };

    const [popular, setPopular] = useState([]);
    const popularApps = { popular, setPopular };

    useEffect(() => {
      checkTheme();

      // we are caching the packges repository, because otherwise it bombards the
      // github API and reaches api limit quickly
      // setPackageData({ loading: true });

      // fetch(`https://api.winstall.app/apps`)
      //   .then((res) => res.json())
      //   .then(async (data) => {
      //     console.log("Obtaining data from API");
      //     setPackages(data);
      //   })
      //   .catch((error) => {
      //     setPackages({ error });
      //   });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <PackagesContext.Provider value={packagesData}>
        <SelectedContext.Provider value={selectedAppValue}>
          <PopularContext.Provider value={popularApps}>
            <>
              <Nav />
              <Component {...pageProps} />
            </>
          </PopularContext.Provider>
        </SelectedContext.Provider>
      </PackagesContext.Provider>
    );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default winstall;
