import{ useState } from "react";
import styles from "../styles/search.module.scss";

import { DebounceInput } from "react-debounce-input";
import Fuse from "fuse.js";

import SingleApp from "../components/SingleApp";
import ListPackages from "../components/ListPackages";

import {FiSearch} from "react-icons/fi";

function Search({apps}) {
  const [results, setResults] = useState([])
  const [searchInput, setSearchInput] = useState();

  const fuse = new Fuse(apps, {
    minMatchCharLength: 3,
    threshold: 0.3,
    keys: [{ name: "name", weight: 2 }, "path", "desc", "publisher", "tags"],
  });

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);

    if (e.target.value.length <= 3) return;

    let results = fuse.search(e.target.value.toLowerCase().replace(/\s/g, ""));

    setResults([...results.map((r) => r.item)]);
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
