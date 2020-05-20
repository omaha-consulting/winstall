import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import PackageContext from "../utils/PackageContext";

import styles from "../styles/home.module.scss";

import Search from "../components/Search";
import PopularApps from "../components/PopularApps";

import Error from "../components/Error";
import SelectedContext from "../utils/SelectedContext";

import laptop from "../assets/hero.png";

function Home() {
  const packageData = useContext(PackageContext);
  const history = useHistory();
  const { selectedApps, setSelectedApps } = useContext(SelectedContext);

  // TODO: show a loading element
  if(!packageData) return <></>;


  return (
    <div className="container">
      <div className={styles.intro}>
        <div className="illu-box">
          <h1>Bulk install Windows apps quickly with a single-click.</h1>
          <div className="art">
            <img src={laptop} draggable={false} />
          </div>
        </div>
        <Search />
      </div>

      <PopularApps />

      {selectedApps.length != 0 && (
        <div className="bottomBar">
          <div className="container inner">
            <p>Selected {selectedApps.length} apps so far</p>
            <button onClick={() => history.push("/generate")}>
              Generate script
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
