import Link from "next/link";
import SingleApp from "../components/SingleApp";
import ListPackages from "../components/ListPackages";

import { FiPackage } from "react-icons/fi";

let RecentApps = ({ apps }) => {

  return (
    <div className="popular">
      <div className="box">
        <h2>Recent apps</h2>
        <Link href="/apps">
          <a className="button">
            <FiPackage />
            View All
          </a>
        </Link>
      </div>
      <h3>All the latest app updates</h3>
      <ListPackages>
        {apps.map((app) => (
          <SingleApp app={app} key={app._id} />
        ))}
      </ListPackages>
    </div>
  );
};

export default RecentApps;
