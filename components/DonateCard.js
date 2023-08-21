import styles from "../styles/donateCard.module.scss";
import { FiHeart } from "react-icons/fi";
import { RiPaypalFill } from "react-icons/ri";

const DonateCard = ({ addMargin = true }) => {
    // temporarily hide the donate cards
    return null;

    return (
        <div className={`${styles.container} ${addMargin ? styles.margin : null}`}>
            <h2>Support winstall's development</h2>
            <p>To help keep winstall free and the servers alive, please contribute towards the project by donating. Every little helps.</p>

            <div className={styles.buttons}>
                <a className="button spacer accent donate" id="starWine" href="https://github.com/sponsors/MehediH?frequency=one-time&sponsor=MehediH" target="_blank" rel="noopener noreferrer"><FiHeart /> Sponsor on GitHub</a>
                <a className="button spacer accent donate" id="starWine" href="https://www.paypal.com/paypalme/MehediHa/10" target="_blank" rel="noopener noreferrer"><RiPaypalFill /> Donate via PayPal</a>
            </div>
        </div>
    )
}

export default DonateCard;