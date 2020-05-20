import React from "react";

import styles from "../styles/home.module.scss";

import Search from "../components/Search";
import PopularApps from "../components/PopularApps";
import SelectionBar from "../components/SelectionBar";
import Error from "../components/Error";

import laptop from "../assets/hero.png";

function Home() {

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

      <SelectionBar/>
    </div>
  );
}

export default Home;
