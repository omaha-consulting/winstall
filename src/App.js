import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./styles/base.scss";

import PackageContext from "./utils/PackageContext";
import Home from "./pages/Home";

import processManifests from "./utils/processManifests";

function App() {
  let [packageData, setPackageData] = useState();

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/microsoft/winget-pkgs/git/trees/03bc547854f08f73900b22471ddd99b4397a9373?recursive=1"
    ).then(res => res.json()).then((data) => {
      setPackageData(processManifests(data))
    }).catch((error) => {
      setPackageData({ error })
    });
  }, [])
  
  return (
    <Router>
      <Switch>
        <PackageContext.Provider value={packageData}>
            <Route exact path="/" component={Home} />
        </PackageContext.Provider>
      </Switch>
    </Router>
  );
}

export default App;
