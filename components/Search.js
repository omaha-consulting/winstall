import{ useState, useEffect } from "react";
import styles from "../styles/search.module.scss";

import { DebounceInput } from "react-debounce-input";
import Fuse from "fuse.js";

import SingleApp from "../components/SingleApp";
import ListPackages from "../components/ListPackages";

import { FiSearch, FiHelpCircle } from "react-icons/fi";
import { forceVisible } from 'react-lazyload';
import { useRouter } from "next/router";

function Search({ apps, onSearch, label, placeholder, preventGlobalSelect, isPackView, alreadySelected=[], limit=-1}) {
  const [results, setResults] = useState([])
  const [searchInput, setSearchInput] = useState();
  const defaultKeys = [{ name: "moniker", weight: 2 }, { name: "name", weight: 2 }, "path", "desc", "publisher", "tags"];
  const [keys, setKeys] = useState(defaultKeys);
  const router = useRouter();
  const [urlQuery, setUrlQuery] = useState();

  const options = (keys) => {
    return {
      minMatchCharLength: 3,
      threshold: 0.3,
      keys
    }
  }

  let fuse = new Fuse(apps, options(defaultKeys));

  useEffect(() => {
    // if we have a ?q param on the url, we deal with it
    if (apps.length !== 0 && router.query && router.query.q && urlQuery !== router.query.q){
      handleSearchInput(null, router.query.q)
      setUrlQuery(router.query.q)
    } else if(results != 0 && urlQuery && router.query && !router.query.q){
      // if we previously had a query, going back should reset it.
      setSearchInput("");
      setResults([]);
      onSearch();
    }
  })

  const handleSearchInput = (e, q) => {
    const inputVal = e ? e.target.value : q;

    if(onSearch) onSearch(inputVal);

    let query = inputVal;

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

    setSearchInput(inputVal);

    if (query<= 3) return;

    let results = fuse.search(query.toLowerCase().replace(/\s/g, ""));

    setResults([...results.map((r) => r.item).slice(0, (limit ? limit : results.length))]);
  };


  if (!apps) return <></>;

  return (
    <div>
      <label htmlFor="search" className={styles.searchLabel}>{label || `${Math.floor(apps.length / 50) * 50}+ packages and growing.`}</label>
      <div className={styles.searchBox}>
        <div className={styles.searchInner}>
          <FiSearch />

          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            onChange={(e) => handleSearchInput(e)}
            id="search"
            value={searchInput}
            autoComplete="off"
            autoFocus={true}
            placeholder={placeholder || "Search for apps here"}
          />
        </div>
        
        <div className={styles.tip}>
          <a href="#" title="Search tips"><FiHelpCircle /></a>
          <div className={styles.tipData}>
            <p>Use search prefixes to target a specific field in searches!</p>
            <ul>
              <li><code>name:</code> search for an app's name</li>
              <li><code>publisher:</code> search for apps by a publisher</li>
              <li><code>tags:</code> search for apps by a tag</li>
              <li><code>desc:</code> search the description of apps</li>
            </ul>
          </div>
        </div>
        {searchInput && results.length === limit &&
          <p className={styles.searchHint}>
            Showing {results.length} result
            {results.length > 1 && "s"}
            . {results.length == limit &&
              <a href={`/apps?q=${searchInput}`}>More</a>
            }
          </p>
        }
      </div>

      {searchInput && results.length !== 0 ? (
        <ListPackages>
            {results.map((app, i) =>
            <SingleApp
              app={app}
              showDesc={true}
              preventGlobalSelect={preventGlobalSelect}
              pack={isPackView}
              hideBorder={true}
              key={`${app._id}`}
              preSelected={alreadySelected.findIndex(a => a._id === app._id) != -1 ? true : false}
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
