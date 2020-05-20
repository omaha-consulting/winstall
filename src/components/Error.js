import React from "react";
import { Link } from "react-router-dom";

import styles from "../styles/error.module.scss";

import clippy from "../assets/clippy.png";

function Error({title, subtitle}) {
  return (
      <div className={styles.error}>
          <img src={clippy} alt="Clippy sad face" draggable={false}/>
          <h1>{title ? title : "Something went terribly wrong."}</h1>
          <h3>{subtitle ? subtitle : "We are not too sure exactly what went wrong, but give it a try later!"}</h3>
          <Link to="/" className="button">
            Go Home
          </Link>
      </div>
  )
}

export default Error;
