import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/nav.module.scss";
import { FiMoon, FiSun } from "react-icons/fi";

function Nav() {
    let switchTheme = () => {
        let body = document.querySelector("body");

        if(body.classList.contains("light")){
            localStorage.setItem("wiTheme", "dark")
            body.classList.replace("light", "dark")
        } else{
            localStorage.setItem("wiTheme", "light")
            body.classList.replace("dark", "light")
        }
    }

    return (
      <header className="container">
        <div className={styles.brand}>
          <Link to="/">winstall</Link>
          <span>&nbsp;(preview)</span>
        </div>

        <div className={styles.nav}>
          <span onClick={switchTheme}><FiMoon className="moon"/><FiSun className="sun"/></span>
        </div>
      </header>
    );
}

export default Nav;