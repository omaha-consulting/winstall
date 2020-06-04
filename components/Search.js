import React, { useState, useContext } from "react";
import styles from "../styles/search.module.scss";

import { DebounceInput } from "react-debounce-input";
import fuzzysort from "fuzzysort"

import SingleApp from "../components/SingleApp";

import {FiSearch} from "react-icons/fi";
import PackagesContext from "../ctx/PackagesContext";

function Search() {
  const [apps, setApps] = useState([])
  const [searchInput, setSearchInput] = useState();
  const { packages, setPackages } = useContext(PackagesContext);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);

    let results = fuzzysort.go(e.target.value.toLowerCase().replace(/\s/g, ""), packages, {
      limit: 5,
      allowTypo: true,
      threshold: -10000,
      key: "name",
    })

    results = [...results.map(r => r.obj)];
    results.sort((a, b) => a.name.localeCompare(b.name))

    setApps(results)
  };


  if (!apps) return <></>;

  return (
    <div>
      <div className={styles.searchBox}>
        <span>
          <FiSearch />
        </span>

        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          onChange={(e) => handleSearchInput(e)}
          placeholder={"Search for apps here"}
        />
      </div>

      {searchInput && apps.length !== 0 ? (
        <ul className={styles.searchResults}>
          {apps.map((app, i) =>
            <SingleApp
              app={app}
              showDesc={true}
              key={`${app._id}`}
            />
          )}
        </ul>
      ) : (
          <>{searchInput ? <p className={styles.noresults}>Could not find any apps.</p> : ""}</>
        )}
    </div>
  );
}

export default Search;
