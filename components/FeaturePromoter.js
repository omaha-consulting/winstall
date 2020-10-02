import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "../styles/featurePromoter.module.scss";

const FeaturePromoter = ({children, art, promoId, disableHide=false}) => {
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        if(disableHide) {
            setHidden(false);
            return;
        }
        
        if(!promoId) return;

        const isHidden = localStorage.getItem(`featurePromo-${promoId}`);

        if(isHidden === null) setHidden(false);
    }, []);

    const handleHide = () => {
        setHidden(true);

        if(!promoId) return;

        localStorage.setItem(`featurePromo-${promoId}`, true);
    }

    if(hidden) return null;

    return (
        <div className={styles.container} id="deepBlue">
            {!disableHide && <button className={styles.hide} onClick={handleHide}><FiX/></button>}
            {art && <img src={art} draggable={false}/>}
            <div className={styles.slogan}>
               {children}
            </div>
        </div>
    )
}

export default FeaturePromoter;