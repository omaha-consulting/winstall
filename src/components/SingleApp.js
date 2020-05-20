import React, {useState} from "react";
import styles from "../styles/singleApp.module.scss";

let SingleApp = ({ name, img, moniker, version, onClick }) => {
    const [selected, setSelected] = useState(false);

    return (
      <li key={moniker} onClick={e => {
        if(selected){
            setSelected(false)
            onClick(false)
        } else{
            setSelected(true)
            onClick(true)
        }
      }} className={selected ? styles.selected : ""}>
        <div className={styles.imgContainer}>
          <img src={img} alt={`Logo for ${name}`} draggable={false} />
        </div>
        <p>{name}</p>
      </li>
    );
}

export default SingleApp;