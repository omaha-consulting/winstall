import PageWrapper from "../../components/PageWrapper";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import styles from "../../styles/apps.module.scss";
import PackPreview from "../../components/PackPreview";
import Link from "next/link";
import { FiPackage, FiPlus } from "react-icons/fi";
import FeaturePromoter from "../../components/FeaturePromoter";

export default function Packs({ packs }) {
  
    return (
        <PageWrapper>
            <MetaTags title="Packs - winstall" desc="Checkout the community's app collections for your new Windows 10 machine." />

            <div>
                <FeaturePromoter art="/assets/packsPromo.svg" promoId="packs" disableHide={true}>
                    <h3>Introducing Packs</h3>
                    <h1>Curate, share, and show off the apps you use daily.</h1>
                    <div className="box2">
                        <Link href="/packs/create"><button className="button spacer accent" id="starWine"><FiPlus/> Create a pack</button></Link>
                    </div>
                </FeaturePromoter>

                <div className={styles.controls}>
                    <h1>All packs {`(${packs.length})`}</h1>
                    {/* <Pagination/> */} 
                </div>

                
                <ul className={`${styles.all} ${styles.storeList}`}>
                    {packs.map(pack => <li key={pack._id}><PackPreview pack={pack} /></li>)}
                </ul>
            </div>

            <SelectionBar />
        </PageWrapper>
    )
}

export async function getStaticProps() {
    let packs = await fetch(`https://api.winstall.app/packs`).then((res) =>
        res.json()
    );

    packs = packs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return {
        props: {
            packs,
        },
        revalidate: 600
    };
}