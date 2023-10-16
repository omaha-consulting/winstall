import styles from "../styles/donateCard.module.scss";
import { FiPlus } from "react-icons/fi";
import { RiPaypalFill } from "react-icons/ri";

const DonateCard = ({ addMargin = "both" }) => {
    return (
        <div className={`${styles.container} ${addMargin === "both" ? styles.margin : (addMargin === "top" ? styles.marginTop : null)}`}>
            <h2>Get your own winget repository</h2>
            <p>This web site is brought to you by <a href="https://winget.pro">winget.Pro</a>. It's a service that gives you your own winget repository. Start uploading and installing your apps today!</p>

            <div className={styles.buttons}>
                <a className="button spacer accent donate" id="starWine" href="https://winget.pro"><FiPlus /> Create a repository</a>
            </div>
        </div>
    )
}

export default DonateCard;