import React from "react";
import styles from "../styles/appList.module.scss";

function ListPackages({children, popular}) {
  return <ul className={`${styles.appList} ${popular ? styles.popularList : ""}`}>{children}</ul>;
}

export default ListPackages;