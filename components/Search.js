import{ useState } from "react";
import styles from "../styles/search.module.scss";

import { DebounceInput } from "react-debounce-input";
import Fuse from "fuse.js";

import SingleApp from "../components/SingleApp";
import ListPackages from "../components/ListPackages";

import {FiSearch} from "react-icons/fi";
import { forceVisible } from 'react-lazyload';

function Search({apps, onSearch, label, placeholder}) {
  const [results, setResults] = useState([])
  const [searchInput, setSearchInput] = useState();
  const defaultKeys = [{ name: "name", weight: 2 }, "path", "desc", "publisher", "tags"];
  const [keys, setKeys] = useState(defaultKeys);

  const options = (keys) => {
    return {
      minMatchCharLength: 3,
      threshold: 0.3,
      keys
    }
  }

  let fuse = new Fuse(apps, options(defaultKeys));

  const handleSearchInput = (e) => {
    if(onSearch) onSearch(e.target.value);

    let query = e.target.value;

    if(query === ""){
      forceVisible(); // for some reason lazy load doesn't detect when the new elements roll in, so we force visible to all imgs
    }

    let prefixes = ["name", "tags", "publisher", "desc"];
    let checkPrefix = prefixes.filter(prefix => query.startsWith(`${prefix}:`));

    if(checkPrefix.length !== 0){
      setKeys(checkPrefix);
      query = query.replace(`${checkPrefix[0]}:`, "")
      fuse = new Fuse(apps, options(checkPrefix));

    } else if(keys !== defaultKeys){
      setKeys(defaultKeys)
      fuse = new Fuse(apps, options(defaultKeys));
    }

    setSearchInput(e.target.value);

    if (query<= 3) return;

    let results = fuse.search(query.toLowerCase().replace(/\s/g, ""));

    setResults([...results.map((r) => r.item)]);
  };


  if (!apps) return <></>;

  return (
    <div>
      <label htmlFor="search" className={styles.searchLabel}>{label || `${Math.floor(apps.length / 50) * 50}+ apps and growing.`}</label>
      <div className={styles.searchBox}>
        <div className={styles.searchInner}>
          <FiSearch />

          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            onChange={(e) => handleSearchInput(e)}
            id="search"
            placeholder={placeholder || "Search for apps here"}
          />
        </div>
        {results.length > 0 && searchInput && <p className={styles.searchHint}>Showing {results.length} {results.length === 1 ? "result" : "results"}.</p>}
      </div>

      {searchInput && results.length !== 0 ? (
        <ListPackages>
            {results.map((app, i) =>
            <SingleApp
              app={app}
              showDesc={true}
              key={`${app._id}`}
            />
          )}
        </ListPackages>
      ) : (
          <>{searchInput ? <p className={styles.noresults}>Could not find any apps.</p> : ""}</>
        )}
    </div>
  );
}

export default Search;
