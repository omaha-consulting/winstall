import React from "react";
import styles from "../styles/appList.module.scss";

function ListPackages(props){
    return (
        <ul className={props.showImg ? styles.appListImg : styles.appList}>
            {props.children}
        </ul>
    )
}

export default ListPackages;