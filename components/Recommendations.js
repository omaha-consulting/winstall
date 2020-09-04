import Link from "next/link";

import styles from "../styles/recommendations.module.scss"
import { FiPackage } from "react-icons/fi";
import { useEffect, useContext } from "react";

const Recommendations = ({ apps }) => {
  return (
    <div>
        <PackList id="Z_tilUZjA" title="Web Browsers" apps={apps}/>

    </div>
  );
};

const PackList = ({ title, id, apps}) => {
  return (
    <div>
      <h3>{title}</h3>

      { apps && apps.map(app => <p>{app.name}</p>)}
    </div>
  );
};

export async function getStaticProps(){
  let apps = await fetch(`https://api.winstall.app/packs/Z_tilUZjA`).then((res) => res.json());
  console.log(apps)
  return (
    {
      props: {
        apps,
      }
    }
  )
}

export default Recommendations;
