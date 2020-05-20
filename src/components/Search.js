import React, { useContext, useState, useEffect } from "react";
import styles from "../styles/search.module.scss";

import { useIndexedDB } from "react-indexed-db";
import { DebounceInput } from "react-debounce-input";
import fuzzysort from "fuzzysort"

import SingleApp from "../components/SingleApp";
import processManifests from "../utils/processManifests";
import { sortArray, sanitize } from "../utils/helpers";

import Skeleton from 'react-loading-skeleton';

function Search() {
  let localData = useIndexedDB("packages")
  const [apps, setApps] = useState([])
  const [searchInput, setSearchInput] = useState();
  const [appsData, setAppsData] = useState([]);
  const [pulled, setPulled] = useState(new Set());

  useEffect(() => {
    if (apps.length !== 0) return;

    localData.getAll().then((items) => {
      items.map(i => i.loaded = i.loaded ? i.loaded : false)
      setAppsData(items);
    })
  })

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    let results = fuzzysort.go(e.target.value.toLowerCase().replace(/\s/g, ""), appsData, {
      limit: 6,
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
      processManifests(obj).then((newData) => {
        app.contents = newData;
        localData.update({ ...obj, contents: newData }, obj.path);
        app.loaded = true;
        app.loading = false;
        setPulled(pulled.add(obj.path));
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
      <DebounceInput
        minLength={2}
        debounceTimeout={300}
        onChange={(e) => handleSearchInput(e)}
        placeholder="Search for apps here"
      />

      <ul className={styles.searchResults}>
        {apps.map((app) => app.loaded ? (
          <SingleApp app={sanitize(app)} key={app.contents.Id} />
        ) : (
            <LoadApp app={app} key={app.path} />
          ))}
      </ul>

    </div>
  );
}

export default Search;
