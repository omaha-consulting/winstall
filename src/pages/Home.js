import React from "react";

import styles from "../styles/home.module.scss";

import Search from "../components/Search";
import PopularApps from "../components/PopularApps";
import SelectionBar from "../components/SelectionBar";
import Error from "../components/Error";

import art from "../assets/logo.svg";
import Footer from "../components/Footer";

function Home() {

  return (
    <div className="container">
      <div className={styles.intro}>
        <div className="illu-box">
          <h1>Bulk install Windows apps quickly with Windows Package Manager.</h1>
          <div className="art">
            <img src={art} draggable={false} />
          </div>
        </div>
        <Search />
      </div>

      <PopularApps />

      <SelectionBar/>

      <Footer/>
    </div>
  );
}

export default Home;
