import { useState, useEffect } from "react";
import "../styles/base.scss";

import SelectedContext from "../ctx/SelectedContext";

import { checkTheme } from "../utils/helpers";
import Nav from "../components/Nav";
import MetaTags from "../components/MetaTags";
import PopularContext from "../ctx/PopularContext";

function winstall({ Component, pageProps }) {
    const [selectedApps, setSelectedApps] = useState([]);
    const selectedAppValue = { selectedApps, setSelectedApps };

    const [popular, setPopular] = useState([]);
    const popularApps = { popular, setPopular };

    useEffect(() => {
      checkTheme();
    }, []);

    return (
      <SelectedContext.Provider value={selectedAppValue}>
        <PopularContext.Provider value={popularApps}>
          <MetaTags/>
          <>
            <Nav />
            <Component {...pageProps} />
          </>
        </PopularContext.Provider>
      </SelectedContext.Provider>
    );
}


export default winstall;
