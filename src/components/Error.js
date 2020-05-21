import React from "react";
import { Link } from "react-router-dom";

import styles from "../styles/error.module.scss";

import clippy from "../assets/clippy.png";

function Error({title, subtitle}) {
  return (
      <div className={styles.error}>
          <img src={clippy} alt="Clippy sad face" draggable={false}/>
          <h1>{title ? title : "Something went terribly wrong."}</h1>
          <h3>{subtitle ? subtitle : "It's looks like you're trying to find something that doesn't exist, would you like some help with that?"}</h3>
          <Link to="/" className="button">
            Go Home
          </Link>
      </div>
  )
}

export default Error;
