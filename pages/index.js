import styles from "../styles/home.module.scss";

import Search from "../components/Search";
import PopularApps from "../components/PopularApps";
import RecentApps from "../components/RecentApps";
import SelectionBar from "../components/SelectionBar";
import MetaTags from "../components/MetaTags";

import Footer from "../components/Footer";
import { shuffleArray } from "../utils/helpers";
import popularAppsList from "../data/popularApps.json";

function Home({ popular, apps, recents }) {
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

      <RecentApps apps={recents} />

      <SelectionBar />

      <Footer />
    </div>
  );
}

export async function getStaticProps(){
  let popular = shuffleArray(Object.values(popularAppsList));
  let apps = await fetch(`https://api.winstall.app/apps`).then((res) => res.json());
  let recents = await fetch(`https://api.winstall.app/apps/recent?limit=8`).then((res) => res.json());
  recents = recents.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); 
  return (
    {
      props: {
        popular,
        apps,
        recents
      }
    }
  )
}

export default Home;
