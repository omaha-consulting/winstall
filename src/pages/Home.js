import React, { useContext } from "react";
import PackageContext from "../utils/PackageContext";

import styles from "../styles/home.module.scss";

import ListPackages from "../components/ListPackages";
import Error from "../components/Error";

function Home() {
  const packageData = useContext(PackageContext);

  // TODO: show a loading element
  if(!packageData) return <></>;


  let homeContent = (packageData) => {
    if (packageData.error) return <Error/>
    return (
        <ListPackages>
            {packageData.map((item, i) => (
                <h1 key={i}>{item.path}</h1>
            ))}
        </ListPackages>
    );
  }

  return (
    <div className={styles.container}>
      <header>
        <h1>Welcome to Winstall</h1>
        <h3>
          Create a one-click script that can be used to batch install apps using
          the Windows Package Manager on Windows 10.
        </h3>
      </header>

      { homeContent(packageData) }
    </div>
  );
}

export default Home;
