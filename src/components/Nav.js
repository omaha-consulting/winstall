import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/nav.module.scss";

function Nav() {
    const [theme, setTheme] = useState("light");


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
            <Link to="/">winstall</Link>

            <div className={styles.nav}>
                <span onClick={switchTheme}>Switch Theme</span>
            </div>
        </header>
    )
}

export default Nav;