import React, { useEffect } from "react";
import styles from "../styles/footer.module.scss";

import {FaJira} from "react-icons/fa";
import { FiChevronUp } from "react-icons/fi";

export default function Footer(){

  useEffect(() => {
    window.onscroll = function(){scrollFunction()};
  }, []);

  const scrollFunction = () => {
    const btnTop = document.getElementById('btnTop');
    
    if((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && btnTop){
      btnTop.style.display = "flex";
    } else if(btnTop){
      btnTop.style.display = "none";
    }
  }

  const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

    return (
      <div className={styles.footer}>
        <a
          href="https://builtbymeh.com/"
          target="_blank"
          rel="noopener noreferrer"
        ><img src={"./assets/meh.png"} alt="builtbymeh.com logo" draggable={false}/></a>
        <p>
          <a
            href="https://twitter.com/mehedih_"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built by Mehedi Hassan
          </a>{" "}
          <FaJira />{" "}
          <a
            href="https://github.com/MehediH/winstall"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contribute on GitHub
          </a>
        </p>
        <p className={styles.disclaimer}>
          winstall is not associated with Microsoft, Windows, or Windows Package
          Manager.
        </p>
        <span id="btnTop" title="Go to top" onClick={topFunction} className={styles.backToTop}>
          <FiChevronUp />
        </span>
      </div>
    );
}