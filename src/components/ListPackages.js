import React from "react";
import styles from "../styles/home.module.scss";

function ListPackages(props){
    return (
        <div className={styles.listPackageContainer}>
            {props.children}
        </div>
    )
}

export default ListPackages;