import React, { useContext, useState } from "react";
import { DebounceInput } from "react-debounce-input";

import PackageContext from "../utils/PackageContext";

import styles from "../styles/home.module.scss";

import ListPackages from "../components/ListPackages";
import PopularApps from "../components/PopularApps";

import Error from "../components/Error";

function Home() {
  const packageData = useContext(PackageContext);
  const [searchInput, setSearchInput] = useState();
  const [selectedApps, setSelectedApps] = useState([]);

  // TODO: show a loading element
  if(!packageData) return <></>;

  // let homeContent = () => {
  //   if (packageData.error) return <Error/>
  //   return (
  //       <ListPackages>
  //           {packageData.map((item, i) => (
  //               <h1 key={i}>{item.path}</h1>
  //           ))}
  //       </ListPackages>
  //   );
  // }

  let selectApp = (app, isSelected) => {
    if(isSelected){
      setSelectedApps([...selectedApps, app]);
    } else{
      let findIndex = selectedApps.findIndex(i => i.name === app.name)
      let updatedSelectedApps = selectedApps.filter(
        (a, index) => index !== findIndex
      );
      setSelectedApps(updatedSelectedApps);
    }
  }

  let SearchResults = () => {
    return (
      <div className={styles.searchResults}>
        <h1>Showing search results for {searchInput}</h1>
      </div>
    )
  }

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value)
  }

  return (
    <div className="container">
      <div className={styles.intro}>
        <h1>Bulk install Windows apps quickly with a single-click.</h1>

        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          onChange={(e) => handleSearchInput(e)}
          placeholder="Search for apps here"
        />
      </div>

      {searchInput ? <SearchResults /> : <></>}

      <PopularApps
        selectApp={(app, isSelected ) => selectApp(app, isSelected)}
      />

      {selectedApps.length != 0 && (
        <div className="bottomBar">
          <div className="container inner">
            <p>Selected {selectedApps.length} apps so far</p>
            <button>Generate script</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
