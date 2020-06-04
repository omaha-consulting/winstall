import Link from "next/link";
import SingleApp from "../components/SingleApp";
import ListPackages from "../components/ListPackages";

import PopularContext from "../ctx/PopularContext";

import {FiPackage} from "react-icons/fi";
import { useEffect, useContext } from "react";

let PopularApps = ({ apps, all }) => {
  const { popular, setPopular } = useContext(PopularContext);

  useEffect(() => {
    if(popular.length === 0){
      setPopular(apps.slice(0, 6));
    }
  })

  return (
    <PopularContext.Consumer>
      {({ popular }) => (
        <div className="popular">
          <div className="box">
            <h2>Popular apps</h2>
            <Link href="/store">
              <a className="button">
                <FiPackage />
                View All
              </a>
            </Link>
          </div>
          <h3>Click to include them on your install script</h3>
          <ListPackages showImg={true}>
            {popular.map((app) => (
              <SingleApp app={app} key={app._id} all={all}/>
            ))}
          </ListPackages>
        </div>
      )}
    </PopularContext.Consumer>
  );
};

export default PopularApps;