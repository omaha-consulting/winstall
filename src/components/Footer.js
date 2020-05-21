import React from "react";
import styles from "../styles/footer.module.scss";

import {FaJira} from "react-icons/fa";
import meh from "../assets/meh.png";

export default function Footer(){
    return (
      <div className={styles.footer}>
        <a
          href="https://builtbymeh.com/"
          target="_blank"
          rel="noopener noreferrer"
        ><img src={meh} alt="builtbymeh.com logo" draggable={false}/></a>
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
      </div>
    );
}