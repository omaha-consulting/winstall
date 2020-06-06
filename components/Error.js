import Link from "next/link";

import styles from "../styles/error.module.scss";

import {FiHome} from "react-icons/fi";

function Error({title, subtitle}) {
  return (
    <div className={styles.error}>
      <img
        src={`/assets/clippy.png`}
        alt="Clippy sad face"
        draggable={false}
      />
      <h1>{title ? title : "Something went terribly wrong."}</h1>
      <h3>
        {subtitle
          ? subtitle
          : "It's looks like you're trying to find something that doesn't exist, would you like some help with that?"}
      </h3>
      <Link href="/">
        <a className={styles.btnError}>
          <div>
            <FiHome />
            Go Home
          </div>
        </a>
      </Link>
    </div>
  );
}

export default Error;
