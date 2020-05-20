import React, { useEffect, useState } from "react";

import PopularAppsList from "../utils/popularApps.json";
import SingleApp from "../components/SingleApp";
import { shuffleArray } from "../utils/helpers";

let PopularApps = ({selectApp}) => {
  const [randomPopularApps, setRandomPopularApps] = useState([]);

  useEffect(() => {
      if(randomPopularApps.length != 0) return;

      let generatePopularApps = shuffleArray(Object.entries(PopularAppsList)).slice(0, 6);

      setRandomPopularApps(generatePopularApps);
  })

  return (
    <div className="popular">
      <h2>Popular apps</h2>
      <h3>Click to include them on your install script</h3>
      <ul className="appList">
        {randomPopularApps.map((app) => (
          <SingleApp
            key={app[0]}
            name={app[1].name}
            img={app[1].img}
            moniker={app[0]}
            onClick={(isSelected) => selectApp(app, isSelected)}
          />
        ))}
      </ul>
    </div>
  );
};

export default PopularApps;