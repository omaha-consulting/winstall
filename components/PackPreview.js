import styles from "../styles/packPreview.module.scss";
import AppIcon from "./AppIcon";
import { useState, useEffect, useRef} from "react";
import { FiPackage } from "react-icons/fi";
import Link from "next/link";

export default function PackPreview({ pack }){
    const [icons, setIcons] = useState([]);
    const headerRef = useRef(null);

    useEffect(() => {
        const icons = pack.apps.filter(app => app.icon !== "").map(a => a.icon);

        setIcons([...new Set(icons)].slice(0, 4));

        const gradients = [
            ["#9708CC", "#0078D7"],
            ["#9B2EFF", "#4286f4"],
            ["#6E1BDC", "#F138A7"],
            ["#FC466B", "#3F5EFB"],
            ["#C33764", "#1D2671"]
        ]

        const gradientColor = gradients[Math.floor(Math.random() * gradients.length)];
        
        var angle = Math.round(Math.random() * 360);

        let gradient = "linear-gradient(" + angle + "deg, " + gradientColor[0] + ", " + gradientColor[1] + ")";

        headerRef.current.style.backgroundImage = gradient;

    }, [])
    
    return (
        <Link href="/packs/[id]" as={`/packs/${pack._id}`} prefetch={false}>
            <a className={styles.packCard}>
                <header className={`${styles.packIcons} ${icons.length <= 2? styles.singleIcon : ""}`} ref={headerRef}>
                    <ul>
                        {
                          icons.map((icon, index) => <li key={index}><AppIcon icon={icon} /></li>)
                        }
                        { icons.length === 0 && (
                            <li><FiPackage/></li>
                        )}
                    </ul>
                </header>

                <div className={styles.packMeta}>
                    <h3>{pack.title}</h3>
                    <p>{pack.desc}</p>
                    <p className={styles.includes}>Includes {pack.apps.slice(0, 3).map(a => a.name).join(", ")}, and more.</p>
                    <button className="button accent"><FiPackage /> Get Pack</button>
                </div>
            </a>
        </Link>
    )
}