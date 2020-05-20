import React, { useContext, useState } from "react";

import PackageContext from "../utils/PackageContext";

import styles from "../styles/home.module.scss";

import ListPackages from "../components/ListPackages";
import Search from "../components/Search";
import PopularApps from "../components/PopularApps";

import Error from "../components/Error";

function Home() {
  const packageData = useContext(PackageContext);

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
      let findIndex = selectedApps.findIndex(i => i.id === app.id)
      let updatedSelectedApps = selectedApps.filter(
        (a, index) => index !== findIndex
      );
      setSelectedApps(updatedSelectedApps);
    }
  }

  

  return (
    <div className="container">
      <div className={styles.intro}>
        <h1>Bulk install Windows apps quickly with a single-click.</h1>

        <Search />
      </div>


      <PopularApps
        selectApp={(app, isSelected) => selectApp(app, isSelected)}
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
