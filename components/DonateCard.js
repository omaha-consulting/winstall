import styles from "../styles/donateCard.module.scss";
import { FiPlus } from "react-icons/fi";
import { RiPaypalFill } from "react-icons/ri";

const DonateCard = ({ addMargin = "both" }) => {
    return (
        <div className={`${styles.container} ${addMargin === "both" ? styles.margin : (addMargin === "top" ? styles.marginTop : null)}`}>
            <h2>Seamless Intune Integration, Effortless App Management with Pckgr</h2>
            <p><a href="https://intunepckgr.com/?navigation=winstall" rel="sponsored">Pckgr</a> simplifies your Intune application management. Utilizing winget, it streamlines software deployment with easy, one-click processes and automatic updates. Experience a user-friendly, secure way to manage apps across your enterprise. Start your 30 day free trial today!</p>
            <div className={styles.buttons}>
                <a className="button spacer accent donate" id="starWine" href="https://intunepckgr.com/?navigation=winstall" rel="sponsored"><FiPlus /> Try for Free</a>
            </div>
        </div>
    )
}

export default DonateCard;