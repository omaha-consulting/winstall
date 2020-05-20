import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { initDB, useIndexedDB } from "react-indexed-db";

import dbConfig from "./utils/dbConfig";

import "./styles/base.scss";

import PackageContext from "./utils/PackageContext";
import addToLocalDB from "./utils/addToLocalDB";

import Home from "./pages/Home";
import Error from "./components/Error";
import Nav from "./components/Nav";
import SelectedContext from './utils/SelectedContext';
import Generate from "./pages/Generate";
import All from "./pages/All";

initDB(dbConfig);

function App() {
  const [selectedApps, setSelectedApps] = useState([]);
  const selectedAppValue = { selectedApps, setSelectedApps };

  let [packageData, setPackageData] = useState();

  let localData = useIndexedDB("packages")
  
  useEffect(() => {
    // we are caching the packges repository, because otherwise it bombards the 
    // github API and reaches api limit quickly
    setPackageData({loading: true})

    // function for checking if rehydro is needed
    let checkRehydation = new Promise((resolve) => {
      let timeNow = new Date();
      let lastRehydrate =  localStorage.getItem("winstallRehydro");

      if (lastRehydrate) {
        lastRehydrate = new Date(lastRehydrate);
        let timeDiffernece = Math.abs(lastRehydrate - timeNow) / 36e5;

        if (timeDiffernece >= 1) {
          localStorage.setItem("winstallRehydro", timeNow)
          resolve(true)
        } else {
          resolve(false)
        }
      } else {
        localStorage.setItem("winstallRehydro", timeNow)
        resolve(true)
      }
    })

    // we need to get the SHA for the manifest to be able to query the github api
    let getSha = async () => {
      let sha = "";

      await fetch("https://api.github.com/repos/microsoft/winget-pkgs/git/trees/master").then(res => res.json()).then((data) => {
        let manifest = data.tree.find(files => files.path === "manifests");
        sha = manifest.sha;
      })

      return sha;
    }

    let loadData = (needsRehydration=false) => {
      localData.getAll().then(async (items) => {
        // if we don't have any data on the IndexedDB, we go to GitHub and ask for the 
        // list of packages
        if (items.length === 0 || needsRehydration) {
          let manifsetSha = await getSha();

          fetch(
            `https://api.github.com/repos/microsoft/winget-pkgs/git/trees/${manifsetSha}?recursive=1`
          ).then(res => res.json()).then(async (data) => {
            localData.clear();

            let filteredData = data.tree.filter((item) => item.path.toLowerCase().includes(".yaml")); // we are only interested in the manifest files

            addToLocalDB(localData, filteredData) // this cleans up the data, makes sure there's only a single entry for an app

            setPackageData(await localData.getAll()); // we
          }).catch((error) => {
            setPackageData({ error })
          });
        } else {
          setPackageData(await localData.getAll());
        }
      })
    }

    // we check if rehydraiton is needed, and then load the data accordingly
    checkRehydation.then(status => {
      loadData(status);
    })

   
  }, [])
  
  return (
    <Router>
      <PackageContext.Provider value={packageData}>
        <SelectedContext.Provider value={selectedAppValue}>
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/generate" exact component={Generate} />
            <Route path="/all" exact component={All} />
            <Route component={Error} />
          </Switch>
        </SelectedContext.Provider>
      </PackageContext.Provider>
    </Router>
  );
}

export default App;
