import React, { useState, useEffect } from "react";
import styles from "../styles/search.module.scss";

import { useIndexedDB } from "react-indexed-db";
import { DebounceInput } from "react-debounce-input";
import fuzzysort from "fuzzysort"

import SingleApp from "../components/SingleApp";
import processManifests from "../utils/processManifests";
import { sortArray, sanitize } from "../utils/helpers";

import Skeleton from 'react-loading-skeleton';
import PropagateLoader from "react-spinners/PropagateLoader";

import {FiSearch} from "react-icons/fi";

function Search() {
  let localData = useIndexedDB("packages")
  const [apps, setApps] = useState([])
  const [searchInput, setSearchInput] = useState();
  const [appsData, setAppsData] = useState([]);
  const [pulled, setPulled] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (apps.length !== 0) return;

    getApps();
  }, [])

  const getApps = () => {
    localData.getAll().then((items) => {
      if(items.length === 0){
        getApps();
        return;
      }

      items.map((i) => (i.loaded = i.loaded ? i.loaded : false));
      setAppsData(items);
      setLoading(false);
    });
  }

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    let results = fuzzysort.go(e.target.value.toLowerCase().replace(/\s/g, ""), appsData, {
      limit: 5,
      allowTypo: true,
      threshold: -10000,
      key: "path",
    })

    results = [...results.map(r => r.obj)];
    results.sort((a, b) => a.name.localeCompare(b.name))

    results.sort((a, b) => (+b.loaded) - (+a.loaded))
   
    setApps(results)
  };

  const selectivePull = (obj) => {
    let app = apps.find((i) => i.path === obj.path);

    if (!app.contents && !pulled.has(obj.path)) {
      setPulled(pulled.add(obj.path));
      processManifests(obj).then((newData) => {
        app.contents = newData;
        localData.update({ ...obj, contents: newData }, obj.path);
        app.loaded = true;
        app.loading = false;
        setApps((oldArray) => sortArray([...new Set([...oldArray, app])]));
      });
    } else {
      app.loaded = true;
      app.loading = false;
      setApps((oldArray) => sortArray([...new Set([...oldArray, app])]));
    }
  }

  let LoadApp = ({ app }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (loading) return
      setLoading(true)
      selectivePull(app)
    }, [])

    return <Skeleton height={180}/>
  }
  
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
          placeholder={loading ? "Loading apps..." : "Search for apps here"}
          disabled={loading}
        />
      </div>

      {searchInput && (
        <>
          {loading ? (
            <div className={styles.loader}>
              <PropagateLoader color="#9b2eff" />
            </div>
          ) : (
            <>
              {apps.length !== 0 ? (
                <ul className={styles.searchResults}>
                  {apps.map((app, i) =>
                    app.loaded ? (
                      <SingleApp
                        app={sanitize(app)}
                        showDesc={false}
                        key={`${app.contents.Id}-${i}`}
                      />
                    ) : (
                      <LoadApp app={app} key={app.path} />
                    )
                  )}
                </ul>
              ) : (
                <p>Could not find any apps.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Search;
