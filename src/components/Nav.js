import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/nav.module.scss";
import { FiMoon, FiSun, FiHeart, FiHelpCircle } from "react-icons/fi";
import { useHistory } from "react-router-dom";

function Nav() {
    const history = useHistory();

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
          <a
            href="https://github.com/sponsors/MehediH"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiHeart/>Donate
          </a>
          <span onClick={e => history.push("/eli5")}>
            <FiHelpCircle/>
          </span>
          <span onClick={switchTheme}>
            <FiMoon className="moon" />
            <FiSun className="sun" />
          </span>
        </div>
      </header>
    );
}

export default Nav;