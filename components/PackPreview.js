import styles from "../styles/packPreview.module.scss";
import AppIcon from "./AppIcon";
import { useState, useEffect} from "react";
import { FiEdit, FiPackage, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

export default function PackPreview({ pack, hideMeta, showDelete=false, auth, deleted}){
    const [icons, setIcons] = useState([]);

    useEffect(() => {
        const icons = pack.apps.filter(app => app.icon !== "").map(a => a.icon);

        setIcons([...new Set(icons)].slice(0, 4));

    }, [])

    const deletePack = async () => {
        if(!auth) return;

        await fetch(
            `https://api.winstall.app/packs/${pack._id}`,
            {
                method: "DELETE",
                headers: {
                    'Authorization': `${auth.accessToken},${auth.refreshToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ creator: pack.creator })
            }
        ).then((data) => data.json()).then((data) => {
            if(data.msg){ // sucessfully deleted
                if(deleted) deleted(pack._id);
                localStorage.removeItem("ownPacks");
            }
        });
    }

    const handleDelete = async (e) => {
        if ('confirm' in window && typeof window.confirm === 'function') {
            if (window.confirm("Are you sure you want to delete this pack?")) {
                deletePack();
            }
        } else {
            deletePack();
        }

    }
    
    return (
        <div className={styles.packCard}>
            <Link href="/packs/[id]" as={`/packs/${pack._id}`} prefetch={false}>
                <a>
                    <header className={`${styles.packIcons} ${icons.length <= 2? styles.singleIcon : ""}`} id={pack.accent}>
                        <ul>
                            {
                            icons.map((icon, index) => <li key={index}><AppIcon icon={icon} /></li>)
                            }
                            { icons.length === 0 && (
                                <li><FiPackage/></li>
                            )}
                        </ul>
                    </header>
                </a>
            </Link>
            {!hideMeta && (
                <div className={styles.packMeta}>
                    <Link href="/packs/[id]" as={`/packs/${pack._id}`} prefetch={false}><a><h3>{pack.title}</h3></a></Link>
                    <p>{pack.desc}</p>
                    <p className={styles.includes}>Includes {pack.apps.slice(0, 3).map(a => a.name).join(", ")}, and more.</p>
                    <div className="box">
                        <Link href="/packs/[id]" as={`/packs/${pack._id}`} prefetch={false}>
                            <button className="button accent"><FiPackage /> View Pack</button>
                        </Link>

                        { showDelete && (
                            <div className={styles.packEdit}>
                                <Link href={`/packs/edit?id=${pack._id}`} prefetch={false}><button title="Edit Pack" className={`button subtle ${styles.delete}`} ><FiEdit /></button></Link>
                                <button className={`button subtle ${styles.delete}`} title="Delete Pack" onClick={handleDelete}><FiTrash2 /></button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}