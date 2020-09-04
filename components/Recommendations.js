import Link from "next/link";

import styles from "../styles/recommendations.module.scss"
import { FiPackage, FiPlus, FiGlobe, FiHome, FiChevronRight } from "react-icons/fi";
import { useEffect, useContext, useState, useRef } from "react";
import PackAppsList from "./PackAppsList";
import AppIcon from "./AppIcon";
import SelectedContext from "../ctx/SelectedContext";
import PackPreview from "./PackPreview";

const Recommendations = ({ packs }) => {
  return (
    <div className="homeBlock">
      <div className="box">
        <h2 className="blockHeader">Featured Packs</h2>
        <Link href="/packs">
          <a className="button small">
            <FiPackage />
            View All
          </a>
        </Link>
      </div>
      <h3 className="blockSubtitle">
        Just got a new Windows device? Start with our favourites. Click the +
        sign to include an app on your install script.
      </h3>

      <div className={styles.recommendations}>
        <PackList id="Z_tilUZjA" title="Web Browsers" packs={packs}>
          <FiGlobe />
        </PackList>

        <PackList id="A6JzO22Y1" title="Work From Home" packs={packs}>
          <FiHome />
        </PackList>
      </div>
    </div>
  );
};

const PackList = ({ children, title, id, packs}) => {
  const [packApps, setPackApps] = useState([]);
  const [pack, setPack] = useState();
  const headerRef = useRef(null);

  useEffect(() => {
    if (!packs) return;

    const pack = packs.find(p => p._id === id);

    if(!pack) return;

    setPackApps(pack.apps.slice(0, 5));
    setPack(pack);

  }, []);

  if(!pack) return <></>;

  return (
    <div className={styles.recommendation}>
      <Link href="/packs/[id]" as={`/packs/${pack._id}`} prefetch={false}>
        <a id={pack.accent} className={styles.packHeader} ref={headerRef}>
          {children}
          <h3>{title}</h3>
          <p>{pack.desc}</p>
        </a>
      </Link>

      <div className={styles.packListContainer}>
        {packApps && packApps.map((app) => <App key={app._id} data={app} />)}

        <Link href="/packs/[id]" as={`/packs/${pack._id}`} prefetch={false}>
          <a className="button subtle">
            View Pack <FiChevronRight />
          </a>
        </Link>
      </div>
    </div>
  );
};

const App = ({data}) => {
  const [selected, setSelected] = useState(false);
  const { selectedApps, setSelectedApps } = useContext(SelectedContext);

  useEffect(() => {
    let found = selectedApps.find((a) => a._id === data._id);

    setSelected(found);
  })

  let handleAppSelect = () => {
    let found = selectedApps.findIndex((a) => a._id === data._id);

    if (found !== -1) {
      let updatedSelectedApps = selectedApps.filter(
        (a, index) => index !== found
      );

      setSelectedApps(updatedSelectedApps);
      setSelected(false);

    } else {
      setSelected(true);

      setSelectedApps([...selectedApps, data]);
    }

  };

  return (
    <div className={`${styles.appContainer} ${selected ? styles.selected : null}`}>
  
      <Link href="/apps/[id]" as={`/apps/${data._id}`} prefetch={false}>
        <a>
          <AppIcon name={data.name} icon={data.icon} />
          <h4>{data.name}</h4>
        </a>
      </Link>

      <button
        className={styles.selectApp}
        onClick={handleAppSelect}
        aria-label={selected ? "Unselect app" : "Select app"}
      >
        <FiPlus/>
      </button>
    </div>
  )
}


export default Recommendations;
