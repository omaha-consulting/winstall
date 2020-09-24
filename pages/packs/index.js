import PageWrapper from "../../components/PageWrapper";
import MetaTags from "../../components/MetaTags";
import SelectionBar from "../../components/SelectionBar";
import styles from "../../styles/apps.module.scss";
import PackPreview from "../../components/PackPreview";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function Packs({ packs }) {
  
    return (
        <PageWrapper>
            <MetaTags title="Packs - winstall" />

            <div>
                <div className={styles.controls}>
                    <h1>All packs {`(${packs.length})`}</h1>

                    <Link href="/packs/create">
                        <a className="button"><FiPlus/> Create Pack</a>
                    </Link>
                    {/* <Pagination/> */} 
                </div>

                <ul className={`${styles.all} ${styles.storeList}`}>
                    {packs.map(pack => <li key={pack._id}><PackPreview pack={pack}/></li>)}
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
        revalidate: 1
    };
}