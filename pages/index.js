import styles from "../styles/home.module.scss";

import Search from "../components/Search";
import PopularApps from "../components/PopularApps";
import RecentApps from "../components/RecentApps";
import SelectionBar from "../components/SelectionBar";
import MetaTags from "../components/MetaTags";
import Recommendations from "../components/Recommendations";

import Footer from "../components/Footer";
import { shuffleArray } from "../utils/helpers";
import popularAppsList from "../data/popularApps.json";

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
        <Search apps={apps} />
      </div>

      <PopularApps apps={popular} all={apps} />

      {/* <RecentApps apps={recents} /> */}
      <Recommendations packs={recommended}/>

      <SelectionBar />

      <Footer />
    </div>
  );
}

export async function getStaticProps(){
  let popular = shuffleArray(Object.values(popularAppsList));
  let apps = await fetch(`https://api.winstall.app/apps`).then((res) => res.json());

  let recommended = await fetch(`https://api.winstall.app/packs/users/${process.env.NEXT_OFFICIAL_PACKS_CREATOR}`).then((res) => res.json());

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
