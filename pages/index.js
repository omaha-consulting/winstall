import styles from "../styles/home.module.scss";

import Search from "../components/Search";
import PopularApps from "../components/PopularApps";
import SelectionBar from "../components/SelectionBar";
import MetaTags from "../components/MetaTags";
import Recommendations from "../components/Recommendations";

import Footer from "../components/Footer";
import { shuffleArray } from "../utils/helpers";
import popularAppsList from "../data/popularApps.json";
import FeaturePromoter from "../components/FeaturePromoter";
import Link from "next/link";
import { FiPlus, FiPackage } from "react-icons/fi";

function Home({ popular, apps, recommended }) {
  return (
    <div className="container">
      <MetaTags title="winstall - GUI for Windows Package Manager" />
      <div className={styles.intro}>
        <div className="illu-box">
          <h1>
            Bulk install Windows apps quickly with Windows Package Manager.
          </h1>
          <div className="art">
            <img
              src="/assets/logo.svg"
              draggable={false}
              alt="winstall logo"
            />
          </div>
        </div>
        <Search apps={apps} limit={4}/>
      </div>

      <PopularApps apps={popular} all={apps} />

      {/* <RecentApps apps={recents} /> */}
      <Recommendations packs={recommended}/>

      <FeaturePromoter art="/assets/packsPromo.svg" promoId="packs">
            <h3>Introducing Packs</h3>
            <h1>Curate and share the apps you use daily.</h1>
            <div className="box2">
                <Link href="/packs/create"><button className="button spacer accent" id="starWine"><FiPlus/> Create a pack</button></Link>
                <Link href="/packs/"><button className="button"><FiPackage/> View packs</button></Link>
            </div>
      </FeaturePromoter>

      <SelectionBar />

      <Footer />
    </div>
  );
}

export async function getStaticProps(){
  let popular = shuffleArray(Object.values(popularAppsList));
  let apps = await fetch(`${process.env.NEXT_PUBLIC_WINGET_API_BASE}/apps`, {
    headers: {
      'AuthKey': process.env.NEXT_PUBLIC_WINGET_API_KEY,
      'AuthSecret': process.env.NEXT_PUBLIC_WINGET_API_SECRET,
    }
  }).then((res) => res.json());

  let recommended = await fetch(`${process.env.NEXT_PUBLIC_WINGET_API_BASE}/packs/users/${process.env.NEXT_OFFICIAL_PACKS_CREATOR}`, {
    headers: {
      'AuthKey': process.env.NEXT_PUBLIC_WINGET_API_KEY,
      'AuthSecret': process.env.NEXT_PUBLIC_WINGET_API_SECRET,
    }
  }).then((res) => res.json());

  // get the new pack data, and versions data, etc.
  const getPackData = recommended.map(async (pack) => {
    return new Promise(async(resolve) => {
      const appsList = pack.apps;

      const getIndividualApps = appsList.map(async (app, index) => {
        return new Promise(async (resolve) => {
          let appData = await fetch(`${process.env.NEXT_PUBLIC_WINGET_API_BASE}/apps/${app._id}`, {
            headers: {
              'AuthKey': process.env.NEXT_PUBLIC_WINGET_API_KEY,
              'AuthSecret': process.env.NEXT_PUBLIC_WINGET_API_SECRET,
            }
          }).then(res => res.ok ? res.json() : null);
          appsList[index] = appData;
          resolve();
        })
      })

      await Promise.all(getIndividualApps).then(() => {
        pack.apps = appsList.filter(app => app != null);
        resolve();
      })
    })
  })

  await Promise.all(getPackData);
  
  return (
    {
      props: {
        popular,
        apps,
        recommended
      }
    }
  )
}

export default Home;
