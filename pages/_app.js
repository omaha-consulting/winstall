import "../styles/base.scss";
import { useState, useEffect } from "react";

import SelectedContext from "../ctx/SelectedContext";

import { checkTheme } from "../utils/helpers";
import Nav from "../components/Nav";
import SelectionBar from "../components/SelectionBar";
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
            <>
              <div className="container">
                <Nav />
                <Component {...pageProps} />
              </div>
              <SelectionBar/>
            </>
        </PopularContext.Provider>
      </SelectedContext.Provider>
    );
}


export default winstall;
