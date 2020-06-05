import React from "react";
import styles from "../styles/appList.module.scss";

function ListPackages({children}) {
  return (
    <ul className={styles.appList}>
      {children}
    </ul>
  );
}

export default ListPackages;