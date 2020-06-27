import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Router from "next/router";

import { useSession, signin, signout, getSession } from "next-auth/client";

import Link from "next/link";
import styles from "../styles/nav.module.scss";
import {
  FiMoon,
  FiSun,
  FiCoffee,
  FiHelpCircle,
  FiPackage,
  FiTwitter,
} from "react-icons/fi";

import NProgress from "nprogress";
import UserContext from "../ctx/UserContext";

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

function Nav() {
    const router = useRouter();

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
      if(router.pathname === "/eli5"){
        router.push("/");
      } else{
        router.push("/eli5");
      }
    }

    return (
      <header className="container">
        <div className={styles.brand}>
          <Link href="/">
            <a>winstall</a>
          </Link>
          {/* <span className="preview">&nbsp;(preview)</span> */}
        </div>

        <div className={styles.nav}>
          <User/>
          <Link href="/apps">
            <a>
              <FiPackage />
              <p>Apps</p>
            </a>
          </Link>
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

const User = () => {
  const { user, setUser } = useContext(UserContext);
  const [returnTo, setReturnTo] = useState("");
  const [session, loading] = useSession();

  useEffect(() => {
    setReturnTo(window.location.href)
    
    const getUser = async () => {
      await fetch("https://api.winstall.app/user").then(res => res.text()).then(res => console.log(res))
    }

    getSession().then(data => console.log(data))
    // getUser();

  }, [])


   return (
     <>
       {!session && (
          <a onClick={() => signin("twitter")}itle="Login with Twitter to create and share packs.">
            <FiTwitter />
            <p>Login</p>
          </a>
       )}
       {session && (

         <a onClick={signout}itle="Logout">
            <img src={session.user.image} alt="User profile picture"/>
            <p>Logout</p>
          </a>
       )}
     </>
   );

}

export default Nav;