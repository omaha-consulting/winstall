import React, { useContext, useState } from "react";

import PackageContext from "../utils/PackageContext";

import styles from "../styles/home.module.scss";

import Search from "../components/Search";
import PopularApps from "../components/PopularApps";

import Error from "../components/Error";
import SelectedContext from "../utils/SelectedContext";
import generateScript from "../utils/generateScript";

function Home() {
  const packageData = useContext(PackageContext);
  const { selectedApps, setSelectedApps } = useContext(SelectedContext);

  // TODO: show a loading element
  if(!packageData) return <></>;



  return (
    <div className="container">
      <div className={styles.intro}>
        <h1>Bulk install Windows apps quickly with a single-click.</h1>

        <Search />
      </div>

      <PopularApps />

      {selectedApps.length != 0 && (
        <div className="bottomBar">
          <div className="container inner">
            <p>Selected {selectedApps.length} apps so far</p>
            <button onClick={() => generateScript(selectedApps)}>
              Generate script
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
