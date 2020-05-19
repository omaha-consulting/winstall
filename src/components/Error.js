import React from "react";
import styles from "../styles/error.module.scss";

import clippy from "../assets/clippy.png";

function Error() {
  return (
      <div className={styles.error}>
          <img src={clippy} alt="Clippy sad face" draggable={false}/>
          <h1>Something went terribly wrong</h1>
          <h3>We are not too sure exactly what went wrong, but give it a try later!</h3>
      </div>
  )
}

export default Error;
