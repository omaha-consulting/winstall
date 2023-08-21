import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Router from "next/router";

import { useSession, signIn, signOut, getSession } from "next-auth/react";

import Link from "next/link";
import styles from "../styles/nav.module.scss";
import {
  FiMoon,
  FiSun,
  FiPackage,
  FiTwitter,
  FiLogOut,
  FiGrid,
  FiChevronDown,
  FiX,
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
  const [ddShown, setDDShown] = useState(false);
  const navRef = useRef(null);

  let handleClickOut = (e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setDDShown(false);
      navRef.current.classList.remove("shown");
    }

    if (navRef.current && navRef.current.contains(e.target)) {
      setDDShown(false);
      setTimeout(() => {
        navRef.current.classList.remove("shown");
      }, 200);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOut);

    // cleanup this component
    return () => {
      window.removeEventListener("mousedown", handleClickOut);
    };
  }, []);

  let switchTheme = () => {
    let body = document.querySelector("body");

    if (body.classList.contains("light")) {
      localStorage.setItem("wiTheme", "dark");
      body.classList.replace("light", "dark");
    } else {
      localStorage.setItem("wiTheme", "light");
      body.classList.replace("dark", "light");
    }
  };

  const toggleDD = () => {
    if (ddShown) {
      navRef.current.classList.remove("shown");
    } else {
      navRef.current.classList.add("shown");
    }

    setDDShown(!ddShown);
  };

  return (
    <header>
      <div className={styles.brand}>
        <Link href="/">
          <a>winstall</a>
        </Link>
        {/* <span className="preview">&nbsp;(preview)</span> */}
      </div>

      <div className={styles.nav} ref={navRef}>
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
        {/* <a
          href="https://ko-fi.com/mehedi"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.justIcon}
        >
          <FiHeart />
          <p className={styles.ddOnly}>Support winstall</p>
        </a> */}
        <span onClick={switchTheme} className={styles.justIcon}>
          <FiMoon className="moon" />
          <FiSun className="sun" />
          <p className={styles.ddOnly}>Switch theme</p>
        </span>
        <User />
      </div>

      <span className={`mobileDD ${styles.dropdown}`} onClick={toggleDD}>
        {ddShown ? <FiX /> : <FiChevronDown />}
      </span>
    </header>
  );
}

const User = () => {
  const { data: session } = useSession();

  const [user, setUser] = useState();

  useEffect(() => {
    getSession().then(async (session) => {
      if (!session) return;
      const { response, error } = await fetch("/api/twitter/", {
        method: "GET",
        headers: {
          endpoint: `https://api.twitter.com/1.1/users/show.json?user_id=${session.user.id}`,
        },
      }).then((res) => res.json());

      if (!error) {
        setUser(response);
      }
    });
  }, []);

  return (
    <>
      {!session && (
        <a
          onClick={() => signIn("twitter")}
          title="Login with Twitter to create and share packs."
        >
          <FiTwitter />
          <p>Login</p>
        </a>
      )}
      {session && (
        <>
          <Link href="/users/you">
            <a title="View your packs" className={styles.user}>
              <img src={session.user.picture} alt="User profile picture" />
              <p className={styles.ddOnly}>Your packs</p>
            </a>
          </Link>
          <span onClick={signOut} title="Logout" className={styles.justIcon}>
            <FiLogOut />
            <p className={styles.ddOnly}>Logout</p>
          </span>
        </>
      )}
    </>
  );
};

export default Nav;
