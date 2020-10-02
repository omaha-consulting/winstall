import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "../styles/alert.module.scss";

const Alert = ({ text, id, children, accent=false }) => {
    const [hidden, setHidden] = useState(true);
    
    useEffect(() => {
        const isHidden = localStorage.getItem(`alert-${id}`);

        if(!isHidden) setHidden(false);
    })

    const handleHide = () => {
        localStorage.setItem(`alert-${id}`, true);
        setHidden(true);
    }

    if (hidden) return null;

    return (
        <div className={`${styles.alert} ${accent ? styles.themed : ""}`}>
            {children}
            <p>{text}</p>
            <FiX onClick={handleHide} className={styles.close} title="Hide"/>
        </div>
    )
}

export default Alert;