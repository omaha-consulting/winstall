import "../styles/base.scss";
import { useState, useEffect } from "react";

import SelectedContext from "../ctx/SelectedContext";

import { checkTheme } from "../utils/helpers";
import Nav from "../components/Nav";
import PopularContext from "../ctx/PopularContext";
import UserContext from "../ctx/UserContext";

function winstall({ Component, pageProps }) {
    const [selectedApps, setSelectedApps] = useState([]);
    const selectedAppValue = { selectedApps, setSelectedApps };

    const [popular, setPopular] = useState([]);
    const popularApps = { popular, setPopular };

    const [user, setUser] = useState([]);
    const userValue = { user, setUser };

    useEffect(() => {
      checkTheme();
    }, []);

    return (
      <SelectedContext.Provider value={selectedAppValue}>
        <PopularContext.Provider value={popularApps}>
          <UserContext.Provider value={userValue}>
            <>
              <Nav />
              <Component {...pageProps} />
            </>
          </UserContext.Provider>
        </PopularContext.Provider>
      </SelectedContext.Provider>
    );
}


export default winstall;
