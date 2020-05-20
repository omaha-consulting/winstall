import React, { useState, useContext, useEffect, useRef } from "react";
import { DebounceInput } from "react-debounce-input";
import fuzzysort from "fuzzysort"
import PackageContext from "../utils/PackageContext";

const Search = () => {
  const [searchInput, setSearchInput] = useState();
  const [searchResults, setSearchResults] = useState();

  const handleSearchInput = (e, data) => {
    setSearchInput(e.target.value);

    setSearchResults(
      fuzzysort.go(
        e.target.value.toLowerCase().replace(/\s/g, ""),
        data,
        {
          limit: 30,
          allowTypo: true,
          threshold: -10000,
          key: "path",
        }
      )
    );
  };

  let SearchResults = () => {
    if(!searchResults) return <></>;
    
    return (
      searchResults.map(({ obj }, i) => <p key={i}>{obj.path}</p>)
    )
  }
 
  return (
    <PackageContext.Consumer>
      { value => (
        <div>
          <DebounceInput
            minLength={2}
            debounceTimeout={300}
            onChange={(e) => handleSearchInput(e, value)}
            placeholder="Search for apps here"
          />

          <SearchResults/>
        </div>
      )}
    </PackageContext.Consumer>
  );
}

export default Search;