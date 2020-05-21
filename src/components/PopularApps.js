import React from "react";
import { Link } from "react-router-dom";

import SingleApp from "../components/SingleApp";
import ListPackages from "../components/ListPackages";

import PopularContext from "../ctx/PopularContext";

import {FiPackage} from "react-icons/fi";

let PopularApps = () => {
  return (
    <PopularContext.Consumer>
      {(value) => (
        <div className="popular">
          <div className="box">
            <h2>Popular apps</h2>
            <Link to="/store" className="button">
              <FiPackage />
              View All
            </Link>
          </div>
          <h3>Click to include them on your install script</h3>
          <ListPackages showImg={true}>
            {value.map((app) => (
              <SingleApp app={app} key={app.id} />
            ))}
          </ListPackages>
        </div>
      )}
    </PopularContext.Consumer>
  );
};

export default PopularApps;