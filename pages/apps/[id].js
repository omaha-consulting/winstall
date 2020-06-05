import styles from "../../styles/home.module.scss";

import PopularApps from "../../components/PopularApps";
import SelectionBar from "../../components/SelectionBar";

import Footer from "../../components/Footer";
import { shuffleArray } from "../../utils/helpers";
import popularAppsList from "../../data/popularApps.json";

function AppDetail({ app }) {
  if(!app) return <></>;
  
  return (
    <div className="container">
      <div className={styles.intro}>
        <div className="illu-box">
          <div className="meta">
            <h1>{app.name}</h1>
            <h2>by {app.publisher}</h2>
            <p>{app.desc}</p>
          </div>
          <div className="art">
            <img
              src="../assets/logo.svg"
              draggable={false}
              alt="winstall logo"
            />
          </div>
        </div>
      </div>

      {/* <PopularApps apps={popular} all={apps} /> */}

      <SelectionBar />

      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
    // let apps = await fetch(`https://api.winstall.app/apps`).then((res) =>
    //   res.json()
    // );

    // apps = Object.values(apps)

    // let paths = await apps.map((app) => {
    //     return {
    //       params: {
    //         id: app._id,
    //       },
    //     };
    // })

    // console.log(paths)

    return {
      paths: [],
      fallback: true,
    };
}

export async function getStaticProps({ params }) {
    let app = await fetch(`https://api.winstall.app/apps/${params.id}`).then((res) =>
        res.json()
    );

    return {
        props: {
            app
        },
        unstable_revalidate: 1
    }
}

export default AppDetail;
