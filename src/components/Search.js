import React, { useState, useContext, useEffect, useMemo } from "react";
import { DebounceInput } from "react-debounce-input";
import fuzzysort from "fuzzysort"
import PackageContext from "../utils/PackageContext";

import processManifests from "../utils/processManifests";
import { useIndexedDB } from "react-indexed-db";
import Skeleton from "react-loading-skeleton";
import SingleApp from "../components/SingleApp";

import styles from "../styles/search.module.scss";

const Search = () => {
  const [searchInput, setSearchInput] = useState();
  const [searchResults, setSearchResults] = useState();
  const packageData = useContext(PackageContext)
  let localData = useIndexedDB("packages");

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);

    setSearchResults(
      fuzzysort.go(
        e.target.value.toLowerCase().replace(/\s/g, ""),
        packageData,
        {
          limit: 6,
          allowTypo: true,
          threshold: -10000,
          key: "path",
        }
      )
    );
  };

  let SearchResults = () => {
    const [appsData, setAppsData] = useState([]);
    
    
    useEffect(() => {
      if(!searchResults) return;
      localData.getAll().then((apps) => {
        searchResults.map(async ({ obj }) => {
          let app = apps.find((i) => i.path === obj.path);

          if (!app.contents) {
            processManifests(obj).then((newData) => {
              app.contents = newData;
              localData.update({ ...obj, contents: newData }, obj.path);
              setAppsData((oldArray) => [...oldArray, app]);
            });
          } else{
            setAppsData(oldArray => [...oldArray, app]);
          }

          // let appData = await getAppData();
          // setAppsData([...appsData, appData])
        });
     })
     
    }, [])
    
    if (!searchResults || searchResults.length === 0) return <></>;

    let sanitize = (obj) => {
      obj.id = obj.contents.Id;
      obj.name = obj.contents.Name;
      obj.publisher = obj.contents.Publisher;
      obj.version = obj.contents.Version;
      obj.desc = obj.contents.Description;
      obj.homepage = obj.contents.Homepage;

      return obj;
    }

    return (
      <ul className={styles.searchResults}>
        {appsData.map((app, index) => (
          <React.Fragment key={index}>
            <SingleApp app={sanitize(app)}/>
          </React.Fragment>
        ))}
      </ul>
    );
  }
 
  return (
    <div>
      <DebounceInput
        minLength={2}
        debounceTimeout={300}
        onChange={(e) => handleSearchInput(e)}
        placeholder="Search for apps here"
      />

      <SearchResults />
    </div>
  );
}

export default Search;