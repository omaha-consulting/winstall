import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PopularAppsList from "../utils/popularApps.json";
import SingleApp from "../components/SingleApp";
import ListPackages from "../components/ListPackages";
import { shuffleArray } from "../utils/helpers";

let PopularApps = () => {
  const [randomPopularApps, setRandomPopularApps] = useState([]);

  useEffect(() => {
      if(randomPopularApps.length != 0) return;

      let generatePopularApps = shuffleArray(Object.values(PopularAppsList)).slice(0, 6);

      setRandomPopularApps(generatePopularApps);
  })

  return (
    <div className="popular">
      <div className="box">
        <h2>Popular apps</h2>
        <Link to="/store" className="button">View all</Link>
      </div>
      <h3>Click to include them on your install script</h3>
      <ListPackages showImg={true}>
        {randomPopularApps.map((app) => (
          <SingleApp app={app} key={app.id}/>
        ))}
      </ListPackages>
    </div>
  );
};

export default PopularApps;