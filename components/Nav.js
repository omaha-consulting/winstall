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
  FiLogOut,
  FiGrid
} from "react-icons/fi";

import NProgress from "nprogress";

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
          <Link href="/apps">
            <a>
              <FiPackage />
              <p>Apps</p>
            </a>
          </Link>
          <Link href="/packs">
            <a>
              <FiGrid />
              <p>Packs</p>
            </a>
          </Link>
          <a
            href="https://ko-fi.com/mehedi"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.justIcon}
          >
            <FiCoffee />
          </a>
          <span onClick={handleExplainer}>
            <FiHelpCircle />
          </span>
          <span onClick={switchTheme}>
            <FiMoon className="moon" />
            <FiSun className="sun" />
          </span>
          <User />
        </div>
      </header>
    );
}

const User = () => {
    const [session, loading] = useSession();
    const [user, setUser] = useState();

    useEffect(() => {
      getSession().then(async (session) => {
        if(!session) return;

        await fetch(`https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/users/show.json?user_id=${session.user.id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER}`
          }
        }).then(data => data.json()).then(data => {
          setUser(data);
        })
      });
    }, [])

    return (
      <>
        {!session && (
            <a onClick={() => signin("twitter")} title="Login with Twitter to create and share packs.">
              <FiTwitter />
              <p>Login</p>
            </a>
        )}
        {session && (
          <>
            <Link href="/users/you">
              <a title="View your packs" className={styles.user}>
                <img src={session.user.image} alt="User profile picture" />
              </a>
            </Link>
            <span onClick={signout} title="Logout">
              <FiLogOut/>
            </span>
          </>
        )}
      </>
    );

}

export default Nav;