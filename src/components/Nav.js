import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/nav.module.scss";
import { FiMoon, FiSun, FiCoffee, FiHelpCircle } from "react-icons/fi";
import { useHistory, useLocation } from "react-router-dom";

function Nav() {
    const history = useHistory();
    const location = useLocation();

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

    const handleExplainer = () => {
      if(location.pathname === "/eli5"){
        history.push("/")
      } else{
        history.push("/eli5");
      }
    }

    return (
      <header className="container">
        <div className={styles.brand}>
          <Link to="/">winstall</Link>
          <span className="preview">&nbsp;(preview)</span>
        </div>

        <div className={styles.nav}>
          <a
            href="https://ko-fi.com/mehedi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiCoffee />
            <p>Donate</p>
          </a>
          <span onClick={handleExplainer}>
            <FiHelpCircle />
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